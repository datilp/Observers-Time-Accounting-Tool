import React, {Component} from 'react';
import {connect} from 'react-redux';
import classes from './NavigationItems.module.css';
import NavigationItem from './NavigationItem/NavigationItem';
import NTimer from '../../NTimer/NTimer';
import {getDate} from '../../../utility';
import * as actionCreators from "../../../store/actions/index";
import Aux from "../../../hoc/Aux/Aux";


class NavigationItems extends Component {
    /*shouldComponentUpdate(nextProps, nextState) {
        //console.log("shouldComponentUpdate", nextProps, this.props, nextState, this.state);
        return true;
    }*/
    render () {
        //console.log("NavItems:", this.props.state, this.props.nights);
        var timer = "";
        if (this.props.nights.current == null) {
            timer = "no current night";
        } else if (!this.props.state.isStartOfNight) {
            
            console.log("NavItems: NightStart:" + this.props.nights.nights[this.props.nights.current].start);
            timer = 
            <Aux>
            <label>&nbsp;&nbsp;<b>{"Starts in:"}&nbsp;&nbsp;</b></label>
            <label><b>
            <NTimer 
            initDate={getDate(this.props.nights.nights[this.props.nights.current].start)} 
            isActive={true}
            step={-1}
            debug={true}/>
            </b></label>
            </Aux>;
        } else if (this.props.state.isEndOfNight) {
            timer = <label><b>&nbsp;&nbsp;{"Night has ended"}</b></label>;
        } else {
            //console.log("nightsEnd:", this.props.nights.nightEnd, (new Date() - getDate(this.props.nights.nightEnd))/1000);
            timer =
            <Aux>
            <label>&nbsp;&nbsp;<b>{"Ends in:"}&nbsp;&nbsp;</b></label>
            <label><b>
            <NTimer 
            initDate={getDate(this.props.nights.nightEnd)} 
            isActive={true}
            step={-1}
            debug={true}/>
            </b></label>
            </Aux>;
    
        }

        return (<ul className={classes.NavigationItems}>
            {/*
            <NavigationItem link="/" active>Start of Night</NavigationItem>
            <NavigationItem link="/">END of Night</NavigationItem>
            */
            }
            <NavigationItem isLink={false} link="/" btnClicked={this.props.saveStateToFile} active>{"<"}</NavigationItem>
            <NavigationItem isLink={false} link="/" btnClicked={this.props.saveStateToFile} active>{">"}</NavigationItem>

            <NavigationItem link="/" btnClicked={this.props.saveStateToFile} active>Download State</NavigationItem>
            <label>&nbsp;</label>
            <label><b>{"Night: " + this.props.nights.current}</b></label>
            {timer}
        </ul>
        );

    }
}


const mapStateToProps = state => {
    return {
      nights: state.nights,
      state: state.appState
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