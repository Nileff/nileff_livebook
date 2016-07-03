/**
 * Created by Alender on 24.11.2015.
 */

import React from "react"
import ReactDOM from 'react-dom'
import {ajax} from "jquery"
import AuthorItem  from "./authorItem"

export default React.createClass({
    getInitialState: function () {
        return ({
            order: 'rating',
            orderItems: [{
                value: "rating",
                text: "рейтингу"
            }, {
                value: "author",
                text: "имени"
            }],
            orderListStyle: 'close',
            items: []
        }
        );
    },
    getAuthorItems: function (order, offset) {
        ajax({
            type: "POST",
            url: 'api/author/getAuthorList/',
            dataType: 'json',
            data: {order: order, offset: offset},
            cache: false,
            success: function (data) {
                var Items = this.state.items.concat(data.items);
                this.setState({count: data.count, items: Items},
                    function () {
                        window.beginLoadPosition = 0;
                    });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, 'jquery ' + err.toString());
            }.bind(this)
        });
    },
    onScroll(e){
        var thisEl = ReactDOM.findDOMNode(this);
        var parentEl = e.target;

        var scrollPosition = parentEl.scrollTop;
        var height = thisEl.offsetHeight;
        var parentHeight = parentEl.offsetHeight;

        if (height > parentHeight &&
            scrollPosition + parentHeight + 400 > height &&
            window.beginLoadPosition == 0 &&
            this.state.count > this.state.items.length) {
            window.beginLoadPosition = scrollPosition;
            this.getAuthorItems(this.state.order, this.state.items.length);
        }
    },
    componentDidMount: function () {
        window.beginLoadPosition = 0;
        this.setState({items: []},
            function () {
                this.getAuthorItems(this.state.order, this.state.items.length);
            }.bind(this)
        );

        document.getElementById("main-panel").addEventListener("scroll", this.onScroll);
    },
    componentWillUnmount: function(){
        document.getElementById("main-panel").removeEventListener("scroll", this.onScroll);
    },
    onClickOrderList: function (e) {
        if (this.state.orderListStyle == 'open') {
            this.setState({orderListStyle: 'close'});
        }
        else {
            this.setState({orderListStyle: 'open'});
        }
    },
    onClickOrder: function (e) {
        if (this.state.order != e) {
            window.beginLoadPosition = 0;
            this.setState({order: e, items: []},
                function () {
                    this.getAuthorItems(this.state.order, this.state.items.length);
                }.bind(this)
            );
        }
    },
    onClickGlobal: function (e) {
        if (this.state.orderListStyle == 'open') {
            this.setState({orderListStyle: 'close'});
        }
    },
    render: function () {
        var el = this;
        var orderSelect;
        var orderItems = this.state.orderItems.map(function (item) {
            var className = "content-order-list-item";
            if (el.state.order == item.value) {
                className += ' selected';
                orderSelect = item.text;
            }
            return (<div key={item.value} onClick={el.onClickOrder.bind(null, item.value)}
                         className={className}>{item.text}</div>);
        });
        var authorItems = this.state.items.map(function (item) {
            return (<AuthorItem key={item.id} author={item}></AuthorItem>);
        });
        return (
            <div id="content-menu-panel" onClick={this.onClickGlobal}>
                <div className="content-header">
                    <div className="content-title-conteiner">
                        <div className="content-title"><h1>Авторы</h1></div>
                    </div>
                    <div className="content-order" onClick={this.onClickOrderList}>
                        {orderSelect}
                        <div className={"content-order-list " + this.state.orderListStyle}>
                            {orderItems}
                        </div>
                    </div>
                </div>
                {authorItems}
            </div>
        );
    }
});