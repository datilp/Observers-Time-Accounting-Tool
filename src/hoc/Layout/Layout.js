import React, {Component} from 'react';
import Aux from '../Aux/Aux';
import classes from './Layout.module.css';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';

/*
 Although Layout is a component and therefore could be a container it's main
 funtionality is to wrap other elements. For that reason we decided to categorized
 it as an HOC.
*/
class Layout extends Component {
    state = {
        showSideDrawer: false
    }
    SideDrawerClosedHandler = () => {
        this.setState({showSideDrawer: false});
    }

    DrawerToggleHandler = () => {
        this.setState((prevState) => ({showSideDrawer: !prevState.showSideDrawer}));
    }

    render() {
        return <Aux>
        <Toolbar drawerToggleHander={this.DrawerToggleHandler}/>
        <SideDrawer closed={this.SideDrawerClosedHandler} open={this.state.showSideDrawer} />
        <main className={classes.Content}>
            {this.props.children}
        </main>
    </Aux>
    }
}
export default Layout;