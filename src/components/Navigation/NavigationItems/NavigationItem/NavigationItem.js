import React from 'react';
import Button from '../../../UI/Button/Button';
import classes from './NavigationItem.module.css';

const navigationItem = (props) => (
    <li className={classes.NavigationItem}>
        <Button clicked={() => props.btnClicked()} btnType={props.active? "Active": "Stop"}>{props.children}</Button>
        {/*<a className={props.active? classes.active: null} href={props.link}>{props.children}</a>*/}
    </li>
);

export default navigationItem;