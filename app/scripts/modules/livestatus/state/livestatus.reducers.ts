import {initializeState, LiveStatusState, LiveStatusStats} from "./livestatus.state";
import {
    GET_CLUSTER_CONF,
    LiveStatusActionsUnion,
    NEW_CHAIN_LINK,
    NEW_VERIFICATION,
    NewVerification
} from "./livestatus.actions";
import {ClusterConfig} from "./livestatus.models";
import {ActionReducerMap} from "@ngrx/store";
import {VerifierMessage, VerifierMessageType} from "../services/livestatus.verifier.worker";

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

        case NEW_VERIFICATION:
            newState = Object.assign({}, state);
            newState.totalVerifications++;
            const vmsg: VerifierMessage = (action as NewVerification).payload;
            switch (vmsg.type) {
                case VerifierMessageType.success:
                    newState.totalSuccessfulVerifications++;
                    break;
                case VerifierMessageType.error:
                    newState.totalFailedVerifications++;
                    break;
            }
            break;
    }
    return newState;
}

export const reducers: ActionReducerMap<LiveStatusState> = {
    cluster: ClusterConfigReducer,
    stats: LiveStatsReducer
};