import React, { Component } from 'react';
import MiniQ from './containers/miniQ/miniQ';
import {connect}  from 'react-redux';
import {bindActionCreators} from 'redux';
import instance from './axiosInstance';
import fetchStateAction from './store/actions/fetchState';
import withErrorHandler from './hoc/withErrorHandler/withErrorHandler';



class App extends Component {
  counter=0;
  componentDidMount() {
    
    //console.log("[App] counter:" + this.counter++);
    const{ fetchState}  = this.props;
    fetchState();
  }
  render() {
    return (
      <div>
          <MiniQ />        
      </div>
    );
  }
}


const mapDispatchToProps = dispatch => bindActionCreators({
  fetchState: fetchStateAction
}, dispatch)

export default connect(null, mapDispatchToProps)(withErrorHandler(App, instance));

//export default App;