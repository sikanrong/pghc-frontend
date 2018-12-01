import {ClusterConfig, ChainLink} from "./livestatus.models";

export interface LiveStatusStats {
    totalLinksCreated: number;
}

export interface LiveStatusState {
    cluster: ClusterConfig;
    stats: LiveStatusStats;
}

export const initializeState = (): LiveStatusState => {
    return({
        stats: {
            totalLinksCreated: 0
        },
        cluster: {
            backendNodes: 0,
            pgSlaveNodes: 0,
            pgMasterNodes: 0
        }
    });
};