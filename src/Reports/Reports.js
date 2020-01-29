import React, {Component} from 'react';
import {connect} from 'react-redux';
import NightlyReport from './NightlyReport/NightlyReport';
import TotalsChart from './TotalsChart/TotalsChart';
import instance from '../axiosInstance';
import * as actionCreators from "../store/actions/index";
import {getDate,monthNamesShort} from "./../utility";


class Reports extends Component {
    constructor(props) {
      super(props);
    this.state = { 'nightlyData':null,
              'totals': null,
              'reportID': this.props.reportID};
    }

    componentDidMount() {
        const url = "/getreport.pl?currentNight=" + this.state.reportID;
        instance.get(url,
           {
            transformResponse: [(response) => (JSON.parse(response))]
           }
        ).then(res => {
          //console.log("RESULT:", res.data.totals);
          //console.log("REPORT RESULTS:", res.data);

          var nightlyData=[];
          res.data.nightlyData.sort()
          .forEach((item) => {
            nightlyData.push([item[0], getDate(item[1]), getDate(item[2])]);
          });
          var totals=[];
          var colorMap={ 
            'WEATHERLOSS': {'color':'black', 'name':'Weather Loss'},
            'TECHDOWNTIME': {'color':'red', 'name':'Tech. Downtime'},
            'CALIBRATION': {'color':'green', 'name':'Calibrations'},
            'POORWTHPROG': {'color':'yellow', 'name':'Poor Weather Prog.'},
            'BACKUPPROG': {'color':'pink', 'name':'Backup Prog.'},
            'HUMANERROR': {'color':'brown', 'name':'Human Error'}

          }
          
          Object.keys(res.data.totals).sort().forEach((key) => {
            if (colorMap[key]) {
              totals.push([colorMap[key]['name'], res.data.totals[key]/(60*60), colorMap[key]['color'], null])
            } else {
              totals.push([key, res.data.totals[key]/(60*60), "blue", (((res.data.totals[key]*100)/(60*60))/res.data.prog_alloc[key]).toFixed(1)+"%"]);
            }
          });

          
          this.setState({nightlyData:nightlyData,
            totalsData:totals});

        }).catch(error => {
          console.log("ERROR:" + error);
          this.props.fetchStateError(error);
        });
    }

    render() {        
      var matchDate=this.props.reportID.match(/(\d{4})(\d{2})(\d{2})-(\d{4})(\d{2})(\d{2})/);
      var matchFirstDate=this.props.runFirstNight.match(/(\d{4})(\d{2})(\d{2})-(\d{4})(\d{2})(\d{2})/);

      var fromDate = matchFirstDate[3] + "-" + monthNamesShort()[matchFirstDate[2]-1] + "-" + matchFirstDate[1];
      var toDate = matchDate[6] + "-" + monthNamesShort()[matchDate[5]-1] + "-" + matchDate[4];
    
      if (this.state.nightlyData != null) {
        return (
          <div className="App" style={{display:'block', marginTop:"25px", marginLeft:"auto", marginRight:"auto", height:"700px", width:"95%"}}>
            <NightlyReport data={this.state.nightlyData}/>
            <p style={{textAlign:"center", width:"700px"}}>{"From "}<b><span>{fromDate}</span></b>{" to "}<b><span>{toDate}</span></b></p>
            <TotalsChart data={this.state.totalsData} style={{display:'block', marginLeft:"auto", marginRight:"auto", width:"40%"}}/>
          </div>
        );
      } else { return null;}
    }
}

const mapDispatchToProps = (dispatch) => {
  return {
      fetchStateError: (error) => {
          dispatch(actionCreators.fetchStateError(error));
      }
  };
};

export default connect(null, mapDispatchToProps)(Reports);