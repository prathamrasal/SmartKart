import { actionTypes } from "./constants"

const initialState = {
    loading : false,
    products : [],


}


const sellerProductReducer = (state=initialState,action)=>{
    switch(action.type) {
        case actionTypes.SET_LOADING : return {...state,loading : action.payload};
        case actionTypes.SET_SELLER_PRODUCTS : return {...state,products : action.payload};
        case actionTypes.ADD_SELLER_PRODUCT : return {...state, products : [...state.products,action.payload]};
        case actionTypes.EDIT_SELLER_PRODUCT : return {...state,products : [...state.products.filter(p=>p._id!==action.payload._id), action.payload]}
        default : return state
    }
}

export default sellerProductReducer;