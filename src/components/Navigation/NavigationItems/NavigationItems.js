import React, {Component} from 'react';
import {connect} from 'react-redux';
import classes from './NavigationItems.module.css';
import NavigationItem from './NavigationItem/NavigationItem';
import * as actionCreators from "../../../store/actions/index";


class NavigationItems extends Component {
    render () {
    return (<ul className={classes.NavigationItems}>
        {/*
        <NavigationItem link="/" active>Start of Night</NavigationItem>
        <NavigationItem link="/">END of Night</NavigationItem>
        */
        }
        <NavigationItem link="/" btnClicked={this.props.saveStateToFile} active>Download State</NavigationItem>
        <label>&nbsp;</label>
        <label><b>{"Night: " + this.props.nights.current + this.props.nights.nightEnd}</b></label>
    </ul>
    );

    }
}


const mapStateToProps = state => {
    return {
      nights: state.nights
    };
  };

const mapDispatchToProps = (dispatch) => {
    return {
        saveStateToFile: () => {
            dispatch(actionCreators.saveStateToFile());
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(NavigationItems);