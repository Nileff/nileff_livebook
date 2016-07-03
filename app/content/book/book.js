/**
 * Created by Alender on 02.03.2016.
 */

import React from "react"
import ReactDOM from "react-dom"
import {Link} from "react-router"
import {ajax} from "jquery"
import Rating from "./../../main/rating"
import Chapter from "./chapterItem"
import Stat_Comment from "./stat_comment"

export default React.createClass({
    getInitialState: function () {
        return ({
            author: {
                id: -1,
                name: '',
                avatarUrl: ''
            },
            name: '',
            text: '',
            rating: 0,
            readCount: 0,
            commentCount: 0,
            chapter: {
                level: 0,
                name: '',
                items: []
            },
            openRight: false,
            openBottom: false,
            ratingMessage: '',
            startTime: 0
        });
    },
    getDefaultProps: function () {
        return {
            loginState: false
        };
    },
    propTypes: {
        loginState: React.PropTypes.bool.isRequired
    },
    getBook: function (id_book) {
        ajax({
            type: 'POST',
            url: 'api/book/getBook/',
            dataType: 'json',
            data: {id: id_book},
            cache: false,
            success: function (data) {
                this.setState({openRight: false, openBottom: false});
                this.setState(data, function () {
                    this.setState({startTime: (new Date)});
                    document.getElementById("book-text").scrollTop = 0;
                });
                document.title = data.author.name + ' - ' + data.name + ' (' + data.chapter.name + ') | Живая Книга - литературный портал';
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, 'jquery ' + err.toString());
            }.bind(this)
        });
    },
    componentDidMount: function () {
        window.addEventListener("beforeunload", this.setRead);

        this.getBook(this.props.routeParams.id_book);

        var adsDiv = document.getElementById("ads");
        adsDiv.innerHTML = '';

        var adsIns = document.createElement("ins");
        adsIns.style.display = 'block';
        adsIns.className = 'adsbygoogle';
        adsIns.setAttribute('data-ad-client', "ca-pub-1822956251122987");
        adsIns.setAttribute('data-ad-slot', "6036742949");
        adsIns.setAttribute('data-ad-format', "auto");

        adsDiv.appendChild(adsIns);

        (window.adsbygoogle = window.adsbygoogle || []).push({});
    },
    setRead: function (async) {
        /*var conteiner = document.getElementById("book-text");
         var content = conteiner.firstChild;

         var conteinerHeight = conteiner.offsetHeight;
         var contentHeight = content.offsetHeight;
         var scrollPosition = conteiner.scrollTop;

         if (conteinerHeight >= contentHeight ||
         contentHeight / 1.5 < conteinerHeight + scrollPosition) {*/
        ajax({
            type: 'POST',
            url: 'api/book/setRead/',
            data: {
                time: ((new Date) - this.state.startTime) / 1000,
                id: this.props.routeParams.id_book
            },
            cache: false,
            async: (async ? true : false),
            success: function () {
                return;
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, 'jquery ' + err.toString());
                return;
            }.bind(this)
        });
        /*}
         else
         return;*/
    },
    componentWillReceiveProps: function (nextProps) {
        if (nextProps.routeParams.id_book != this.props.routeParams.id_book) {
            this.setRead(true);
            this.getBook(nextProps.routeParams.id_book);

            var adsDiv = document.getElementById("ads");
            adsDiv.innerHTML = '';

            var adsIns = document.createElement("ins");
            adsIns.style.display = 'block';
            adsIns.className = 'adsbygoogle';
            adsIns.setAttribute('data-ad-client', "ca-pub-1822956251122987");
            adsIns.setAttribute('data-ad-slot', "6036742949");
            adsIns.setAttribute('data-ad-format', "auto");

            adsDiv.appendChild(adsIns);
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
    },
    componentWillUnmount: function () {
        window.removeEventListener("beforeunload", this.setRead);
        this.setRead(true);
    },
    rightPanelClickHandle: function () {
        this.setState({openRight: !this.state.openRight});
    },
    bottomPanelClickHandle: function () {
        this.setState({openBottom: !this.state.openBottom});
    },
    setRatingMessage(message){
        var me = this;
        var timeout = message.length * 80;
        me.setState({ratingMessage: message},
            function () {
                setTimeout(function () {
                    me.setState({ratingMessage: ''});
                }, timeout);
            }
        );
    },
    handlerRatingClick(e){
        if (this.props.loginState) {
            var mainKey = e._dispatchIDs;
            var subKey = e.dispatchMarker;
            var Mark = subKey.replace(mainKey, '');
            if (Mark.length > 0) {
                Mark = Mark.substr(Mark.length - 1, 1);
                Mark++;
            }
            else {
                Mark = 5;
            }

            ajax({
                type: 'POST',
                url: 'api/book/setMark/',
                dataType: 'json',
                data: {mark: Mark, id: this.props.routeParams.id_book},
                cache: false,
                success: function (data) {
                    if (data.error) {
                        this.setRatingMessage('Что-то пошло не так');
                    }
                    else {
                        this.setState({rating: data.rating}, function () {
                            if (data.old_mark < 0) {
                                this.setRatingMessage('Ваша оценка ' + data.mark + ' учтена');
                            }
                            else if (data.old_mark == data.mark) {
                                this.setRatingMessage('Вы не изменили свою оценку ' + data.mark);
                            }
                            else if (data.old_mark != data.mark) {
                                this.setRatingMessage('Вы изменили свою оценку с ' + data.old_mark + ' на ' + data.mark);
                            }
                        });
                    }
                }.bind(this),
                error: function (xhr, status, err) {
                    console.error(this.props.url, status, 'jquery ' + err.toString());
                }.bind(this)
            });
        }
        else {
            this.setRatingMessage('Книги могут оценивать только зарегистрированные пользователи');
        }
    },
    setFavorite(){
        ajax({
            type: 'POST',
            url: 'api/book/setFavorite/',
            dataType: 'json',
            data: {id: this.props.routeParams.id_book, parent_id: this.state.parent_id},
            cache: false,
            success: function (data) {
                this.setState(data);
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, 'jquery ' + err.toString());
            }.bind(this)
        });
    },
    setStat: function(mark, read, comment){
        this.setState({
            rating: mark,
            readCount: read,
            commentCount: comment
        });
    },
    render: function () {
        var chapterItems = this.state.chapter.items.map(function (item) {
            return (<Chapter key={item.id} chapter={item}/>);
        });

        return (
            <div className="book">
                <div className={"book-content" + (this.state.chapter.items.length > 0 ? '' : ' full')}>
                    <div className="book-header">
                        <Link
                            activeClassName='active' to={'/library/author/' + this.state.author.id}
                            className="book-author">
                            <div className="name">{this.state.author.name}</div>
                            <div className="avatar"
                                 style={{backgroundImage: 'url("css/img/' + this.state.author.avatarUrl + '")'}}></div>
                        </Link>
                        <div className="book-title">
                            <Link className="back-btn" activeClassName='active' to={'/book/' + this.state.prev_id}
                                  style={{visibility: (this.state.prev_id && this.state.prev_id > 0 ? 'visible': 'hidden')}}></Link>
                            <Link className="home-btn" activeClassName='active' to={'/book/' + this.state.parent_id}
                                  style={{visibility: (this.state.parent_id && this.state.parent_id>0 ? 'visible': 'hidden')}}></Link>
                            <div className="book-name">{this.state.name}</div>
                            <div className="book-chapter"
                                 data-title={this.state.chapter.level}>{this.state.chapter.name}</div>
                        </div>
                        <div className={"bookmark" + ((this.state.favorite == "true") ? ' active': '')}
                             onClick={this.setFavorite}>
                        </div>
                    </div>
                    <div className="book-text" id="book-text">
                        <div dangerouslySetInnerHTML={{__html: this.state.text}}/>
                        <div id="ads"/>
                    </div>

                    <div className={"book-bottom-panel " +(this.state.openBottom ? "open": "close")}>
                        <div className="bottom-panel-control"
                             onClick={this.bottomPanelClickHandle}>{this.state.openBottom ? '\u02C5' : '\u02C4'}</div>
                        <div className="bottom-panel-content">
                            {this.state.openBottom &&
                            <Stat_Comment loginState={this.props.loginState}
                                          id_book={this.props.routeParams.id_book}
                                          setParentState={this.setStat}/>
                            }
                            {this.state.openBottom ||
                            <div>
                                <div className="ratingMessage">
                                    <div>{this.state.ratingMessage}</div>
                                </div>
                                <Rating handlerClick={this.handlerRatingClick}>{this.state.rating}</Rating>
                                <div className="stat">
                                    <div className="readStat">
                                        {this.state.readCount}
                                    </div>
                                    <div className="commentStat">
                                        {this.state.commentCount}
                                    </div>
                                </div>
                                {
                                    !!this.state.chapter.items.length || this.props.userId != this.state.author.id ||
                                    <Link activeClassName='active' to={'/edit/' + this.props.routeParams.id_book}
                                          className="button">
                                        Редактировать
                                    </Link>
                                }
                                {
                                    !!this.state.chapter.items.length ||
                                    <Link className="button"
                                          activeClassName='active' to={'/write/' + this.props.routeParams.id_book}>
                                        Продолжить
                                    </Link>
                                }
                            </div>
                            }
                        </div>
                    </div>
                </div>
                {
                    !this.state.chapter.items.length ||
                    <div className={"book-next-panel " + (this.state.openRight?'open':'close')}>
                        <div className="next-panel-control"
                             onClick={this.rightPanelClickHandle}>{(this.state.openRight ? '>' : '<')}</div>
                        <div className="next-panel-content">
                            <div className="next-panel-header">
                                {"Глава " + (+this.state.chapter.level + 1)}
                            </div>
                            <div className="next-panel-content-chapter">
                                {chapterItems}
                            </div>
                            <Link className="button"
                                  activeClassName='active' to={'/write/' + this.props.routeParams.id_book}>
                                Написать свой вариант
                            </Link>
                        </div>
                    </div>
                }
            </div>
        );
    }
});