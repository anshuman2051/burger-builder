import React from 'react';
import Aux from '../Aux/Aux';
import classes from './Layout.module.css';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';

import {connect} from 'react-redux';

class Layout extends React.Component{
    state = {
        showSideDrawer : false 
    };
    sideDrawerClosed = ()=>{
        this.setState({showSideDrawer: false});
    }

    sideDrawerToggleHandler = (prevState)=>{
        this.setState((prevState)=>{
            return {showSideDrawer: !prevState.showSideDrawer}
        })
    }
    render(){
        return(
            <Aux>
                <Toolbar 
                    isAuth = {this.props.isAuthenticated}
                    drawerToggleClicked={this.sideDrawerToggleHandler}/>
                <SideDrawer 
                    isAuth = {this.props.isAuthenticated}
                    open={this.state.showSideDrawer} closed={this.sideDrawerClosed}/>
                <main className={classes.Content}>
                    {this.props.children}
                </main>
            </Aux>
        );
    }
}
const mapStateToProps = state=>{
    return {
        isAuthenticated : state.auth.token !== null
    }
}
export default connect(mapStateToProps, null)(Layout);