import React, {Component} from 'react';
import {connect} from 'react-redux';
import {NavLink,withRouter} from 'react-router-dom';
import Reports from './Reports';
import {monthNamesShort} from "./../utility";

class ReportPage extends Component {
    constructor(props) {
        super(props);
        this.state = {'reportID': this.props.match.params.id};
      }

    UNSAFE_componentWillReceiveProps(nextProps) {
        //console.log(nextProps);
        if (nextProps.match.params.id !== this.state.reportID) {
          this.setState({reportID:nextProps.match.params.id});
          //console.log("forcingUpdate");
          //this.forceUpdate();
        }
      }
    render() {
        //console.log("Report Page render");
        const night_list = Object.keys(this.props.nights.nights).sort();
        const current_night_index = night_list.findIndex(night=> night===this.props.match.params.id);
        const next_night_index = (night_list.length -1) === current_night_index? 0:current_night_index +1;
        const prev_night_index = current_night_index === 0? night_list.length -1 :current_night_index -1;
        const prev_night = night_list[prev_night_index];
        const next_night = night_list[next_night_index];
        const run_first_night = night_list[0];
        const run_last_night = night_list[night_list.length - 1];

        //console.log("[reportpage]:", prev_night, next_night);
        var matchDate=this.state.reportID.match(/(\d{4})(\d{2})(\d{2})-(\d{4})(\d{2})(\d{2})/);

        //console.log("match dates:", matchDate);
        var fromDate = matchDate[3] + "-" + monthNamesShort()[matchDate[2]-1] + "-" + matchDate[1];
        var toDate = matchDate[6] + "-" + monthNamesShort()[matchDate[5]-1] + "-" + matchDate[4];
        //console.log(fromDate, toDate);
        //console.log("current Night:",this.props.match.params.id);
    
        //  console.log(this.state.nightlyData, nightlyData);
        return (
        <div className="App" style={{display:'block', marginTop:"70px", marginLeft:"auto", marginRight:"auto", height:"700px", width:"95%"}}>
            <div style={{width:"500px", display:'flex', marginLeft:"150px", textAlign:"center"}}>
                {run_first_night === this.state.reportID? 
                <NavLink style={{visibility:"hidden"}} 
                        to={"/report" + prev_night}>{"<Prev"}</NavLink>:
                <NavLink to={"/report" + prev_night}>{"<Prev"}</NavLink>}
                <p style={{margin:"0px 25px 0px 25px", display:"inline"}}>
                    <b><span>{fromDate}</span></b>{" to "}<b><span>{toDate}</span></b></p>
                {run_last_night === this.state.reportID? null:
                <NavLink to={"/report" + next_night}>{"Next>"}</NavLink>}
            </div>
            <Reports key={this.state.reportID}
                     reportID={this.state.reportID}
                     runFirstNight={run_first_night==null?"19700101-19700101":run_first_night} />
        </div>
        );
    }
}
const mapStateToProps = state => {
    return {
      nights: state.nights
    };
  };

export default withRouter(connect(mapStateToProps)(ReportPage));