import React, { Component } from "react";
import classes from "./ProgramTracker.module.css";
import {connect} from 'react-redux';
import PTR from "./ProgramTrackerRow/ProgramTrackerRow";

class ProgramTracker extends Component {

  render() {
      const programRows = this.props.prog.list.map(prog => {

        return <PTR key={prog.id} pid={prog.id} rowName={[prog.id, prog.pi].join(" ")} />;
      })
    return (
      <div className={classes.ProgramTracker}>
        <table>
            <tbody>
          <tr>
            <th colSpan="3"></th>
            <th>Tonight(h)</th>
            <th>Total(h)</th>
            {/*<th>Tonight(%)</th>
            <th>Total(%)</th>*/}
            <th>Complete(%)</th>
          </tr>
          {programRows}
          </tbody>
        </table>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    prog: state.programs.programs
   
  };
};

export default connect(mapStateToProps)(ProgramTracker);
