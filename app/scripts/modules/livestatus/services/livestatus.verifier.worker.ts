import 'reflect-metadata';
import {LiveStatusApi} from "./livestatus.api";
import {ChainLink} from "../state/livestatus.models";
import {LiveStatusMessage, LiveStatusMessageType} from "./livestatus.orchestrator";
declare function require(name:string);
const md5 = require('md5');
export enum VerifierMessageType {
    success,
    error
}

export class InvalidChainError extends Error {
    public invalidLink: ChainLink;
    public links: ChainLink[];

    constructor(public message: string, link: ChainLink, links: ChainLink[]) {
        super(message);
        Object.setPrototypeOf(this, InvalidChainError.prototype);

        this.name = "InvalidChain";
        this.invalidLink = link;
        this.links = links;
    }

}

export interface VerifierMessage extends LiveStatusMessage {
    type: VerifierMessageType;
    payload: ChainLink[];
    error: Error;
}
const api: LiveStatusApi = new LiveStatusApi();

const verifyRecentChain = async (): Promise<void> => {
    await api.getRecent()
        .then(async (links: ChainLink[]) => {
            // Verify the fucking chain and then post that fucker.

            let isValid: boolean = true;
            let prevChain: ChainLink = null;
            let invalidLink: ChainLink = null;

            links.reverse().forEach((cLink) => {
                if (prevChain) {
                    const correctHash: string = md5(cLink.zkId + cLink.nodeId + prevChain.hash);
                    if (cLink.hash !== correctHash) {
                        isValid = false;
                        invalidLink = cLink;
                    }
                }

                prevChain = cLink;
            });

            if (!isValid) {
                throw new InvalidChainError("One of the links in the chain did not verify", invalidLink, links);
            } else {
                (self as unknown as DedicatedWorkerGlobalScope).postMessage({
                    parentType: LiveStatusMessageType.verifier,
                    type: VerifierMessageType.success,
                    payload: links
                } as VerifierMessage);
            }
        })
        .catch((e) => {
            (self as unknown as DedicatedWorkerGlobalScope).postMessage({
                parentType: LiveStatusMessageType.verifier,
                type: VerifierMessageType.error,
                error: e
            } as VerifierMessage);
        });

    setTimeout(verifyRecentChain.bind(this), 100);
};

if (self) {
    self.addEventListener('message', (m) => {
        if (m.data === "start") {
            verifyRecentChain();
        }
    });
}