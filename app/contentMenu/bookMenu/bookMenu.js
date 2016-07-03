/**
 * Created by Alender on 24.11.2015.
 */

import React from "react"
import ReactDOM from 'react-dom'
import {ajax} from "jquery"
import BookItem  from "./bookItem"

export default React.createClass({
    getInitialState: function () {
        return ({
            queryParams: {
                order: 'update',
                offset: 0
            },
            id: '',
            filter: '',
            orderItems: [{
                value: "update",
                text: "дате обновления"
            }, {
                value: "public",
                text: "дате публикации"
            }, {
                value: "rating",
                text: "рейтингу"
            }, {
                value: "name",
                text: "названию"
            }, {
                value: "author",
                text: "автору"
            }
            ],
            orderListStyle: 'close',
            count: 0,
            items: [],
            scrollTop: 0
        }
        );
    },
    getBookItem: function (postData) {
        ajax({
            type: "POST",
            url: 'api/book/getBookList/',
            dataType: 'json',
            data: postData,
            cache: false,
            success: function (data) {
                var Items = this.state.items.concat(data.items);
                var Params = Object.assign({}, this.state.queryParams);
                Params.offset = Items.length;
                this.setState({count: data.count, items: Items, queryParams: Params},
                    function () {
                        window.beginLoadPosition = 0;
                    });
            }.bind(this),
            error: function (xhr, status, err) {
                window.beginLoadPosition = 0;
                console.error(this.props.url, status, 'jquery ' + err.toString());
            }.bind(this)
        });
    },
    componentWillReceiveProps(nextProps){
        if (nextProps.location.pathname.replace('/!/', '/') != this.props.location.pathname.replace('/!/', '/')) {
            var Params = Object.assign({}, this.state.queryParams);
            Params.path = nextProps.location.pathname;
            Params.offset = 0;
            delete Params.id;
            if (nextProps.routeParams && nextProps.routeParams.id) {
                Params.id = nextProps.routeParams.id;
            }
            this.setState({queryParams: Params, items: []},
                function () {
                    this.getBookItem(this.state.queryParams);
                }.bind(this)
            );

            document.getElementById("main-panel").removeEventListener("scroll", this.onScroll);
            document.getElementById("main-panel").addEventListener("scroll", this.onScroll);
        }
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
            this.getBookItem(this.state.queryParams);
        }
    },
    componentDidMount: function () {
        var Params = Object.assign({}, this.state.queryParams);
        Params.path = this.props.location.pathname;
        delete Params.id;
        Params.offset = 0;
        if (this.props.routeParams && this.props.routeParams.id) {
            Params.id = this.props.routeParams.id;
        }
        this.setState({queryParams: Params, items: []});
        this.getBookItem(Params);

        window.beginLoadPosition = 0;
        document.getElementById("main-panel").addEventListener("scroll", this.onScroll);
    },
    componentDidUpdate: function(){
        if(this.state.items.length > 0 && this.state.items.length < 100) {
            var ins = document.getElementsByTagName("ins");
            var hasEmpty = false;

            for (var i = 0; i < ins.length; ++i) {
                if(ins[i].innerHTML.trim().length == 0){
                    hasEmpty = true;
                    break;
                }
            }
            if(hasEmpty)
                (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
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
        var Params = Object.assign({}, this.state.queryParams);
        Params.order = e;
        Params.offset = 0;
        if (this.state.queryParams != Params) {
            this.setState({queryParams: Params, items: []},
                function () {
                    this.getBookItem(this.state.queryParams);
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
            if (el.state.queryParams.order == item.value) {
                className += ' selected';
                orderSelect = item.text;
            }
            return (<div key={item.value} onClick={el.onClickOrder.bind(null, item.value)}
                         className={className}>{item.text}</div>);
        });

        var bookItems = this.state.items.map(function (item) {
            return (<BookItem key={item.id} book={item}></BookItem>);
        });

        var ads = function(i){
            return <div key={"ads_" + i} className="book-conteiner">
                <div className="book-item ads">
                    <ins className="adsbygoogle"
                         style={{display:'inline-block',width:240,height:400}}
                         data-ad-client="ca-pub-1822956251122987"
                         data-ad-slot="1503211346">
                    </ins>
                </div>
            </div>;
        };

        if(bookItems.length > 5){
            bookItems.splice(5, 0, ads(0));
            if(bookItems.length > 35){
                bookItems.splice(35, 0, ads(1));
                if(bookItems.length > 65){
                    bookItems.splice(65, 0, ads(2));
                }
            }
        }
        else if(bookItems.length > 0){
            bookItems.push(ads(0));
        }

        var title;
        var path = this.state.queryParams.path;
        if (path) {
            path = path.match(/[a-z]+\/[a-z]+/) + '';

            switch (path) {
                case 'library/all':
                    title = 'Все книги';
                    break;
                case 'library/favorite':
                    title = 'Избранное';
                    break;
                case 'user/book':
                    title = 'Мои книги';
                    break;
                case 'library/genre':
                    if (this.state.items.length > 0) {
                        var genres = this.state.items[0].genre;
                        for (var i = 0; i < genres.length; i++) {
                            if (genres[i].id == this.state.queryParams.id) {
                                title = genres[i].text;
                                break;
                            }
                        }
                    }
                    break;
            }
        }
        else {
            title = 'Библиотека';
        }

        return (
            <div id="content-menu-panel" onClick={this.onClickGlobal}>
                <div className="content-header">
                    <div className="content-title-conteiner">
                        <div className="content-title"><h1>{title}</h1></div>
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