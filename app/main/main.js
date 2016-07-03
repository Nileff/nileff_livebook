/**
 * Created by Alender on 03.12.2015.
 */

import React from "react"
import {ajax} from "jquery"
import Menu from "./menu/menu"
import Logo from "./logo"
import Login from "./login/login"

export default React.createClass({
    getInitialState: function () {
        return ({
            loginState: false,
            user: {
                id: '',
                name: '',
                name2: '',
                avatarUrl: '',
                token:''
            }
        }
        );
    },
    updateUserInfo: function(postData){
        ajax({
            type: "POST",
            url: 'api/auth/getToken/',
            dataType: 'json',
            data: postData,
            cache: false,
            success: function (data) {
                if (data.length > 0) {
                    var item = data[0];
                    if (!item.error) {
                        this.auth(item);
                    }
                    else{
                        if(!postData){
                            var User = Object.assign(this.state.user);
                            this.setCookieSet();
                            this.setState({user: User, loginState: false});
                        }
                    }
                }
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, 'jquery ' + err.toString());
            }.bind(this)
        });
    },
    getRandomString(len){
        var posibleChars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var str = '';
        for(var i = 0; i < len; i++){
            var j = Math.floor(Math.random() * posibleChars.length);
            str += posibleChars[j];
        }
        return str;
    },
    componentWillMount: function () {
        var token = this.getCookie("token", "[A-Za-z0-9]+");
        var UID = this.getCookie("UID", "[A-Za-z0-9]+");
        if(token.length > 8){
            this.setState({loginState: true});
            this.updateUserInfo();
        }
        else if(UID.length > 8){
            this.setCookieSet(false, UID);
        }
        else{
            this.setCookieSet();
        }
    },
    getCookie: function(name, patern){
        var reg = new RegExp(name + "\=" + (patern || '[^;]+'))
        var cookie = document.cookie.match(reg);
        if(cookie && cookie.length > 0){
            return cookie[0].replace(name + '=', '');
        }
        else{
            return "";
        }
    },
    setCookie: function(name, value, date){
        document.cookie = name + '=' + value + '; path=/; expires=' + date.toUTCString();
    },
    setCookieSet: function(token, UID){
        if(token){
            var date = new Date;
            date.setDate(date.getDate() + 30);
            this.setCookie('token', token, date);

            date.setDate(date.getDate() - 60);
            this.setCookie('UID', '', date);
        }
        else{
            var date = new Date;
            date.setDate(date.getDate() + 30);
            if(!UID){
                UID = this.getRandomString(32) + date.getTime();
            }
            this.setCookie('UID', UID, date);

            date.setDate(date.getDate() - 60);
            this.setCookie('token', '', date);
        }
    },
    auth: function(data){
        this.setCookieSet(data.token);
        this.setState({user: data, loginState: true});
    },
    logout: function(){
        this.setCookieSet();
        var data = Object.assign({},this.state.user);
        for (var key in data) {
            if (!data.hasOwnProperty(key)) continue;
            data[key] = '';
        }
        this.setState({user: data, loginState: false});
        window.location.hash = '';
    },
    render: function () {
        return (
            <div>
                <div id="left-panel">
                    <div id="logo">< Logo /></div>
                    <div id="menu">< Menu loginState={this.state.loginState}/></div>
                    <div id="login">
                        < Login auth={this.auth}
                                logout={this.logout}
                                loginState={this.state.loginState}
                                avatarUrl={this.state.user.avatarUrl}
                        />
                    </div>
                </div>
                <div id="main-panel">
                    <div id="content">{React.cloneElement(this.props.children,
                        {
                            loginState: this.state.loginState,
                            userId: this.state.user.id,
                            updateUserInfo: this.updateUserInfo,
                            mainPanelScrollTop: this.state.mainPanelScrollTop
                        }
                    )}</div>
                </div>
            </div>
        );
    }
});