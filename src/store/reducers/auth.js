import * as actionTypes from '../actions/actionTypes';
import { updateObjects} from '../utility';

const initialState = {
    token: null,
    userId: null,
    error: null,
    loading: false,
    authRedirectPath: '/'
};

const reducer = (state= initialState, action)=>{
    switch( action.type){
        case actionTypes.AUTH_START:
            return updateObjects(state, {loading: true,error: null});
        case actionTypes.AUTH_SUCCESS:
            return updateObjects(state, {
                token: action.idToken,
                userId: action.userId,
                loading: false,
                error: null
            });
        case actionTypes.AUTH_FAIL:
            return updateObjects(state, {loading: false, error: action.error});
        case actionTypes.AUTH_LOGOUT:
            return updateObjects(state, {token: null, userId: null});
        case actionTypes.SET_AUTH_REDIRECT_PATH:
            return updateObjects(state, {authRedirectPath:action.path});
        default:
            return state;
            
    }
}

export default reducer;