/**
 * Created by Alender on 13.04.2016.
 */

import React from "react"
import {ajax} from "jquery"

export default React.createClass({
    getInitialState: function () {
        return ({
            title: '',
            items: []
        }
        );
    },
    getData: function(name){
        ajax({
            url: 'api/other/get'+name+'/',
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            cache: false,
            success: function (data) {
                this.setState({items: data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, 'jquery ' + err.toString());
            }.bind(this)
        });
    },
    componentWillReceiveProps(nextProps){
        if(this.props.location.pathname != nextProps.location.pathname){
            if(nextProps.location.pathname.indexOf('rule') >= 0){
                this.getData('Rule');
                this.setState({title: 'Правила'});
            }
            else if(nextProps.location.pathname.indexOf('faq') >= 0){
                this.getData('Faq');
                this.setState({title: 'Вопросы'});
            }
        }
    },
    componentDidMount: function () {
        if(this.props.location.pathname.indexOf('rule') >= 0){
            this.getData('Rule');
            this.setState({title: 'Правила'});
        }
        else if(this.props.location.pathname.indexOf('faq') >= 0){
            this.getData('Faq');
            this.setState({title: 'Вопросы'});
        }
    },
    render: function () {
        var ruleItems = this.state.items.map(function (item, i) {
            var text;
            var subItems;
            if(item.text.length > 0){
                text = <div className="text">{item.text}</div>;
            }
            if(item.items && item.items.length>0){
                var ruleSubItems = item.items.map(function (subItem, j){
                    return (
                        <li key = {j}>
                            <h1>{subItem.name}</h1>
                            <div className="text">{subItem.text}</div>
                        </li>);
                });
                subItems = <ol>{ruleSubItems}</ol>;
            }
            return (
                <li key = {i}>
                    <h1>{item.name}</h1>
                    {text}
                    {subItems}
                </li>);
        });
        return (
            <div id="content-menu-panel">
                <div className="content-header">
                    <div className="content-title-conteiner">
                        <div className="content-title"><h1>{this.state.title}</h1></div>
                    </div>
                </div>
                <ol>
                    {ruleItems}
                </ol>
            </div>
        );
    }
});