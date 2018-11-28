import ActionWithPayload from "../../../ActionWithPayload";
import {ClusterModel} from "./livestatus.models";

export const GET_CLUSTER_CONF = "[app] GET_CLUSTER_CONF";

export class GetClusterConf implements ActionWithPayload<ClusterModel> {
    public payload: ClusterModel;
    public type: string;

    constructor(payload: ClusterModel) {
        this.type = GET_CLUSTER_CONF;
        this.payload = payload;
    }
}
