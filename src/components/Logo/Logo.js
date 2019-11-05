import React from 'react';
import classes from './Logo.module.css';
import logoImg from '../../assets/images/lbto-logo.png';

const logo = (props) => (
    <div className={classes.Logo} style={{height: props.height}}>
        <img src={logoImg} alt="MiniQ"/>
    </div>
);

export default logo;