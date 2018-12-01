import {LiveStatusApi} from "./livestatus.api";
import {ChainLink} from "../state/livestatus.models";

export enum CreatorMessageType {
    success,
    error
}

export interface CreatorMessage {
    type: CreatorMessageType;
    payload: ChainLink;
    error: Error;
}

const api: LiveStatusApi = new LiveStatusApi();

const addLink = async () => {
    return api.createChain()
        .then(async (link: ChainLink) => {
            (self as unknown as DedicatedWorkerGlobalScope).postMessage({
                type: CreatorMessageType.success,
                payload: link
            } as CreatorMessage);

            return addLink();
        })
        .catch((e) => {
            (self as unknown as DedicatedWorkerGlobalScope).postMessage({
                type: CreatorMessageType.error,
                error: e
            } as CreatorMessage);
            throw new Error(e);
        });
};

addLink();