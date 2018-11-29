import {ClusterConfig} from "./livestatus.models";

export interface LiveStatusState {
    cluster: ClusterConfig;
}

export const initializeState = (): LiveStatusState => {
    return({
        cluster: {
            backendNodes: 0,
            pgSlaveNodes: 0,
            pgMasterNodes: 0
        }
    });
};