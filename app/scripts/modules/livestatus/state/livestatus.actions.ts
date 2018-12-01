import ActionWithPayload from "../../../ActionWithPayload";
import {ClusterConfig, ChainLink} from "./livestatus.models";

export const GET_CLUSTER_CONF = "[app] GET_CLUSTER_CONF";
export const NEW_CHAIN_LINK = "[app] NEW_CHAIN_LINK";

export class GetClusterConf implements ActionWithPayload<ClusterConfig> {
    public payload: ClusterConfig;
    public readonly type: string;

    constructor(payload: ClusterConfig) {
        this.payload = payload;
        this.type = GET_CLUSTER_CONF;
    }
}

export class NewChainLink implements ActionWithPayload<ChainLink>{
    public payload: ChainLink;
    public readonly type: string;

    constructor(payload: ChainLink) {
        this.payload = payload;
        this.type = NEW_CHAIN_LINK;
    }
}

export type LiveStatusActionsUnion = GetClusterConf | NewChainLink;