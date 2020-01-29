import React, { Component } from 'react';
import MiniQ from './containers/miniQ/miniQ';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Switch, Route } from 'react-router-dom';
import instance from './axiosInstance';
import fetchState from './store/actions/fetchState';
import { appStateUpdateDispatch } from './store/actions/appState';
import withErrorHandler from './hoc/withErrorHandler/withErrorHandler';
import ReportPage from './Reports/ReportPage';


class App extends Component {
  counter = 0;

  //checks if the end of night has arrived
  endOfNightTimer = null;

  constructor(props) {
    super(props);
    this.props.fetchState();

    this.endOfNightTimer = setInterval(() => { this.props.hasNightEnded() }, 10000);
  }

  componentWillUnmount() {
    //console.log("clear interval endOfNightTimer");
    clearInterval(this.endOfNightTimer);
  }

  /*componentDidMounts() {
    //fetchs original state from server
    this.props.fetchState();

    this.endOfNightTimer = setInterval( () => 
    this.props.hasNightEnded(), 10000);

  }*/
  render() {
    /*        <Switch>
              <Route path="/miniQ/report:id" component={Reports}/>
              <Route path="/intervalGrid" component={IntervalGridEditor} />
              <Route path="/" component={MiniQ} />
            </Switch>  
            */

    return (
      <div>
        <Switch>
          {/*<Route path="/report" component={Reports}/>*/}
          <Route path="/report:id" component={ReportPage} />
          <Route path="/miniQ/report:id" component={ReportPage} />
          <Route path="/" component={MiniQ} />
        </Switch>
      </div>
    );
  }
}


const mapDispatchToProps = dispatch => bindActionCreators({
  fetchState: fetchState,
  hasNightEnded: appStateUpdateDispatch
}, dispatch)

export default connect(null, mapDispatchToProps)(withErrorHandler(App, instance));