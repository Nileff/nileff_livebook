/**
 * Created by Alender on 15.03.2016.
 */
import React from "react";
import {ajax} from "jquery"
import AvatarCropper from "./imgCrop";
import AvatarUpload from "./avatarUpload"
import DatePicker from 'react-date-picker';
import PassChanger from './passChanger';

export default React.createClass({
    getInitialState: function () {
        return ({
            datePickerStyle: 'close',
            datePickerViewDate: '',
            cropperOpen: false,
            passwordOpen: false,
            img: null,
            haveChanges: false,
            changes: {},
            avatarUrl: '',
            rating: '',
            name: '',
            nameValid: true,
            name2: '',
            email: '',
            emailValid: true,
            birthday: '',
            city: '',
            education: '',
            aboute: '',
            favorite: {
                author: '',
                book: '',
                genre: '',
                film: '',
                music: ''
            },
            notice: {
                newChapter: false,
                newComment: false,
                news: false
            }
        });
    },
    handleFileChange: function (dataURI) {
        this.setState({
            img: dataURI,
            cropperOpen: true
        });
    },
    handleCrop: function (avatarData) {
        ajax({
            type: "POST",
            url: 'api/author/updateAvatar/',
            dataType: 'json',
            data: {avatarData: avatarData},
            cache: false,
            success: function (data) {
                if (data.avatar) {
                    this.setState({
                        cropperOpen: false,
                        img: null,
                        avatarUrl: data.avatar
                    });
                    this.props.updateUserInfo();
                }
                else {
                    this.setState({
                        cropperOpen: false,
                        img: null
                    });
                }
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, 'jquery ' + err.toString());
            }.bind(this)
        });
    },
    handlePasswordClick: function () {
        this.setState({passwordOpen: !this.state.passwordOpen});
    },
    handleRequestHide: function () {
        this.setState({
            cropperOpen: false
        });
    },
    handleChange(name, e){
        var index;
        if (name == 'name') {
            var text = e.target.value;
            if (text.replace(/&nbsp;/ig, ' ').trim() == '') {
                text = '';
            } else if (text.indexOf('&nbsp;') == 0) {
                text = text.replace('&nbsp;', ' ').trim();
            }
            index = text.indexOf(' ');
            var name1 = '';
            var name2 = '';
            if (index > -1) {
                name1 = text.substr(0, index);
                name2 = text.substr(index + 1);
            }
            else {
                name1 = text;
            }
            this.setState({'name': name1, 'name2': name2});
            var Changes = Object.assign({}, this.state.changes);
            Changes['name'] = name1;
            Changes['name2'] = name2;
            this.setState({haveChanges: true, changes: Changes, nameValid: true});
            return;
        }
        index = name.indexOf('.');
        var Obj = {};
        if (index > 0) {
            Obj[name.substr(0, index)] = this.state[name.substr(0, index)];
            Obj[name.substr(0, index)][name.substr(index + 1)] = e.target.value;
        }
        else {
            Obj[name] = e.target.value;
        }
        this.setState(Obj);
        var Changes = Object.assign({}, this.state.changes);
        Changes[name] = e.target.value;
        this.setState({haveChanges: true, changes: Changes});
        if (name == 'email')
            this.setState({emailValid: true});
    },
    handleDPClick(e){
        if (e.currentTarget.className == 'author-info-birthday' &&
            (e.currentTarget == e.target || e.target.localName == 'span')) {
            if (this.state.datePickerStyle == 'open') {
                this.setState({datePickerStyle: 'close'});
            }
            else {
                this.setState({datePickerStyle: 'open'});
            }
        }
    },
    handleGlobalClick(e){
        if (e.target.className == "modal-window") {
            this.setState({passwordOpen: false});
            return;
        }
        if (e.target.offsetParent.className.indexOf('author-info-birthday-picker') > -1)
            return;
        if (this.state.datePickerStyle == 'open') {
            this.setState({datePickerStyle: 'close'});
        }
    },
    handleDPChange(dateStr, date, e){
        var Changes = Object.assign({}, this.state.changes);
        Changes['birthday'] = dateStr;
        this.setState({birthday: dateStr, datePickerStyle: 'close', haveChanges: true, changes: Changes});
    },
    handleDPViewDateChange(dateStr, date, view){
        this.setState({datePickerViewDate: dateStr});
    },
    handleValidateEmail: function () {
        var match = this.state.email.match(/@[^@]/ig);
        var valid = (this.state.email.length > 3 && match != null && match.length == 1);
        this.setState({emailValid: valid});
        return valid;
    },
    handleValidateName: function () {
        var name = this.state.name.replace(/&nbsp;/ig, ' ').replace(/[\s]+/ig, ' ').trim();
        var name2 = this.state.name2.replace(/&nbsp;/ig, ' ').replace(/[\s]+/ig, ' ').trim();
        var match = (name + ' ' + name2).match(/[\S]/ig);
        var valid = match && match.length > 1;
        this.setState({nameValid: valid, name: name, name2: name2});
        return valid
    },
    getUserData: function (loginState) {
        if (loginState) {
            ajax({
                type: "POST",
                url: 'api/author/getAuthor/',
                dataType: 'json',
                data: {state: 'full'},
                cache: false,
                success: function (data) {
                    this.setState(data);
                }.bind(this),
                error: function (xhr, status, err) {
                    console.error(this.props.url, status, 'jquery ' + err.toString());
                }.bind(this)
            });
        }
    },
    updateUserInfo: function () {
        if (this.props.loginState && this.handleValidateEmail() & this.handleValidateName()) {
            var name = this.state.name.replace(/&nbsp;/ig, ' ').replace(/[\s]+/ig, ' ').trim();
            var name2 = this.state.name2.replace(/&nbsp;/ig, ' ').replace(/[\s]+/ig, ' ').trim();
            var Changes = Object.assign({}, this.state.changes);
            Changes['name'] = name;
            Changes['name2'] = name2;
            ajax({
                type: "POST",
                url: 'api/author/updateInfo/',
                dataType: 'json',
                data: {user: Changes},
                cache: false,
                success: function (data) {
                    if (data.success) {
                        this.setState({changes: {}, haveChanges: false})
                    }
                }.bind(this),
                error: function (xhr, status, err) {
                    console.error(this.props.url, status, 'jquery ' + err.toString());
                }.bind(this)
            });
        }
    },
    componentDidMount: function () {
        this.getUserData(this.props.loginState);
    },
    componentWillReceiveProps: function (nextProps) {
        if (this.props.loginState != nextProps.loginState) {
            this.getUserData(nextProps.loginState);
        }
    },
    render () {
        return (
            <div className="author settings" id="settings"
                 onClick={this.handleGlobalClick}>
                <div className="content-header">
                    <div className="content-title-conteiner">
                        <div className="content-title"><h1>Настройки</h1></div>
                    </div>
                </div>
                <div className="wrapper">
                    <div className="author-avatar-box">
                        <div className="author-avatar">
                            <AvatarUpload handleFileChange={this.handleFileChange}/>
                            <div style={{backgroundImage: 'url("css/img/' + this.state.avatarUrl + '")'}}></div>
                        </div>
                    </div>
                    <div className="author-info-box">
                        <div className="wrapper">
                            <div className={"author-info-name " + (this.state.nameValid?'valid':'noValid')}>
                                <input type="text"
                                       value={this.state.name + (this.state.name2 ? " " + this.state.name2 : "")}
                                       onChange={this.handleChange.bind(this, 'name')}/>
                            </div>
                            <div>
                                <div className={"author-info-email " + (this.state.emailValid?'valid':'noValid')}>
                                    <input type="text"
                                           value={this.state.email}
                                           onChange={this.handleChange.bind(this, 'email')}/>
                                </div>
                                <div className="author-info-password">
                                    <div onClick={this.handlePasswordClick}>********</div>
                                </div>
                                <div className="author-info-birthday" onClick={this.handleDPClick}>
                                    {this.state.birthday}
                                    <div className={"author-info-birthday-picker " + this.state.datePickerStyle}>
                                        <DatePicker
                                            locale="ru"
                                            hideFooter
                                            highlightWeekends
                                            defaultView="decade"
                                            dateFormat="DD.MM.YYYY"
                                            date={this.state.birthday}
                                            viewDate={this.state.datePickerViewDate || this.state.birthday}
                                            maxDate={new Date()}
                                            monthFormat="MMM"
                                            navPrev="<"
                                            navNext=">"
                                            onViewDateChange={this.handleDPViewDateChange}
                                            onChange={this.handleDPChange}
                                        />

                                    </div>
                                </div>
                                <div className="author-info-city">
                                    <input type="text"
                                           value={this.state.city}
                                           onChange={this.handleChange.bind(this, 'city')}/>
                                </div>
                                <div className="author-info-education">
                                    <input type="text"
                                           value={this.state.education}
                                           onChange={this.handleChange.bind(this, 'education')}/>
                                </div>
                            </div>
                            <div className="author-info-favorite">
                                <div className="author">
                                    <input type="text"
                                           value={this.state.favorite.author}
                                           onChange={this.handleChange.bind(this, 'favorite.author')}/>
                                </div>
                                <div className="book">
                                    <input type="text"
                                           value={this.state.favorite.book}
                                           onChange={this.handleChange.bind(this, 'favorite.book')}/>
                                </div>
                                <div className="genre">
                                    <input type="text"
                                           value={this.state.favorite.genre}
                                           onChange={this.handleChange.bind(this, 'favorite.genre')}/>
                                </div>
                                <div className="film">
                                    <input type="text"
                                           value={this.state.favorite.film}
                                           onChange={this.handleChange.bind(this, 'favorite.film')}/>
                                </div>
                                <div className="music">
                                    <input type="text"
                                           value={this.state.favorite.music}
                                           onChange={this.handleChange.bind(this, 'favorite.music')}/>
                                </div>
                            </div>
                            <div className="author-info-about">
                                <textarea value={this.state.about}
                                          onChange={this.handleChange.bind(this, 'about')}></textarea>
                            </div>
                            <div className="author-info-notice">
                                <div className="author-info-notice-title">
                                    Подписаться на уведомления о:
                                </div>
                                <div
                                    className={"author-info-notice-newChapter" + (!(+this.state.notice.newChapter) ? '': ' checked')}
                                    onClick={this.handleChange.bind(this, 'notice.newChapter', {target:{value:+(!(+this.state.notice.newChapter))}})}>
                                    Новых главах к моим книгам
                                </div>
                                <div
                                    className={"author-info-notice-newComment" + (!(+this.state.notice.newComment) ? '': ' checked')}
                                    onClick={this.handleChange.bind(this, 'notice.newComment', {target:{value:+(!(+this.state.notice.newComment))}})}>
                                    Комментариях к моим главам

                                </div>
                                <div
                                    className={"author-info-notice-news" + (!(+this.state.notice.news) ? '': ' checked')}
                                    onClick={this.handleChange.bind(this, 'notice.news', {target:{value:+(!(+this.state.notice.news))}})}>
                                    Новостях проекта
                                </div>
                            </div>
                            <div>
                                <div
                                    className={"button " + (this.state.haveChanges?"visible":"hide")}
                                    onClick={this.updateUserInfo}>
                                    Сохранить
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {this.state.cropperOpen &&
                <AvatarCropper
                    onRequestHide={this.handleRequestHide}
                    cropperOpen={this.state.cropperOpen}
                    onCrop={this.handleCrop}
                    image={this.state.img}
                    width={16 * 12}
                    height={16 * 12}
                />
                }
                {this.state.passwordOpen &&
                <PassChanger visibleChange={this.handlePasswordClick}
                             updateUserInfo={this.props.updateUserInfo}>
                </PassChanger>
                }
            </div>
        );
    }
});


