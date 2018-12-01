import 'reflect-metadata';
import {LiveStatusApi} from "./livestatus.api";
import {ChainLink} from "../state/livestatus.models";
import {LiveStatusMessage, LiveStatusMessageType} from "./livestatus.orchestrator";

export enum CreatorMessageType {
    success,
    error
}

export interface CreatorMessage extends LiveStatusMessage {
    type: CreatorMessageType;
    payload: ChainLink;
    error: Error;
}

const api: LiveStatusApi = new LiveStatusApi();

const addLink = async () => {
    return api.createChain()
        .then(async (link: ChainLink) => {
            (self as unknown as DedicatedWorkerGlobalScope).postMessage({
                parentType: LiveStatusMessageType.creator,
                type: CreatorMessageType.success,
                payload: link
            } as CreatorMessage);

            return addLink();
        })
        .catch((e) => {
            (self as unknown as DedicatedWorkerGlobalScope).postMessage({
                parentType: LiveStatusMessageType.creator,
                type: CreatorMessageType.error,
                error: e
            } as CreatorMessage);
            throw new Error(e);
        });
};

addLink();