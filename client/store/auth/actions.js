import { checkAuthAPI, loginUserAPI, logoutUserAPI, signUpUserAPI } from "../../APIs/auth"
import { verifySellerAPI } from "../../APIs/order"
import { actionTypes } from "./constants"

export const setAuthLoading = (state)=>{
    return {
        type : actionTypes.SET_AUTH_LOADING,
        payload : state
    }
}

export const setAuthDetails = (data)=>{
    return {
        type : actionTypes.SET_AUTH_DETAILS,
        payload : data
    }
}

export const loginUser = (formData,router,setError)=> async (dispatch,getState)=>{
    try {
        dispatch(setAuthLoading(true));
        const userData = await loginUserAPI(formData);
        console.log(userData);
        setAuthDetails({user : userData.data.user, isLoggedin : true});
        router.push('/');
    }catch(err) {
        console.log(err);
        setError(err?.response?.data?.message || 'Something went wrong! Try again');
        
    } finally {
        dispatch(setAuthLoading(false));
    }
}

export const updateAuthState = (data)=>{
    return {
        type : actionTypes.UPDATE_AUTH,
        payload : data
    }
}

export const logoutUser = (router)=>async(dispatch,getState)=>{
    try {
        dispatch(setAuthLoading(true));
        const result = await logoutUserAPI();
        setAuthDetails({user : {}, isLoggedin : false});
        if (router.pathname!=='/' && router.pathname!=='/auth') router.push('/auth');
    }catch(err) {
        console.log(err);
    } finally {
        dispatch(setAuthLoading(false));
    }
}


// export const setUserData = (formData,router)=>async (dispatch,getState)

export const signUpUser = (formData, setError, dispatchNotification,setIsLogin)=>async(dispatch,getState)=>{
    try {
        dispatch(setAuthLoading(true));
        const result = await signUpUserAPI(formData);
        console.log(result);
        dispatchNotification({
            type : 'success',
            message : 'Signed up successfully! Please Login',
            title : 'Authentication',
            position : 'topR'
        })
        setIsLogin(true)
    }catch(err) {
        console.log(err);
        setError(err?.response?.data?.message || 'Something went wrong! Try again');
    } finally {
        dispatch(setAuthLoading(false));
    }
}

export const checkAuth = (formData)=>async(dispatch,getState)=>{
    try {
        const result = await checkAuthAPI();
        dispatch(setAuthDetails({isLoggedin : true,user : result.data.user}));
    }catch(err) {
        dispatch(setAuthDetails({isLoggedin : false}));
    }finally {
    }
}

export const setSellerVerification = (formData,notificationDispatch)=>async(dispatch,getState)=>{
    try {
        dispatch(setAuthLoading(true))
        const result = await verifySellerAPI(formData);
        dispatch(updateAuthState(result.data.updatedSeller));
        notificationDispatch({
            type: "success",
            message: "Seller Verified Successfully!",
            title: "Seller Verification",
            position: "topR",

        })
    }catch(err) {
        console.log(err);
        notificationDispatch({
            type: "error",
            message: "Something went wrong!",
            title: "Seller Verification",
            position: "topR",

        })
    }finally {
        dispatch(setAuthLoading(false))
    }
}