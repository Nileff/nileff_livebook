/**
 * Created by Alender on 24.11.2015.
 */

import React from "react"
import {ajax} from "jquery"
import GenreItem  from "./genreItem"

export default React.createClass({
    getInitialState: function() {
        return ({
            items: []
        }
        );
    },
    componentDidMount: function () {
        ajax({
            url: 'api/genre/getGenre/',
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
    handleChange: function(event) {
        this.setState({order: event.target.value});
    },
    render: function() {
        var authorItems = this.state.items.map(function(item){
            return (<GenreItem key={item.id} genre={item}></GenreItem>);
        });
        return (
            <div id="content-menu-panel">
                <div className="content-header">
                    <div className="content-title-conteiner">
                        <div className="content-title"><h1>Жанры</h1></div>
                    </div>
                </div>
                {authorItems}
            </div>
        );
    }
});