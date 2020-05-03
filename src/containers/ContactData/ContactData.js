import React  from 'react';
import Button from '../../components/UI/Button/Button';
import classes from './ContactData.module.css'
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import Input from '../../components/UI/Input/Input'
import withErrorHandler from '../../hoc/WithErrorHandler/WithErrorHandler';
import * as actions from '../../store/actions/index';
import {Redirect} from 'react-router-dom';

import {connect} from 'react-redux';

class ContactData extends React.Component{
    state = {
        orderForm:{
                name: {
                    elementType: "input",
                    elementConfig:{
                        type: "text",
                        placeholder: "your name"
                    },
                    value: '',
                    validation:{
                        required: true
                    },
                    valid: false,
                    touched: false
                },
                street : {
                    elementType: "input",
                    elementConfig:{
                        type: "text",
                        placeholder: "street"
                    },
                    value: '',
                    validation:{
                        required: true
                    },
                    valid: false,
                    touched: false
                },
                zipcode : {
                    elementType: "input",
                    elementConfig:{
                        type: "text",
                        placeholder: "zip"
                    },
                    value: '',
                    validation:{
                        required: true,
                        minlength: 5,
                        maxlength: 15
                    },
                    valid: false,
                    touched: false
                },
                country: {
                    elementType: "input",
                    elementConfig:{
                        type: "text",
                        placeholder: "country"
                    },
                    value: '',
                    validation:{
                        required: true
                    },
                    valid: false,
                    touched: false
                },
                email: {
                    elementType: "input",
                    elementConfig:{
                        type: "email",
                        placeholder: "your mail"
                    },
                    value: '',
                    validation:{
                        required: true
                    },
                    valid: false,
                    touched: false
                },
                deliveryMethod: {
                    elementType: "select",
                    elementConfig:{
                        options: [
                            {value: "fastest", displayValue: "Fastest "},
                            {value: "cheapest", displayValue: "Cheapest"},
                        ]
                    },
                    value: 'fastest',
                    validation:{},
                    valid: true,
                    touched: false
                },
        },
        formIsValid: false,
    };

    checkValidity(value, rules){
        let isValid = true;
        if(rules.required){
            isValid = value.trim() !==  '' && isValid;
        }
        if(rules.minlength){
            isValid = value.length >= rules.minlength && isValid;
        }
        if(rules.maxlength){
            isValid = value.length <= rules.maxlength && isValid;
        }
        return isValid;
    }
    orderHandler = (evt)=>{
        evt.preventDefault();
        const formData = {};
        for( let formElementId in this.state.orderForm){
            formData[formElementId] = this.state.orderForm[formElementId].value;
        }
        const order = {
            ingredient : this.props.ingredients,
            price: this.props.price,
            orderData : formData,
            userId : this.props.userId
            
        };
        // alert('you continue');
        this.props.onOrderBurger(order, this.props.token);
        this.props.history.push('/orders');
    }

    inputChangedHandler = (evt, inputIdentifier)=>{
        const updatedOrderForm = {
            ...this.state.orderForm
        };

        const updatedFormElement = {
            ...updatedOrderForm[inputIdentifier]
        };

        updatedFormElement.value = evt.target.value;
        updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
        updatedFormElement.touched = true;
        updatedOrderForm[inputIdentifier] = updatedFormElement;
        let isValid = false;
        for( let formIdentifier in updatedOrderForm ){
            isValid = updatedOrderForm[formIdentifier].valid && isValid;
        }
        this.setState({orderForm: updatedOrderForm, formIsValid : isValid});
    }
    render(){
        const formElementsArray = [];
        for( let key in this.state.orderForm){
            formElementsArray.push({
                id: key,
                config : this.state.orderForm[key]
            });
        }
        let form = (
            <form onSubmit={this.orderHandler}>
            {formElementsArray.map( formElement=>(
                <Input
                        key = {formElement.id} 
                        elementType={formElement.config.elementType} 
                        elementConfig={formElement.config.elementConfig}
                        value={formElement.config.value}
                        invalid={!formElement.config.valid}
                        touched={formElement.config.touched}
                        shouldValidate={formElement.config.validation}
                        changed={(evt)=>this.inputChangedHandler(evt, formElement.id)}/>
            ))}
            <Button btnType="Success"  disabled={this.state.formIsValid}>ORDER</Button>
        </form>
        );
        if( this.props.loading){
            form = <Spinner/>;
        }
        return(
            <div className={classes.ContactData}>
                <h4>Enter your Contact Details</h4>
                {form} 
            </div>
        );
    }
}

const mapStateToProps = state=>{
    return {
        ingredients : state.burger.ingredients,
        price: state.burger.totalPrice,
        loading: state.order.loading,
        token: state.auth.token,
        userId: state.auth.userId
    }
}

const mapDispatchToProps = dispatch =>{
    return{
        onOrderBurger : (orderData, token)=> dispatch(actions.purchaseBurger(orderData, token))
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData,axios));