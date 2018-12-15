import {initializeState, LiveStatusState} from "./livestatus.state";
import {LiveStatusStats, UserInputs} from "./livestatus.models";
import {
    ClusterConfigActionsUnion,
    GET_CLUSTER_CONF,
    LiveStatusActionsUnion,
    NEW_CHAIN_LINK,
    NEW_VERIFICATION,
    NewVerification, UI_PAUSE, UI_UNPAUSE, UserActionsUnion
} from "./livestatus.actions";
import {ClusterConfig} from "./livestatus.models";
import {ActionReducerMap} from "@ngrx/store";
import {VerifierMessage, VerifierMessageType} from "../services/livestatus.verifier.worker";

const initialState = initializeState();

export function ClusterConfigReducer(
    state: ClusterConfig = initialState.cluster,
    action: ClusterConfigActionsUnion
): ClusterConfig {
    let newState: ClusterConfig;
    switch (action.type) {
        case GET_CLUSTER_CONF:
            newState = Object.assign({}, state, action.payload);
            return newState;
            break;
    }

    return state;
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
            return newState;
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
            return newState;
            break;
    }
    return state;
}

export function UserInputReducer(
    state: UserInputs = initialState.userInputs,
    action: UserActionsUnion
): UserInputs {
    const newState: UserInputs = Object.assign({}, state);
    switch (action.type) {
        case UI_PAUSE:
            newState.isPaused = true;
            return newState;
            break;
        case UI_UNPAUSE:
            newState.isPaused = false;
            return newState;
            break;
    }

    return state;
}

export const reducers: ActionReducerMap<LiveStatusState> = {
    cluster: ClusterConfigReducer,
    stats: LiveStatsReducer,
    userInputs: UserInputReducer
};