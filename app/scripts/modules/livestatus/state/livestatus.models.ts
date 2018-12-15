export class ClusterConfig {
    public backendNodes: number;
    public pgSlaveNodes: number;
    public pgMasterNodes: number;
}

export class ChainLink {
    public zkId: number;
    public nodeId: string;
    public hash: string;
}

export interface UserInputs {
    isPaused: boolean;
}

export interface LiveStatusStats {
    totalLinksCreated: number;
    totalVerifications: number;
    totalSuccessfulVerifications: number;
    totalFailedVerifications: number;
}

export interface CurrentServerResponses {
    newestChain: ChainLink;
    verificationData: ChainLink[];
    verified: boolean;
}