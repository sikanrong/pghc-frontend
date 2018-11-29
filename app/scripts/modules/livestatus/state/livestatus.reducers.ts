import {LiveStatusState, initializeState} from "./livestatus.state";
import {GET_CLUSTER_CONF, LiveStatusActionsUnion} from "./livestatus.actions";
import {ClusterConfig} from "./livestatus.models";
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

export const reducers: ActionReducerMap<LiveStatusState> = {
    cluster: ClusterConfigReducer
};