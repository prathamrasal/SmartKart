import { addItemToCartAPI, getCartItemsAPI, removeCartItemAPI } from "../../APIs/cart"
import { logoutUser } from "../auth/actions"
import { actionTypes } from "./constants"

export const setLoading = (state)=>{
    return {
        type : actionTypes.SET_LOADING,
        payload : state
    }
}

export const addItemToCartState = (item)=>{
    return {
        type : actionTypes.ADD_ITEMS_TO_CART,
        payload : item
    }
}

export const removeItemFromCartState = (item)=>{
    return {
        type : actionTypes.REMOVE_ITEMS_FROM_CART,
        payload : item
    }
}

export const setCart = (items)=>{
    return {
        type : actionTypes.SET_CART,
        payload : items
    }
}

export const addItemToCart = (item,dispatchNotification)=>async(dispatch,getState)=>{
    try {
        dispatch(setLoading(item._id));
        const result = await addItemToCartAPI(item._id);
        // console.log(result.data);
        dispatch(addItemToCartState(item));
        dispatchNotification({
            type : 'success',
            message : `${item.name} has been added to your cart`,
            title : 'Cart Updated',
            position : 'topR'
        })
    }catch(err){
        console.log(err);
        dispatchNotification({
            type : 'error',
            message : `Something went wrong!`,
            title : 'Cart Updated',
            position : 'topR'
        })
        if(err.response.status === 401){
            dispatch(logoutUser());
        }
    }finally{
        dispatch(setLoading(false));
    }
}

export const fetchAllCartItems = ()=>async(dispatch,getState)=>{
    try {
        dispatch(setLoading(true));
        const result = await getCartItemsAPI();
        console.log(result);
        dispatch(setCart(result.data.cart.product));
    }catch(err) {
        console.log(err);
    }finally{
        dispatch(setLoading(false));
    }
}

export const removeItemFromCart = (item,dispatchNotification)=>async(dispatch,getState)=>{
    try {
        dispatch(setLoading(item._id));
        const result = await removeCartItemAPI(item._id);
        // console.log(result.data);
        dispatch(removeItemFromCartState(item));
        dispatchNotification({
            type : 'success',
            message : `${item.name} has been removed from your cart`,
            title : 'Cart Updated',
            position : 'topR'
        })
        
    }catch(err){
        console.log(err);
        dispatchNotification({
            type : 'error',
            message : `Something went wrong!`,
            title : 'Cart Updated',
            position : 'topR'
        })
        if(err.response.status === 401){
            dispatch(logoutUser());
        }
    }finally{
        dispatch(setLoading(false));
    }
}
