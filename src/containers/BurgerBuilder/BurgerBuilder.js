import React, {Component} from 'react';
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import {Modal} from '../../components/UI/Modal/Modal';
import Spinner from '../../components/UI/Spinner/Spinner';
import WithErrorHandler from '../../hoc/WithErrorHandler/WithErrorHandler';
import axios from '../../axios-orders';

import {connect} from 'react-redux';
import * as actions from '../../store/actions/index';

class BurgerBuilder extends Component{
    state = {
        purchasing : false,
    }

    componentDidMount(){
      this.props.onInitIngredients(); 
    }

    updatePurchaseState = (ingredients)=>{
        const totalCount = Object.keys(ingredients).map( (igKey)=>{
            return ingredients[igKey];
        }).reduce( (sum, newVal)=>{
            return sum + newVal;
        },0);

        return totalCount > 0;
    }
    purchaseHandler = ()=>{
        if(this.props.isAUth)
            this.setState({purchasing: true});
        else
            this.props.onSetRedirectPath('/checkout');
            this.props.history.push("/auth");
    }

    purchaseCancelHandler = ()=>{
        this.setState({purchasing: false});
    }

    purchaseContinueHandler = ()=>{
        this.props.onInitPurchase();
        this.props.history.push("/checkout");
    }


    render(){
        const disabledInfo = {
            ...this.props.ingredients
        };
        for( let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <= 0;
        }

        let orderSummary = null;
       

        let burger = this.props.error ? <p>ingredients cant be loaded</p> :<Spinner/>;
        if(this.props.ingredients ){
            burger = (
                <Aux>
                    <Burger ingredients={this.props.ingredients}/>
                    <BuildControls
                        ingredientAdded={this.props.onIngredientAdded}
                        ingredientRemoved = {this.props.onIngredientRemoved}
                        disabled= {disabledInfo}
                        price = {this.props.totalPrice}
                        purchasable= {!this.updatePurchaseState(this.props.ingredients)}
                        isAuth = {this.props.isAuth}
                        ordered = {this.purchaseHandler}/>
                </Aux>
            )

            orderSummary=(
                <OrderSummary 
                ingredients={this.props.ingredients}
                purchaseCancelled={this.purchaseCancelHandler}
                purchaseContinued = {this.purchaseContinueHandler}
                price = {this.props.totalPrice.toFixed(2)}/>
            );
          
        }
        return(
            <Aux>
                <Modal show={this.state.purchasing}
                modalClosed = {this.purchaseCancelHandler}>
                {orderSummary}        
                </Modal>
                {burger} 
            </Aux>
        );
    }
}

const mapStateToProps = state=>{
    return {
        ingredients : state.burger.ingredients,
        totalPrice : state.burger.totalPrice,
        error : state.burger.error,
        isAuth: state.auth.token !== null
    };
};
const mapDispatchThProps = dispatch =>{
    return {
        onIngredientAdded: (ingName) => dispatch(actions.addIngredient(ingName)),
        onIngredientRemoved: (ingName) => dispatch(actions.removeIngredient(ingName)),
        onInitIngredients: ()=> dispatch(actions.initIngredients()),
        onInitPurchase: ()=> dispatch(actions.purchaseInit()),
        onSetRedirectPath: (path)=>dispatch(actions.setAuthRedirectPath(path))
    }
};

export default connect(mapStateToProps, mapDispatchThProps)(WithErrorHandler(BurgerBuilder, axios));