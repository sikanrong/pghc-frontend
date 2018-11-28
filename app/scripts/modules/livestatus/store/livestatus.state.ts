export interface LiveStatusState {
    cluster: {
        backendNodes: number,
        pgSlaveNodes: number,
        pgMasterNodes: number
    };
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