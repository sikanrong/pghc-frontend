import {LiveStatusState, initializeState} from "./livestatus.state";
import {GET_CLUSTER_CONF} from "./livestatus.actions";
import ActionWithPayload from "../../../ActionWithPayload";
import {ClusterModel} from "./livestatus.models";
const initialState = initializeState();
export function ClusterReducer(state: LiveStatusState = initialState, action: ActionWithPayload<ClusterModel>) {
    switch (action.type) {
        case GET_CLUSTER_CONF:
            Object.assign(state.cluster, action.payload);
            break;
    }
}