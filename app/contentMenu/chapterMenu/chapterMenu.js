/**
 * Created by Alender on 24.11.2015.
 */

import React from "react"
import {ajax} from "jquery"
import BookItem  from "./chapterItem"

export default React.createClass({
    getInitialState: function() {
        return ({
            order: 'public',
            orderItems: [{
                value: "public",
                text: "дате публикации"
            }, {
                value: "rating",
                text: "рейтингу"
            }, {
                value: "name",
                text: "названию"
            }],
            orderListStyle: 'close',
            items: []
        }
        );
    },
    getChapter: function(postData){
        ajax({
            type: "POST",
            url: 'api/book/getChapterList/',
            dataType: 'json',
            data: postData,
            cache: false,
            success: function (data) {
                this.setState(data);
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, 'jquery ' + err.toString());
            }.bind(this)
        });
    },
    componentDidMount: function () {
        this.getChapter({order: this.state.order});
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
            this.setState({order: e});
            this.getChapter({order: e})
        }
    },
    onClickGlobal: function (e) {
        if (this.state.orderListStyle == 'open') {
            this.setState({orderListStyle: 'close'});
        }
    },
    render: function() {
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
        var bookItems = this.state.items.map(function(item){
            return (<BookItem key={item.id} book={item}></BookItem>);
        });
        return (
            <div id="content-menu-panel" onClick={this.onClickGlobal}>
                <div className="content-header">
                    <div className="content-title-conteiner">
                        <div className="content-title"><h1>Библиотека</h1></div>
                    </div>
                    <div className="content-order" onClick={this.onClickOrderList}>
                        {orderSelect}
                        <div className={"content-order-list " + this.state.orderListStyle}>
                            {orderItems}
                        </div>
                    </div>
                </div>
                {bookItems}
            </div>
        );
    }
});