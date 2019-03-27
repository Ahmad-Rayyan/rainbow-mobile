import { GET_CALL_STATE } from './types';

const INITAL_STATE = {
    callState: null,
    wasInitiatedWithVideo: false
};

export default (state = INITAL_STATE, action) => {
    console.log('Inside Action Reducer :', action.type);
    switch (action.type) {
        case GET_CALL_STATE:
            return {
                ...state,
                callState: action.payload.callState,
                wasInitiatedWithVideo: action.payload.wasInitiatedWithVideo
            };
        default:
            return state;
    }
};
