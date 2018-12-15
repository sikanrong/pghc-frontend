import * as d3 from "d3";
import {Injectable} from "@angular/core";
import {ClusterConfig} from "../state/livestatus.models";
import {BaseType, DefaultLinkObject} from "d3";

interface MasterNodeData extends ClusterNodeData {
    replicas: SlaveNodeData[];
    backendServers: BackendNodeData[];
    gx: number;
    gy: number;
}

interface ClusterNodeData {
    podIdx: number;
    canonicalIndex: number;
    nodeName: string;
    podName: string;
    cx: number;
    cy: number;
}

interface SlaveNodeData extends ClusterNodeData {
    link: DefaultLinkObject;
}

interface BackendNodeData extends ClusterNodeData {
    links: DefaultLinkObject[];
}

@Injectable()
export class LiveStatusD3 {
    private static nodeRadius: number = 15;
    private static messageRadius: number = 5;
    private static verticalSeparation: number = 100;

    public drawClusterNodes(parentNode: HTMLElement, clusterConf: ClusterConfig): void {
        const svgEl = d3.select(parentNode)
            .append("svg")
            .attr('id', "cluster-vis");

        // construct meaningful arrays from the clusterConf data for d3
        const clusterData: MasterNodeData[] = [];
        const totalNodes: number = (clusterConf.pgMasterNodes + clusterConf.pgSlaveNodes);
        for ( let i = 0; i < totalNodes; i++ ) {
            const masterIdx = Math.floor(i / clusterConf.pgMasterNodes);

            if ( i % clusterConf.pgMasterNodes === 0 ) {
                clusterData.push({
                    nodeName: `Master ${masterIdx}`,
                    podName: `pghc-postgres-repl-${i}`,
                    podIdx: i,
                    canonicalIndex: masterIdx,
                    gx: null,
                    gy: null,
                    cx: null,
                    cy: null,
                    replicas: new Array<SlaveNodeData>(),
                    backendServers: new Array<BackendNodeData>()
                });
            } else {
                const slaveIdx = (i % clusterConf.pgMasterNodes) - 1;

                clusterData[masterIdx].replicas.push({
                    podIdx: i,
                    canonicalIndex: slaveIdx,
                    podName: `pghc-postgres-repl-${i}`,
                    nodeName: `Slave ${slaveIdx}`,
                    cx: null,
                    cy: null,
                    link: null
                });

                const backendPodIdx = (i - masterIdx - 1);
                clusterData[masterIdx].backendServers.push({
                    podIdx: backendPodIdx,
                    canonicalIndex: slaveIdx,
                    podName: `pghc-backend-${backendPodIdx}`,
                    nodeName: `Backend Server ${slaveIdx}`,
                    cx: null,
                    cy: null,
                    links: []
                });
            }
        }

        const doDraw = () => {
            // First set all of the positioning data based on current view dimensions
            const parentDims = {x: parentNode.offsetWidth, y: parentNode.offsetHeight};
            const clusterWidth = (parentDims.x / clusterConf.pgMasterNodes);
            const slavesPerMaster = Math.floor(clusterConf.pgSlaveNodes / clusterConf.pgMasterNodes);
            const groupXWidthPerSlave = (clusterWidth / slavesPerMaster);

            clusterData.forEach((d: MasterNodeData) => {
                d.gx = (parentDims.x / clusterConf.pgMasterNodes) * d.canonicalIndex;
                d.gy = 20;
                d.cx = clusterWidth / 2;
                d.cy = LiveStatusD3.nodeRadius;

                d.replicas.forEach((r: SlaveNodeData) => {
                    const slaveX = (r.canonicalIndex * groupXWidthPerSlave) + (groupXWidthPerSlave / 2);

                    r.cx = slaveX;
                    r.cy = LiveStatusD3.verticalSeparation;
                    r.link = {
                        source: [clusterData[d.canonicalIndex].cx, clusterData[d.canonicalIndex].cy],
                        target: [slaveX, LiveStatusD3.verticalSeparation]
                    };
                });

                d.backendServers.forEach((b: BackendNodeData) => {
                    const slaveX = (b.canonicalIndex * groupXWidthPerSlave) + (groupXWidthPerSlave / 2);

                    b.cx = slaveX;
                    b.cy = LiveStatusD3.verticalSeparation * 2;
                    b.links = [
                        {
                            source: [clusterData[d.canonicalIndex].cx, clusterData[d.canonicalIndex].cy],
                            target: [slaveX, b.cy]
                        },
                        {
                            source: [slaveX, LiveStatusD3.verticalSeparation],
                            target: [slaveX, b.cy]
                        }
                    ];
                });
            });

            const cluster = svgEl.selectAll<SVGGElement, BaseType>("g")
                .data(clusterData);

            const clusterGroup = cluster.enter()
                    .append("g")
                .merge(cluster)
                    .attr("transform", (d: MasterNodeData) => `translate(${d.gx}, ${d.gy})`);

            const sNodeDefs = [
                {
                    className: 'slaveNode',
                    dataKey: 'replicas'
                },

                {
                    className: 'backendNode',
                    dataKey: 'backendServers'
                }
            ];

            sNodeDefs.forEach((sNodeDef) => {
                const linkFactory = d3.linkVertical();
                const links = clusterGroup.selectAll<SVGPathElement, DefaultLinkObject>(`path.link.${sNodeDef.className}`)
                    .data((d) => {
                        return d[sNodeDef.dataKey].map((r) => r.link || r.links ).flat();
                    });

                links.enter()
                    .append('path')
                    .attr('class', `${sNodeDef.className} link`)
                    .attr('fill', 'none')
                    .attr('stroke', 'black')
                .merge(links)
                    .attr('d', (d: DefaultLinkObject) => {
                        return linkFactory(d);
                    });
            });

            sNodeDefs.forEach((sNodeDef) => {
                const slaveNode = clusterGroup.selectAll<SVGCircleElement, SlaveNodeData>(`circle.${sNodeDef.className}`)
                    .data((d) => d[sNodeDef.dataKey]);

                slaveNode.enter()
                    .append('circle')
                    .attr('r', LiveStatusD3.nodeRadius)
                    .attr('id', (d: ClusterNodeData) => d.podName)
                    .attr('stroke', 'black')
                    .attr('fill', 'white')
                    .attr('class', sNodeDef.className)
                .merge(slaveNode)
                    .attr('cx', (d: ClusterNodeData) => d.cx)
                    .attr('cy', (d: ClusterNodeData) => d.cy);
            });

            const masterNode = clusterGroup.selectAll<SVGCircleElement, MasterNodeData>(`circle.masterNode`)
                .data((d: MasterNodeData) => [d]);

            masterNode.enter()
                .append("circle")
                .attr('r', LiveStatusD3.nodeRadius)
                .attr('id', (d: MasterNodeData) => d.podName )
                .attr('stroke', 'black')
                .attr('fill', 'white')
                .attr("class", "masterNode")
            .merge(masterNode)
                .attr("cx", (d: MasterNodeData) => d.cx )
                .attr("cy", (d: MasterNodeData) => d.cy );

        };

        doDraw();

        window.addEventListener('resize', doDraw.bind(this));

    }
}
