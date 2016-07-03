/**
 * Created by Alender on 24.11.2015.
 */

import React from "react"
import MenuItem  from "./menuItem"
import {ajax} from "jquery"

export default React.createClass({
    getInitialState: function () {
        return ({
            items: []
        }
        );
    },
    getMenu: function(loginState){
        ajax({
            type: "POST",
            url: 'api/menu/getMenu/',
            dataType: 'json',
            data: {full: loginState},
            cache: false,
            success: function (data) {
                this.setState({items: data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, 'jquery ' + err.toString());
            }.bind(this)
        });
    },
    componentDidMount: function(){
        this.getMenu(this.props.loginState);
    },
    componentWillReceiveProps: function(nextProps){
        if(this.props.loginState != nextProps.loginState) {
            this.getMenu(nextProps.loginState);
        }
    },
    render: function () {
        var menuItems = this.state.items.map(function (item) {
            return (<MenuItem key={item.name} name={item.name} submenu={item.submenu}>{item.text}</MenuItem>);
        })
        return (
            <div id="menu-panel">
                {menuItems}
            </div>
        );
    }
});