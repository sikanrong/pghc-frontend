import * as d3 from "d3";
import {Injectable} from "@angular/core";
import {ClusterConfig} from "../state/livestatus.models";
import {DefaultLinkObject} from "d3";

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
    link: DefaultLinkObject;
}

@Injectable()
export class LiveStatusD3 {
    private static clusterWidth: number = 300;
    private static nodeRadius: number = 15;
    private static messageRadius: number = 5;
    public drawClusterNodes(parentNode: Element, clusterConf: ClusterConfig): void {
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
                    gx: masterIdx * LiveStatusD3.clusterWidth,
                    gy: 0,
                    cx: LiveStatusD3.clusterWidth / 2,
                    cy: 20,
                    replicas: new Array<SlaveNodeData>(),
                    backendServers: new Array<BackendNodeData>()
                });
            } else {
                const slaveIdx = (i % clusterConf.pgMasterNodes) - 1;
                const slavesPerMaster = Math.floor(clusterConf.pgSlaveNodes / clusterConf.pgMasterNodes);
                const groupXWidthPerSlave = (LiveStatusD3.clusterWidth / slavesPerMaster);
                const slaveX = (slaveIdx * groupXWidthPerSlave) + (groupXWidthPerSlave / 2);

                clusterData[masterIdx].replicas.push({
                    podIdx: i,
                    canonicalIndex: slaveIdx,
                    podName: `pghc-postgres-repl-${i}`,
                    nodeName: `Slave ${slaveIdx}`,
                    cx: slaveX,
                    cy: 100,
                    link: {
                        source: [clusterData[masterIdx].cx, clusterData[masterIdx].cy],
                        target: [slaveX, 100]
                    }
                });

                const backendPodIdx = (i - masterIdx - 1);
                clusterData[masterIdx].backendServers.push({
                    podIdx: backendPodIdx,
                    canonicalIndex: slaveIdx,
                    podName: `pghc-backend-${backendPodIdx}`,
                    nodeName: `Backend Server ${slaveIdx}`,
                    cx: slaveX,
                    cy: 200,
                    link: {
                        source: [slaveX, 100],
                        target: [slaveX, 200]
                    }
                });
            }
        }

        const clusterGroup = svgEl.selectAll("g")
            .data(clusterData)
            .enter()
            .append("g")
            .attr("transform", (d: MasterNodeData) => `translate(${d.gx}, ${d.gy})`);

        clusterGroup.append("circle")
            .attr('r', LiveStatusD3.nodeRadius)
            .attr('id', (d: ClusterNodeData) => d.podName)
            .attr('fill', 'black')
            .attr("cx", (d: MasterNodeData) => d.cx )
            .attr("cy", (d: MasterNodeData) => d.cy )
            .attr("class", "masterNode");

        const slaveNode = clusterGroup.selectAll("circle.slaveNode")
            .data((d) => d.replicas);

        slaveNode.enter()
            .append('circle')
            .attr('r', LiveStatusD3.nodeRadius)
            .attr('id', (d: ClusterNodeData) => d.podName)
            .attr('fill', 'black')
            .attr('cx', (d: ClusterNodeData) => d.cx)
            .attr('cy', (d: ClusterNodeData) => d.cy)
            .attr('class', 'slaveNode');

        const linkFactory = d3.linkVertical();
        clusterGroup.selectAll("path.link")
            .data((d) => {
                return d.replicas.map((r: SlaveNodeData) => r.link);
            })
            .enter()
            .append('path')
            .attr('class', 'link')
            .attr('fill', 'none')
            .attr('stroke', 'black')
            .attr('d', (d: DefaultLinkObject) => {
                return linkFactory(d);
            });
    }
}
