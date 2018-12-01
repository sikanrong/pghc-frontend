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