import ActionWithPayload from "../../../ActionWithPayload";
import {ClusterConfig, ChainLink} from "./livestatus.models";
import {VerifierMessage} from "../services/livestatus.verifier.worker";
import {Action} from "@ngrx/store";

export const GET_CLUSTER_CONF = "[app] GET_CLUSTER_CONF";
export const NEW_CHAIN_LINK = "[app] NEW_CHAIN_LINK";
export const NEW_VERIFICATION = "[app] NEW_VERIFICATION";

export const UI_PAUSE = "[app] UI_PAUSE";
export const UI_UNPAUSE = "[app] UI_UNPAUSE";

export class GetClusterConf implements ActionWithPayload<ClusterConfig> {
    public payload: ClusterConfig;
    public readonly type: string;

    constructor(payload: ClusterConfig) {
        this.payload = payload;
        this.type = GET_CLUSTER_CONF;
    }
}

export type ClusterConfigActionsUnion = GetClusterConf;

export class NewChainLink implements ActionWithPayload<ChainLink> {
    public payload: ChainLink;
    public readonly type: string;

    constructor(payload: ChainLink) {
        this.payload = payload;
        this.type = NEW_CHAIN_LINK;
    }
}

export class NewVerification implements ActionWithPayload<VerifierMessage> {
    public payload: VerifierMessage;
    public readonly type: string;

    constructor(msg: VerifierMessage) {
        this.payload = msg;
        this.type = NEW_VERIFICATION;
    }
}

export type LiveStatusActionsUnion = NewChainLink | NewVerification;

export class PauseSimulation implements Action {
    public readonly type: string;

    constructor() {
        this.type = UI_PAUSE;
    }
}

export class UnPauseSimulation implements Action {
    public readonly type: string;

    constructor() {
        this.type = UI_UNPAUSE;
    }
}

export type UserActionsUnion = PauseSimulation | UnPauseSimulation;

