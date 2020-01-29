import React, {Component} from 'react';
import {connect} from 'react-redux';
import classes from './NavigationItems.module.css';
import NavigationItem from './NavigationItem/NavigationItem';
import NTimer from '../../NTimer/NTimer';
import {getDate} from '../../../utility';
import * as actionCreators from "../../../store/actions/index";
import Aux from "../../../hoc/Aux/Aux";
import {withRouter} from 'react-router-dom';
import fetchState from '../../../store/actions/fetchState';



class NavigationItems extends Component {
    /*shouldComponentUpdate(nextProps, nextState) {
        //console.log("shouldComponentUpdate", nextProps, this.props, nextState, this.state);
        return true;
    }*/
    debugFunc = () => {
        console.log("props.hist:", this.props);
        //this.props.history.push({pathname: '/hello'});

        this.props.history.replace({pathname: '/hello'});
    }

    getNight = (func, dateRange) => {
        return () => {
            //console.log("getNight:" + dateRange);
            func(dateRange);
        }
    }

    openReport = (currentDate) => {

        return () => {
            const url = "http://" + window.location.host + "/miniQ/report" + currentDate;
            window.open(url, '_blank');
        }
    }

    getReport = (currentNight) => {
        return (currentNight) => {this.props.history.replace({pathname:'/report'})};
    }
    render () {
        //console.log("NavItems:", this.props.state, this.props.nights);
        var timer = "";
        var nightsList = Object.keys(this.props.nights.nights).sort();
        var currentIndex = nightsList.findIndex(key => key === this.props.nights.current);
        var prevNight = nightsList[currentIndex -1];
        var nextNight = nightsList[currentIndex +1];
        if (nextNight == null) {
            nextNight = nightsList[0];
        }

        /*console.log("currentIndex:" + currentIndex + "; prevNight:" 
        + prevNight + "; nextNight:" + nextNight + "; nextIndex:" + (currentIndex + 1) + "; current:"
         + this.props.nights.current + "; len:" + nightsListLen);*/

        //console.log("NavigationItems:", window.location.host, " ---- ", this.props);

        if (this.props.nights.current == null) {
            timer = "no current night";
        } else if (!this.props.state.isStartOfNight) {
            
            //console.log("NavItems: NightStart:" + this.props.nights.nights[this.props.nights.current].start);
            timer = 
            <Aux>
                <label>&nbsp;&nbsp;<b>{"Starts in:"}&nbsp;&nbsp;</b></label>
                <label>
                    <b><NTimer 
                    initDate={getDate(this.props.nights.nights[this.props.nights.current].start)} 
                    isActive={true}
                    step={-1}
                    debug={true}/></b>
                </label>
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
            <NavigationItem isLink={false} link="/" btnClicked={this.getNight(this.props.fetchState, prevNight)} active>{"<"}</NavigationItem>
            <label>&nbsp;<b>{this.props.nights.current}</b>&nbsp;</label>
            <NavigationItem isLink={false} link="/" btnClicked={this.getNight(this.props.fetchState, nextNight)} active>{">"}</NavigationItem>

            <NavigationItem link="/" btnClicked={this.openReport(this.props.nights.current)} active>Report</NavigationItem>
            <NavigationItem link="/" btnClicked={this.props.saveStateToFile} active>Download State</NavigationItem>

            <label>&nbsp;</label>
            
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
        },
        fetchState: (runNight) => {
            dispatch(fetchState(runNight))
        }/*,
        fetchReport: (currentNight) => {
            dispatch(fetchReport(currentNight))
        }*/
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NavigationItems));