import React from "react"
import {Link} from "react-router"
import {ajax} from "jquery"
import Rating from "./../../main/rating"

export default React.createClass({
    getInitialState: function () {
        return ({
            marks: [],
            read: [],
            comments: [],
            ratingMessage: '',
            commentText: '',
            sending: false
        });
    },
    getBookStat: function (id_book) {
        ajax({
            type: 'POST',
            url: 'api/book/getBookStat_Comment/',
            dataType: 'json',
            data: {id: id_book},
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
        this.getBookStat(this.props.id_book);
    },
    componentWillUnmount: function(){
        var mark = 0;
        this.state.marks.map(function (item) {
            mark += (+item.mark);
        });
        mark = mark / this.state.marks.length;
        mark = Math.round(mark * 100) / 100;

        var readCount = 0;
        this.state.read.map(function (item) {
            if (item.author.id > 0) {
                readCount++;
            }
            else {
                readCount += (+item.count);
            }
        });

        var commentCount = this.state.comments.length;

        this.props.setParentState(mark, readCount, commentCount);
    },
    setBookMark: function (e) {
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
                data: {mark: Mark, id: this.props.id_book},
                cache: false,
                success: function (data) {
                    if (data.error) {
                        this.setRatingMessage('Что-то пошло не так');
                    }
                    else {
                        this.getBookStat(this.props.id_book);
                        if (data.old_mark < 0) {
                                this.setRatingMessage('Ваша оценка ' + data.mark + ' учтена');
                            }
                        else if (data.old_mark == data.mark) {
                                this.setRatingMessage('Вы не изменили свою оценку ' + data.mark);
                            }
                        else if (data.old_mark != data.mark) {
                                this.setRatingMessage('Вы изменили свою оценку с ' + data.old_mark + ' на ' + data.mark);
                            }
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
    setRatingMessage(message){
        var me = this;
        var timeout = message.length * 70;
        me.setState({ratingMessage: message},
            function () {
                setTimeout(function () {
                    me.setState({ratingMessage: ''});
                }, timeout);
            }
        );
    },
    addComment: function () {
        if(this.state.commentText.trim().length && !this.state.sending) {
            this.setState({sending:true});
            ajax({
                type: 'POST',
                url: 'api/book/addComment/',
                dataType: 'json',
                data: {id: this.props.id_book, text: this.state.commentText},
                cache: false,
                success: function (data) {
                    if (!data.error) {
                        this.setState({commentText: ''});
                    }
                    this.getBookStat(this.props.id_book);
                    this.setState({sending:false});
                }.bind(this),
                error: function (xhr, status, err) {
                    console.error(this.props.url, status, 'jquery ' + err.toString());
                    this.setState({sending:false});
                }.bind(this)
            });
        }
    },
    changeComment: function(e){
        this.setState({commentText: e.target.value})
    },
    keyDown: function(e){
        if(e.ctrlKey && e.keyCode==13 || e.keyCode==10) {
            this.addComment();
        }
    },
    render: function () {
        var mark = 0;
        var ratingUser = this.state.marks.map(function (item) {
            mark += (+item.mark);
            return (
                <Link key={item.author.id}
                      className={item.author.avatarUrl.length > 1 ? "user" : "user empty"}
                      to={"/library/author/" + item.author.id}
                      style={{backgroundImage: 'url("css/img/' + item.author.avatarUrl + '")'}}
                      data-mark={item.mark}
                      data-name={item.author.name}/>
            );
        });

        mark = mark / this.state.marks.length;
        mark = Math.round(mark * 100) / 100;

        var readCount = 0;
        var readUser = this.state.read.map(function (item) {
            if (item.author.id > 0) {
                readCount++;
                return (
                    <Link key={item.author.id}
                          className={item.author.avatarUrl.length > 1 ? "user" : "user empty"}
                          to={"/library/author/" + item.author.id}
                          style={{backgroundImage: 'url("css/img/' + item.author.avatarUrl + '")'}}
                          data-name={item.author.name}/>
                );
            }
            else {
                readCount += (+item.count);
                return (
                    <div key={item.author.id}
                         className="user empty"
                         style={{backgroundImage: 'url("css/img/' + item.author.avatarUrl + '")'}}
                         data-name={"Гости: " + item.count}></div>
                );
            }
        });

        var comment;
        if (this.state.comments.length > 0) {
            comment = this.state.comments.map(function (item) {
                    var textArr = item.text.split(/\n/g);
                    var text = textArr.map(function (textitem, i) {
                        return <div key={i}>{textitem}</div>
                    });

                    return (
                        <div key={item.id}
                             className="comment-item-wrapper">
                            <div className="comment-item">
                                {!!item.author.avatarUrl &&
                                <Link className="comment-item-user-avatar" to={"/library/author/" + item.author.id}
                                     style={{backgroundImage: 'url("css/img/' + item.author.avatarUrl + '")'}}></Link>
                                }
                                {!item.author.avatarUrl &&
                                <Link
                                    className="comment-item-user-avatar empty" to={"/library/author/" + item.author.id}>
                                </Link>
                                }
                                <div className="comment-item-content">
                                    <div className="comment-item-header">
                                        <div className="comment-item-date">{item.public_date}</div>
                                        <div className="comment-item-user-name">{item.author.name}</div>
                                    </div>
                                    <div className="comment-item-text">
                                        {text}
                                    </div>
                                </div>
                            </div>
                        </div>);
                }
            );
        }
        else {
            comment = <div className="emptyComment">Комментарии еще никто не оставлял</div>
        }

        return (
            <div>
                <div className="ratingStat">
                    <div className="ratingStat-left">
                        <Rating handlerClick={this.setBookMark}>{mark}</Rating>
                        <div className="rating-legend">{mark + " (" + this.state.marks.length + ")"}</div>
                    </div>
                    <div className="ratingStat-center">
                        {!!this.state.ratingMessage &&
                        <div className="ratingStat-message">{this.state.ratingMessage}</div>}
                        {ratingUser}
                    </div>
                    {/*<div className="ratingStat-right"></div>*/}
                </div>
                <div className="readStat">
                    <div className="readStat-left">{readCount}</div>
                    <div className="readStat-center">
                        {readUser}
                    </div>
                    {/*<div className="readStat-right"></div>*/}
                </div>
                <div className="comment">
                    <div className="comment-count">Комментарии ({this.state.comments.length})</div>
                    <div className="comment-data">
                        {comment}
                    </div>
                    {this.props.loginState &&
                    <div className="comment-input">
                        <div className="comment-text">
                            <textarea value={this.state.commentText}
                                      onKeyDown={this.keyDown}
                                      onChange={this.changeComment}/>
                        </div>
                        {this.state.sending ? <div className="loader"></div> :
                        <div className="button" onClick={this.addComment}>Отправить</div>}
                    </div>
                    }
                    {this.props.loginState ||
                    <div className="comment-input">
                        <div className="noUser">Комментарии могут оставлять только зарегистрированные пользователи</div>
                    </div>
                    }
                </div>
            </div>
        );
    }
});