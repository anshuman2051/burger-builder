import React from 'react';
import classes from './NavigationItems.module.css';
import NavigationItem from "./NavigationItem/NavigationItem"

const navigationItems = (props)=>(
    <ul className={classes.NavigationItems}>
       <NavigationItem link="/" exact>builder</NavigationItem> 
       {props.isAuth?
        <NavigationItem link="/orders">orders</NavigationItem> 
        : null
       }
       {!props.isAuth ? 
            <NavigationItem link="/auth">authenticate</NavigationItem>
            : <NavigationItem link="/logout">logout</NavigationItem>
       }
    </ul>
);

export default navigationItems;