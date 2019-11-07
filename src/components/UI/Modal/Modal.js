import React, {Component} from "react";

import classes from "./Modal.module.css";
import Aux from "../../../hoc/Aux/Aux";
import Backdrop from "../../UI/Backdrop/Backdrop";


class Modal extends Component {

  /* This is an improvement because the Children this 
  Modal wraps wont get rerendered.
  We could have extended PureComponent, which kind of implements
  a shouldComponentUpdate that checks for any change in props but
  the way we've implemented is leaner as we just check for the thing
  we are interested in if it shows.
  I guess using React.Memo(Modal) will also work but in this case it
  would have been similar to PureComponent.
  */
  shouldComponentUpdate(nextProps, nextState) {
    //return nextProps.show !== this.props.show;
    return nextProps.show !== this.props.show || nextProps.children !== this.props.children;

  }

  render() {
    //style={props.purchasing? {transform: "translateY(0)"}: {transform: "translateY(-100vh)"} }>
    return (
      <Aux>
        <Backdrop show={this.props.show} clicked={this.props.modalClosed} />
        <div
          className={classes.Modal}
          style={{
            transform: this.props.show ? "translateY(0)" : "translateY(-100vh)",
            opacity: this.props.show ? '1' : '0'
          }}
        >
          {this.props.children}
        </div>
      </Aux>
    );  
  }
}

/*
const modal = props => {
  //style={props.purchasing? {transform: "translateY(0)"}: {transform: "translateY(-100vh)"} }>
  return (
    <Aux>
      <Backdrop show={props.show} clicked={props.modalClosed} />
      <div
        className={classes.Modal}
        style={{
          transform: props.show ? "translateY(0)" : "translateY(-100vh)"
        }}
      >
        {props.children}
      </div>
    </Aux>
  );
};
*/

export default Modal;
