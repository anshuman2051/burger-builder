import React, {Component} from  'react';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import classes from './Auth.module.css';
import Spinner from '../../components/UI/Spinner/Spinner';
import {Redirect} from 'react-router-dom';

import * as actions from '../../store/actions/index';
import { connect } from 'react-redux';

class Auth extends Component {
    state = {
        controls:{
            email: {
                elementType: "input",
                elementConfig:{
                    type: "email",
                    placeholder: "your mail"
                },
                value: '',
                validation:{
                    required: true,
                    isEmail: true,
                },
                valid: false,
                touched: false
            },
            password: {
                elementType: "input",
                elementConfig:{
                    type: "password",
                    placeholder: "your password"
                },
                value: '',
                validation:{
                    required: true,
                    minLength: 6
                },
                valid: false,
                touched: false
            },
        },
        isSignup: true

    }
    componentDidMount(){
        if(this.props.buildingBurger && this.props.authRedirectPath === "/"){
            this.props.setAuthRedirectPath();
        }
    }
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

    switchAuthModeHandler = ()=>{
        this.setState( (prevState)=>{
            return {isSignup : !prevState.isSignup};
        })
    }
    submitHandler = (event)=>{
        event.preventDefault();
        this.props.onAuth(this.state.controls.email.value, this.state.controls.password.value, this.state.isSignup);
    }
    inputChangedHandler = (event, controlName)=>{
        const updatedControls = {
            ...this.state.controls,
            [controlName]: {
                ...this.state.controls[controlName],
                value: event.target.value,
                valid: this.checkValidity(event.target.value, this.state.controls[controlName].validation),
                touched: true
            }
        };
        this.setState({controls: updatedControls});
    }
    render(){ 
        const formElementsArray = [];
        for( let key in this.state.controls){
            formElementsArray.push({
                id: key,
                config : this.state.controls[key]
            });
        }

        let form = formElementsArray.map(formElement=>(
            <Input 
                key={formElement.id}
                elementType={formElement.config.elementType} 
                elementConfig={formElement.config.elementConfig}
                value={formElement.config.value}
                invalid={formElement.config.validation}
                touched={formElement.config.touched}
                shouldValidate={formElement.config.validation}
                changed={(evt)=>this.inputChangedHandler(evt, formElement.id)}/>
            ));
        if(this.props.loading){
            form = <Spinner/>;
        }

        let errorMsg = null;
        if(this.props.error){
            errorMsg = <p>{this.props.error.message}</p>;
        }

        let authRedirect = null;
        if( this.props.isAuth){
           authRedirect = <Redirect to={this.props.authRedirectPath}/>; 
        }
        return(
            <div className={classes.Auth}>
                {authRedirect}
                {errorMsg}
                <form onSubmit={this.submitHandler}>
                    {form}
                    <Button btnType="Success">Submit</Button>
                </form>
                    <Button clicked={this.switchAuthModeHandler} btnType="Danger">Switch to Sign{this.state.isSignup? "In": "Up"}</Button>
            </div>
        );
    }
}

const mapStateToProps = state=>{
    return {
        loading : state.auth.loading,
        error: state.auth.error,
        isAuth : state.auth.token !== null,
        buildingBurger: state.burger.building,
        authRedirectPath: state.auth.authRedirectPath
    };
};
const mapDispatchToProps = dispatch =>{
    return{
        onAuth: (email, password, isSignup)=> dispatch(actions.auth(email, password, isSignup)),
        onSetAuthRedirectPath : ()=>dispatch(actions.setAuthRedirectPath('/'))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);