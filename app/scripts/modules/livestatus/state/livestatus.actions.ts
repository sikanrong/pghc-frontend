import ActionWithPayload from "../../../ActionWithPayload";
import {ClusterConfig} from "./livestatus.models";

export const GET_CLUSTER_CONF = "[app] GET_CLUSTER_CONF";

export class GetClusterConf implements ActionWithPayload<ClusterConfig> {
    public payload: ClusterConfig;
    public readonly type: any;

    constructor(payload: ClusterConfig) {
        this.payload = payload;
        this.type = GET_CLUSTER_CONF;
    }
}


export type LiveStatusActionsUnion = GetClusterConf;