import React from 'react';
import classes from './Toolbar.module.css';
import Logo from '../../Logo/Logo';
import NavigationItems from '../../Navigation/NavigationItems/NavigationItems';
import DrawerToggle from '../SideDrawer/DrawerToggle/DrawerToggle';

/* <Logo height="80%"/> 
 We could pass the height as a property and let 
 the Logo set the height in the style property, 
 but we are going to go for another solution using 
 divs and a class name of Logo to be implemented in 
 the Toolbar.module.css and SideDrawer.module.css. We
 can use the same class name of Logo since React 
 will rename the class name automatically, hence providing
 different class names all the time.*/
const toolbar = (props) => (
    <header className={classes.Toolbar}>
        <DrawerToggle clicked={props.drawerToggleHander}/>
        <nav className={classes.DesktopOnly}>
            <NavigationItems />
        </nav>

        <div className={classes.Logo}>
            <Logo />
        </div>
    </header>
);


export default toolbar;