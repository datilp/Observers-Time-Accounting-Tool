import React, { Component } from "react";
import classes from "./ProgramTracker.module.css";
import {connect} from 'react-redux';
import Aux from '../../hoc/Aux/Aux';
import PTR from "./ProgramTrackerRow/ProgramTrackerRow";
//import Modal from "../UI/Modal/Modal";
//import IntervalGridEditor from "../IntervalGridEditor/IntervalGridEditor";

class ProgramTracker extends Component {

  constructor(props) {
    super(props);
    this.state = {open:true, editing:false}
    this.togglePanel = this.togglePanel.bind(this);
  }

  
  togglePanel(e) {
    this.setState({open:!this.state.open})
  }

  editHandler = () => {
    console.log("***edit handler");
    this.setState({editing:true});
  }
  
  cancelEditing = () => {
    console.log("***cancel purchase");
    this.setState({editing:false})
  }
 
  render() {
    const programRows = this.props.prog.list.filter(prog=>{
      return prog.class === this.props.progClass
    }).map((prog) => {
        return <PTR 
                  progClass={this.props.progClass}
                  editHandler={this.editHandler} 
                  key={prog.id}
                  pid={prog.id} 
                  rowName={[prog.id, prog.pi].join(" ")} />;
    })
    return (
      <Aux>
        {/*<Modal show={this.state.editing} modalClosed={this.cancelEditing}>
            <IntervalGridEditor/>
    </Modal>*/}
      <div onClick={(e) => this.togglePanel(e)} className={classes.Header}>
        {this.props.title}
      </div>
      {this.state.open ? 
      (<div className={classes.ProgramTracker}>
        <table>
            <tbody>
          <tr>
            <th colSpan="3"></th>
            <th></th>
            <th>Tonight(h)</th>
            <th>Total(h)</th>
            {/*<th>Tonight(%)</th>
            <th>Total(%)</th>*/}
            <th>Complete(%)</th>
          </tr>
          {programRows}
          </tbody>
        </table>
      </div>):null}
      </Aux>
    );
  }
}

const mapStateToProps = state => {
  return {
    prog: state.programs.programs
   
  };
};

export default connect(mapStateToProps)(ProgramTracker);
