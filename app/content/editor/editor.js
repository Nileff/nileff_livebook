import React from "react"
import {ajax} from "jquery"
import ReactQuill from './quill/index'

export default React.createClass({
    getInitialState: function () {
        return ({
            author: {
                id: 0,
                name: "",
                avatarUrl: ""
            },
            book: {
                genre: [],
                name: "",
                chapter_name: "",
                text: "",
                level: 0,
                parent_id: 0
            },
            valid: {
                genre: true,
                name: true,
                chapter_name: true,
                text: true
            },
            genreListStyle: 'close',
            genreItems: [],
            sending: false,
            bottomMessage: ''
        });
    },
    setBottomMessage(message){
        var me = this;
        var timeout = message.length * 2000;
        me.setState({bottomMessage: message},
            function () {
                setTimeout(function () {
                    me.setState({bottomMessage: ''});
                }, timeout);
            }
        );
    },
    onChange: function (name, e) {
        var Book = Object.assign({}, this.state.book);
        Book[name] = e.text;
        var Valid = Object.assign({}, this.state.valid);
        Valid[name] = true;
        this.setState({book: Book, valid: Valid, updSpec: e.updSpec});
    },
    onInputChange: function (name, e) {
        this.onChange(name, {text: e.target.value});
    },
    onClickGenreList: function (e) {
        if (this.state.genreListStyle == 'open') {
            this.setState({genreListStyle: 'close'});
        }
        else {
            this.setState({genreListStyle: 'open'});
        }
    },
    onClickGenre: function (e) {
        var Book = Object.assign({}, this.state.book);
        var genre = Book.genre;
        var index = genre.indexOf(+e);
        if (index > -1) {
            genre.splice(index, 1);
        }
        else {
            genre.push(+e);
        }
        var Valid = Object.assign({}, this.state.valid);
        Valid['genre'] = true;
        this.setState({book: Book, valid: Valid});
    },
    onClickGlobal: function (e) {
        if (this.state.genreListStyle == 'open') {
            this.setState({genreListStyle: 'close'});
        }
    },
    getBookData: function (postData) {
        ajax({
            type: 'POST',
            url: 'api/book/getBookEditor/',
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

        var reqParam = ['genre', 'name', 'chapter_name', 'text'];
        var Valid = {};
        for (var i = 0; i < reqParam.length; i++) {
            Valid[reqParam[i]] = true;
        }
        this.setState({valid: Valid});
    },
    upsertBookData: function () {
        var reqParam = ['genre', 'name', 'chapter_name', 'text'];
        var errorMessage = ['Вы не выбрали ни одного жанра', 'Вы не указали название книги', 'Вы не указали название главы', 'Отсутствует текст книги'];

        var allValid = true;
        var Valid = {};

        var message = reqParam.map(function(item, i){
            var param = this.state.book[item];
            if (typeof(param) == 'string') {
                param = param.replace(/\<[^\>]+\>/g, '').trim();
                param = param.replace(/\&nbsp\;/g, ' ').trim();
            }
            Valid[item] = (param.length > 0);
            if(param.length < 1) {
                if (allValid) {
                    allValid = false;
                }
                return <div key={i}>{errorMessage[i]}</div>;
            }
        }.bind(this)).filter(function(n){ return n != undefined });
        this.setState({valid: Valid});

        if (allValid && !this.state.sending) {
            var Params = Object.assign({}, this.state.book, {
                path: this.props.location.pathname,
                id: this.props.routeParams.id_book || 0
            });

            this.setState({sending: true});

            ajax({
                type: 'POST',
                url: 'api/book/upsertBook/',
                dataType: 'json',
                data: Params,
                cache: false,
                success: function (data) {
                    if (data.id) {
                        window.location.hash = '#/book/' + data.id;
                    }
                    else {
                        this.setState({sending: false});
                    }
                }.bind(this),
                error: function (xhr, status, err) {
                    console.error(this.props.url, status, 'jquery ' + err.toString());
                    this.setState({sending: false});
                }.bind(this)
            });
        }
        else if (!allValid) {
            this.setBottomMessage(message);
        }
    },
    componentWillReceiveProps: function (nextProps) {
        if (nextProps.routeParams.id_book != this.props.routeParams.id_book) {
            this.getBookData({
                path: nextProps.location.pathname,
                id: nextProps.routeParams.id_book || -1
            });
        }
    },
    componentDidMount: function () {
        ajax({
            type: 'POST',
            url: 'api/genre/getGenre/',
            dataType: 'json',
            data: {book_id: -1},
            cache: false,
            success: function (data) {
                this.setState({genreItems: data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, 'jquery ' + err.toString());
            }.bind(this)
        });
        this.getBookData({
            path: this.props.location.pathname,
            id: this.props.routeParams.id_book || -1
        });
    },
    render: function () {
        if (this.state.error) {
            return <div>{this.state.error}</div>
        }

        var el = this;
        var genreSelected = this.state.genreItems.map(function (item) {
            if (el.state.book.genre.indexOf(Number(item.id)) > -1) {
                return (<div key={item.id} className='book-genre-list-selected'>{item.text}</div>);
            }
        });
        var genreItems = this.state.genreItems.map(function (item) {
            var className = "book-genre-list-item";
            if (el.state.book.genre.indexOf(Number(item.id)) > -1) {
                className += ' selected';
            }

            return (<div key={item.id} onClick={el.onClickGenre.bind(null, item.id)}
                         className={className}>{item.text}</div>);
        });
        var genreCount = '';
        if (el.state.book.genre.length > 0) {
            genreCount = <div>{this.state.book.genre.length}:</div>
        }
        var editOn = this.state.book.level == 1 && this.state.book.parent_id == 0;

        return (
            <div className="book editor" onClick={this.onClickGlobal}>
                <div className="book-content">
                    <div className="book-header">
                        <div className="book-author">
                            <div className="name">{this.state.author.name}</div>
                            <div className="avatar"
                                 style={{backgroundImage: "url('css/img/" + this.state.author.avatarUrl + "')"}}></div>
                        </div>
                        <div className="book-title">
                            <div className="wrapper">
                                <div
                                    className={"book-name" + (editOn? " editOn": " editOff") + (this.state.valid.name ? ' valid' : ' noValid')}>
                                    <input type="text" value={this.state.book.name}
                                           style={{width:(this.state.book.name.length < 8 ? (16 * 11) : this.state.book.name.length * 22)}}
                                           onChange={this.onInputChange.bind(this, 'name')}/>
                                </div>
                            </div>
                            <div className="wrapper">
                                <div
                                    className={"book-chapter" + (this.state.valid.chapter_name ? ' valid' : ' noValid')}
                                    data-title={this.state.book.level}>
                                    <input type="text" value={this.state.book.chapter_name}
                                           style={{width:(this.state.book.chapter_name.length < 10 ? (16 * 11) : this.state.book.chapter_name.length * 17)}}
                                           onChange={this.onInputChange.bind(this, 'chapter_name')}/>
                                </div>
                            </div>
                            <div className="wrapper">
                                <div
                                    className={"book-genre" + (editOn? "": " editOff") + (this.state.valid.genre ? '' : ' noValid')}
                                    onClick={this.onClickGenreList}>
                                    <div className="wrapper">
                                        {genreCount}
                                        {genreSelected}
                                    </div>
                                    <div className={"book-genre-list " + this.state.genreListStyle}>
                                        {genreItems}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={"wrapper" + (this.state.valid.text ? '' : ' noValid')}>
                        <ReactQuill theme='snow' onChange={this.onChange.bind(this, 'text')}
                                    value={this.state.book.text}/>
                    </div>
                    <div className="book-button-panel">
                        {!!this.state.bottomMessage &&
                        <div className="book-button-panel-message">
                            {this.state.bottomMessage}
                        </div>
                        }
                        {/*<div className="button" style={{visibility: 'hidden'}}>Черновик</div>*/}
                        {this.state.sending ? <div className="loader"></div> :
                            <div className="button" onClick={this.upsertBookData}>Опубликовать</div>}
                    </div>
                </div>
            </div>
        );
    }
});