import {ClusterConfig, LiveStatusStats, UserInputs, CurrentServerResponses} from "./livestatus.models";

export interface LiveStatusState {
    cluster: ClusterConfig;
    stats: LiveStatusStats;
    userInputs: UserInputs;
    current: CurrentServerResponses;
}

export const initializeState = (): LiveStatusState => {
    return({
        current: {
          newestChain: null,
          verificationData: [],
          verified: null
        },
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