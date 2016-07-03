/**
 * Created by Alender on 13.04.2016.
 */

import React from "react"
import {ajax} from "jquery"

export default React.createClass({
    getInitialState: function () {
        return ({
            content: ''
        }
        );
    },
    getData: function(name){
        ajax({
            type: 'POST',
            url: 'api/other/getOther/',
            dataType: 'html',
            data: {path: name},
            cache: false,
            success: function (data) {
                this.setState({content: data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, 'jquery ' + err.toString());
            }.bind(this)
        });
    },
    componentWillReceiveProps(nextProps){
        if(this.props.location.pathname != nextProps.location.pathname){
            this.getData(nextProps.location.pathname);
        }
    },
    componentDidMount: function () {
        this.getData(this.props.location.pathname);
    },
    render: function () {
        return (
            <div dangerouslySetInnerHTML={{__html: this.state.content}} style={{height: '100%'}}>
            </div>
        );
    }
});