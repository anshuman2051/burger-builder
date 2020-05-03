import * as actionTypes from '../actions/actionTypes';
import {updateObjects} from '../utility';

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
};

const initialState = {
    ingredients: null,
    totalPrice: 4,
    error: false,
    building: false
};

const reducer = (state=initialState, action)=>{
    switch(action.type){
        case actionTypes.ADD_INGREDIENTS :
            const updatedIngredient = {
                    [action.ingredientName] : state.ingredients[action.ingredientName]+1
            };
            const updatedIngredients = updateObjects(state.ingredients, updatedIngredient);
            const updatedState = {
                ingredients : updatedIngredients,
                totalPrice : state.totalPrice + INGREDIENT_PRICES[action.ingredientName],
                building: true
            };
            return updateObjects( state, updatedState);
        case actionTypes.REMOVE_INGREDIENTS :
            return{
                ...state,
                ingredients : {
                    ...state.ingredients,
                    [action.ingredientName] : state.ingredients[action.ingredientName]-1
                },
                totalPrice : state.totalPrice - INGREDIENT_PRICES[action.ingredientName],
                building: true
            };
        case actionTypes.SET_INGREDIENTS:
            return{
                ...state,
                ingredients: action.ingredients,
                error : false,
                totalPrice: 4,
                building: false
            };
        case actionTypes.FETCH_INGREDIENTS_FAILED :
            return{
                ...state,
                errore : true
            }
        default:
            return state;
    }
};


export default reducer;