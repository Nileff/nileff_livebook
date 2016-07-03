/**
 * Created by Alender on 03.12.2015.
 */

import React from "react"
import { Link } from "react-router"

export default React.createClass({
    render: function() {
        var link = "/" + this.props.topmenu + "/" + this.props.name;
        var id = "menu-item-" + this.props.topmenu + "-" + this.props.name;
        var style={'pointerEvents': 'auto'};
        if(window.location.hash == '#' + link || window.location.hash == '#' + link + '/'){
            style={'pointerEvents': 'none'};
        }
        return (
            <Link className="menu-item submenu-item" activeClassName="active" to = {link} style={style}>
                <div id={id}>
                    <div className="menu-color"/>
                    <div className="menu-text">
                        {this.props.children}
                    </div>
                </div>
            </Link>
        );
    }
});