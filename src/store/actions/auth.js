import * as actionTypes from './actionTypes';
import axios from 'axios';

export const authStart = ()=>{
    return {
        type: actionTypes.AUTH_START
    }
}

export const authSuccess = (token, userId)=>{
    return{
        type: actionTypes.AUTH_SUCCESS,
        idToken: token,
        userId: userId 
    }
};

export const authFail = (err)=>{
    return{
        type: actionTypes.AUTH_FAIL,
        error: err
    }
};

export const logout = ()=>{
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('userId');
    return{
        type: actionTypes.AUTH_LOGOUT
    };
}
export const checkAuthTimeout= (expirationTime)=>{
    console.log(expirationTime+ " is expiration time");
    return dispatch=>{
        setTimeout(()=>{
            dispatch(logout());
        },expirationTime*1000);
    };
};
export const auth = (email, password, isSignup)=>{
    return dispatch=>{
        dispatch(authStart());
        const authData ={
            email: email,
            password: password,
            returnSecureToken: true
        };

        let url = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBLBrvy30qatEQvvdJoKcaRF7ED_diKOsA";
        if( !isSignup)
            url = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBLBrvy30qatEQvvdJoKcaRF7ED_diKOsA";
        axios.post(url, authData)
        .then( res=>{
            console.log(res.data);
            const expDate = new Date(new Date().getTime()+ res.data.expiresIn * 1000);
            localStorage.setItem('token',res.data.idToken);
            localStorage.setItem('expirationDate', expDate);
            localStorage.setItem('userId', res.data.localId);
            dispatch(authSuccess(res.data.idToken, res.data.localId));
            dispatch(checkAuthTimeout(res.data.expiresIn));
        })
        .catch(err=>{
            console.log(err);
            dispatch(authFail(err.response.data.error));
        });
    }
}
export const setAuthRedirectPath = (path)=>{
    return{
        type: actionTypes.SET_AUTH_REDIRECT_PATH,
        path: path
    }
}

export const authCheckState = ()=>{
    return dispatch => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        if(!token){
            dispatch(logout());
        }else{
            const expirationDate= new Date(localStorage.getItem('expirationDate'));
            if(expirationDate < new Date()){
                dispatch(logout())
            }
            else{
                dispatch(authSuccess(token,userId));
                dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime())/1000));
            }
        }
    }
}