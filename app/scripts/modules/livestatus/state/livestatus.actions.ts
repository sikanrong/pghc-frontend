import ActionWithPayload from "../../../ActionWithPayload";
import {ClusterConfig, ChainLink} from "./livestatus.models";
import {VerifierMessage} from "../services/livestatus.verifier.worker";

export const GET_CLUSTER_CONF = "[app] GET_CLUSTER_CONF";
export const NEW_CHAIN_LINK = "[app] NEW_CHAIN_LINK";
export const NEW_VERIFICATION = "[app] NEW_VERIFICATION";

export class GetClusterConf implements ActionWithPayload<ClusterConfig> {
    public payload: ClusterConfig;
    public readonly type: string;

    constructor(payload: ClusterConfig) {
        this.payload = payload;
        this.type = GET_CLUSTER_CONF;
    }
}

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

export type LiveStatusActionsUnion = GetClusterConf | NewChainLink | NewVerification;