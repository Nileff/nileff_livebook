/**
 * Created by Alender on 02.03.2016.
 */

import React from "react"
import {ajax} from "jquery"
import Rating from "./../../main/rating"
import BookItem from "./../../contentMenu/bookMenu/bookItem"

export default React.createClass({
    getInitialState: function () {
        return ({
            user:{
                avatarUrl: '',
                name: '',
                name2: '',
                birthday: '',
                city: '',
                education: '',
                about: '',
                rating: '',
                favorite: {
                    author: '',
                    book: '',
                    genre: '',
                    film: '',
                    music: ''
                }
            },
            book: {
                count: 0,
                items: []
            }
        }
        );
    },
    getAuthorInfo: function(id){
        ajax({
            type: "POST",
            url: 'api/author/getAuthor/',
            dataType: 'json',
            data: {id: id},
            cache: false,
            success: function (data) {
                this.setState(data);
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, 'jquery ' + err.toString());
            }.bind(this)
        });
    },
    componentWillReceiveProps(nextProps){
        if(this.props.routeParams.id != nextProps.routeParams.id){
            this.getAuthorInfo(nextProps.routeParams.id);
        }
    },
    componentDidMount: function () {
        this.getAuthorInfo(this.props.routeParams.id);
    },
    render: function () {
        var bookItems = this.state.book.items.map(function (item) {
            return (<BookItem key={item.id} book={item}></BookItem>);
        });

        return (
            <div className="author">
                <div className="wrapper">
                    <div className="author-avatar-box">
                        <div className="author-avatar">
                            <div style={{backgroundImage: 'url("css/img/' + this.state.user.avatarUrl + '")'}}></div>
                        </div>
                        <Rating>{this.state.user.rating}</Rating>
                    </div>
                    <div className="author-info-box">
                        <div className="wrapper">
                            <div className="author-info-name">{this.state.user.name + " " + this.state.user.name2}</div>
                            <div className="author-info-birthday">{this.state.user.birthday}</div>
                            <div className="author-info-city">{this.state.user.city}</div>
                            <div className="author-info-education">{this.state.user.education}</div>
                            <div className="author-info-favorite">
                                <div className="author">{this.state.user.favorite.author}</div>
                                <div className="book">{this.state.user.favorite.book}</div>
                                <div className="genre">{this.state.user.favorite.genre}</div>
                                <div className="film">{this.state.user.favorite.film}</div>
                                <div className="music">{this.state.user.favorite.music}</div>
                            </div>
                            <div className="author-info-about">{this.state.user.about}</div>
                        </div>
                    </div>
                </div>
                <div className="author-book">
                    <div className="author-book-header">
                        <div className="content-title-conteiner">
                            <div className="content-title">
                                <h1>Книги автора:</h1>
                            </div>
                        </div>
                    </div>
                    <div className="author-book-items">
                        {bookItems}
                    </div>
                </div>
            </div>
        );
    }
});