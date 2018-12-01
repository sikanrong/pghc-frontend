import {ClusterConfig, ChainLink} from "./livestatus.models";

export interface LiveStatusStats {
    totalLinksCreated: number;
    totalVerifications: number;
    totalSuccessfulVerifications: number;
    totalFailedVerifications: number;
}

export interface LiveStatusState {
    cluster: ClusterConfig;
    stats: LiveStatusStats;
    userInputs: UserInputs;
}

export interface UserInputs {
    isPaused: boolean;
}

export const initializeState = (): LiveStatusState => {
    return({
        userInputs: {
            isPaused: false
        },
        stats: {
            totalLinksCreated: 0,
            totalVerifications: 0,
            totalSuccessfulVerifications: 0,
            totalFailedVerifications: 0
        },
        cluster: {
            backendNodes: 0,
            pgSlaveNodes: 0,
            pgMasterNodes: 0
        }
    });
};