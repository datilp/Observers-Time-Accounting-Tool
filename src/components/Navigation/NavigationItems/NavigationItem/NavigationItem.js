import React from 'react';
import Button from '../../../UI/Button/Button';
import classes from './NavigationItem.module.css';

const navigationItem = (props) => {
    var navItem = null;
    if (props.isLink === true) {
        navItem = <a className={props.active? classes.active: null} href={props.link}>{props.children}</a>;

    } else {
        navItem = <Button clicked={() => props.btnClicked()} btnType={props.active? "Active": "Stop"}>{props.children}</Button>;

    }
    return (
    <li className={classes.NavigationItem}>
        {navItem}
    </li>
)};

export default navigationItem;