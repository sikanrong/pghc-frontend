import {LiveStatusState, initializeState, LiveStatusStats} from "./livestatus.state";
import {GET_CLUSTER_CONF, LiveStatusActionsUnion, NEW_CHAIN_LINK} from "./livestatus.actions";
import {ChainLink, ClusterConfig} from "./livestatus.models";
import {ActionReducerMap} from "@ngrx/store";
const initialState = initializeState();

export function ClusterConfigReducer(
    state: ClusterConfig = initialState.cluster,
    action: LiveStatusActionsUnion
): ClusterConfig {
    let newState: ClusterConfig;
    switch (action.type) {
        case GET_CLUSTER_CONF:
            newState = Object.assign({}, state, action.payload);
            break;
    }
    return newState;
}

export function LiveStatsReducer(
    state: LiveStatusStats = initialState.stats,
    action: LiveStatusActionsUnion
): LiveStatusStats {
    let newState: LiveStatusStats;

    switch (action.type) {
        case NEW_CHAIN_LINK:
            newState = Object.assign({}, state);
            newState.totalLinksCreated++;
            break;
    }
    return newState;
}

export const reducers: ActionReducerMap<LiveStatusState> = {
    cluster: ClusterConfigReducer,
    stats: LiveStatsReducer
};