import {Injectable} from "@angular/core";
import * as $package from "../../../../../package.json";
import {ChainLink} from "../state/livestatus.models";

export class LiveStatusApi {
    private apiBase: string = $package.config.api_uri;

    public async createChain(): Promise<ChainLink> {
        const link: ChainLink = await fetch(`${this.apiBase}/chain`, {method: 'POST'})
            .then( (resp) => resp.json())
            .then((apiData) => {
                return {
                    zkId: apiData.zk_id,
                    nodeId: apiData.node_id,
                    hash: apiData.hash
                } as ChainLink;
            } );
        return link;
    }

    public async getRecent(): Promise<ChainLink[]> {
        const links: ChainLink[] = await fetch(`${this.apiBase}/chain/recent`, {method: 'GET'})
            .then( (resp) => resp.json())
            .then((apiData) => {
                return apiData.map((apiChainLink) => {
                    return {
                        zkId: apiChainLink.zk_id,
                        nodeId: apiChainLink.node_id,
                        hash: apiChainLink.hash
                    } as ChainLink;
                });
            } );
        return links;
    }
}