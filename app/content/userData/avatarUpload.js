/**
 * Created by Alender on 15.03.2016.
 */

import React from "react";
import ReactDOM  from "react-dom";

export default React.createClass({

    handleFile: function(e) {
        if(window.FileReader)
        {
        var reader = new FileReader();
        var file = e.target.files[0];

        if (!file) return;

        reader.onload = function(img) {
            ReactDOM.findDOMNode(this.refs.in).value = '';
            this.props.handleFileChange(img.target.result);
        }.bind(this);
        reader.readAsDataURL(file);}
        else
        {
            alert("Ошибка!");
        }
    },

    render: function() {
        return (
            <input ref="in" type="file" accept="image/*" onChange={this.handleFile} />
        );
    }
});