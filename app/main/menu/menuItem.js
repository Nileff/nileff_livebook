/**
 * Created by Alender on 03.12.2015.
 */

import React from "react"
import { Link } from "react-router"
import SubmenuItem from "./submenuItem"

export default React.createClass({
    render: function() {
        var name = this.props.name;
        var link = "/" + name;
        var id = "menu-item-" + name;
        var activeClass = 'active';
        var menuItems = '';
        if(this.props.submenu){
            menuItems = this.props.submenu.map(function (item) {
                return (
                    <SubmenuItem key={name + "-" + item.name} name={item.name} topmenu={name}>{item.text}</SubmenuItem>);
            })
            activeClass = 'active sub';
        }
        var style={'pointerEvents': 'auto'};
        if(window.location.hash == '#' + link || window.location.hash == '#' + link + '/'){
            style={'pointerEvents': 'none'};
        }
        return (
            <div className="menu-item-conteiner">
                <Link className="menu-item" activeClassName={activeClass} to = {link} style={style}>
                    <div id={id}>
                        <div className="menu-color"/>
                        <div className="menu-text">
                            {this.props.children}
                        </div>
                    </div>
                </Link>
                <div className="submenu">{menuItems}</div>
            </div>
        );
    }
});