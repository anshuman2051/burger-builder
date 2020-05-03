import React from 'react';
import classes from './Logo.module.css';

import burger from '../../assets/images/burger.png';
const logo = (props)=>(
    <div className={classes.Logo}>
        <img  src={burger} alt="my-burger"/>
    </div>
);
export default logo;