/**
 * Created by Alender on 18.03.2016.
 */
import React from "react"
import {ajax} from "jquery"
import {Link} from "react-router"

export default React.createClass({
    getInitialState: function () {
        return ({
            input: {
                login: '',
                pass: ''
            },
            valid: {
                login: true,
                pass: true,
                pass2: true,
                email: true
            },
            style: 'close',
            error: '',
            reg: false
        });
    },
    handleClick: function (e) {
        if (e.currentTarget == e.target || e.currentTarget.id == 'login-btn') {
            if (this.props.loginState) {
                this.props.logout();
            }
            else {
                if (this.state.style == 'close') {
                    this.setState({style: 'open'});
                }
                else {
                    this.setState({style: 'close'});
                }
            }
        }
    },
    handleLogin: function () {
        if (this.handleValidateName() & this.handleValidatePass()) {
            this.setState({error: ''});
            ajax({
                type: "POST",
                data: this.state.input,
                url: 'api/auth/getToken/',
                dataType: 'json',
                //contentType: "application/json; charset=utf-8",
                cache: false,
                success: function (data) {
                    if (data.length > 0) {
                        var item = data[0];
                        if (item.error) {
                            if (item.error == 'noUser') {
                                this.setState({error: 'Неправильный логин или пароль'});
                            }
                            else {
                                this.setState({error: 'Что-то пошло не так. Повторите вход'});
                            }
                        }
                        else {
                            this.props.auth(item);
                            this.setState({
                                input: {
                                    login: '',
                                    pass: ''
                                },
                                style: 'close',
                                error: '',
                                reg: false
                            });
                            this.setState({
                                valid: {
                                    login: true,
                                    pass: true,
                                    pass2: true,
                                    email: true
                                }
                            });
                        }
                    }
                }.bind(this),
                error: function (xhr, status, err) {
                    console.error(this.props.url, status, 'jquery ' + err.toString());
                }.bind(this)
            });
        }
        else {
            this.setState({error: 'Неправильный логин или пароль'});
        }
    },
    onKeyEnter: function (e) {
        if (e.keyCode == 13) {
            if (this.handleValidateName() & this.handleValidatePass()) {
                if (this.state.reg) {
                    if (this.state.valid.email && this.state.valid.pass2) {
                        e.target.blur();
                        this.handleReg();
                    }
                }
                else {
                    e.target.blur();
                    this.handleLogin();
                }
            }
        }
    },
    handleChange: function (name, e) {
        var input = Object.assign({},this.state.input);
        var valid = Object.assign({},this.state.valid);
        input[name] = e.target.value;
        valid[name] = true;
        this.setState({input: input, valid: valid, error: ''});
    },
    handleReg: function () {
        if (this.state.reg) {
            if (this.handleValidateName() &
                this.handleValidatePass() &
                this.handleValidateEmail() &
                this.handleValidatePass2()) {
                if(this.state.ruleChecked) {
                    this.setState({error: ''});
                    ajax({
                        type: "POST",
                        data: this.state.input,
                        url: 'api/auth/newUser/',
                        dataType: 'json',
                        //contentType: "application/json; charset=utf-8",
                        cache: false,
                        success: function (data) {
                            if (data.length > 0) {
                                var item = data[0];
                                if (item.error) {
                                    if (item.error == 'user') {
                                        this.setState({error: 'Пользователь уже существует'});
                                    }
                                    else {
                                        this.setState({error: 'Что-то пошло не так. Повторите позже'});
                                    }
                                }
                                else if (item.success) {
                                    this.setState({reg: false});
                                    this.handleLogin();
                                }
                            }
                        }.bind(this),
                        error: function (xhr, status, err) {
                            console.error(this.props.url, status, 'jquery ' + err.toString());
                        }.bind(this)
                    });
                }
                else{
                    this.setState({error: 'Вы должны согласиться с правилами'});
                }
            }
            else {
                this.setState({error: 'Некорректные данные'});
            }
        }
        else {
            this.setState({reg: true, error: ''});
        }
    },
    handleNoReg: function () {
        this.setState({reg: false, error: ''});
    },
    handleValidateName: function () {
        var Obj = this.state.valid;
        Obj.login = !!this.state.input.login && this.state.input.login.length > 5 &&
            this.state.input.login.replace(/[^A-Za-z0-9\_\-]/g, '') == this.state.input.login;
        this.setState({valid: Obj});
        return Obj.login;
    },
    handleValidatePass: function () {
        var Obj = this.state.valid;
        Obj.pass = !!this.state.input.pass && this.state.input.pass.length > 7 &&
            this.state.input.pass.replace(/[^A-Za-z0-9]/g, '') == this.state.input.pass;
        this.setState({valid: Obj});
        return Obj.pass;
    },
    handleValidatePass2: function () {
        var Obj = this.state.valid;
        Obj.pass2 = this.state.input.pass == this.state.input.pass2;
        this.setState({valid: Obj});
        return Obj.pass2;
    },
    handleValidateEmail: function () {
        var match = this.state.input.email && this.state.input.email.match(/@[^@]/ig);
        var Obj = this.state.valid;
        Obj.email = !!this.state.input.email && this.state.input.email.length > 3 && match != null && match.length == 1;
        this.setState({valid: Obj});
        return Obj.email
    },
    hendleCheck: function (){
        this.setState({ruleChecked: !this.state.ruleChecked});
    },
    componentDidUpdate: function (prevProps, prevState) {
        if (this.state.reg != prevState.reg ||
            this.state.style == "open" && this.state.style != prevState.style) {
            if (!this.state.input.login || !this.state.valid.login) {
                document.getElementById("login-form-login").focus();
            }
            else if (!this.state.input.pass || !this.state.valid.pass) {
                document.getElementById("login-form-password").focus();
            }
            else if (this.state.reg) {
                if (!this.state.input.pass2 || !this.state.valid.pass2) {
                    document.getElementById("login-form-password2").focus();
                }
                else if (!this.state.input.email || !this.state.valid.email) {
                    document.getElementById("login-form-email").focus();
                }
            }
        }
    },
    render: function () {
        var inner;
        if (this.state.reg) {
            inner =
                <div>
                    <div className="login-form-title">Регистрация</div>
                    <div className={"login-form-login wrapper " + (this.state.valid.login?'valid':'noValid')}>
                        <input type="text" id="login-form-login"
                               value={this.state.input.login}
                               onChange={this.handleChange.bind(this, 'login')}
                               onKeyUp={this.onKeyEnter}
                               onBlur={this.handleValidateName}
                        />
                    </div>
                    <div className={"login-form-password wrapper " + (this.state.valid.pass?'valid':'noValid')}>
                        <input type="password" id="login-form-password" value={this.state.input.pass}
                               onChange={this.handleChange.bind(this, 'pass')}
                               onKeyUp={this.onKeyEnter}
                               onBlur={this.handleValidatePass}
                        />
                    </div>
                    <div className={"login-form-password2 wrapper " + (this.state.valid.pass2?'valid':'noValid')}>
                        <input type="password" id="login-form-password2" autoComplete="off"
                               value={this.state.input.pass2||''}
                               onChange={this.handleChange.bind(this, 'pass2')}
                               onKeyUp={this.onKeyEnter}
                               onBlur={this.handleValidatePass2}
                        />
                    </div>
                    <div className={"login-form-email wrapper " + (this.state.valid.email?'valid':'noValid')}>
                        <input type="text" id="login-form-email" autoComplete="off"
                               value={this.state.input.email||''}
                               onChange={this.handleChange.bind(this, 'email')}
                               onKeyUp={this.onKeyEnter}
                               onBlur={this.handleValidateEmail}
                        />
                    </div>
                    <div className={"ruleChecker" + (this.state.ruleChecked?' checked':'')}
                         onClick={this.hendleCheck}>
                        Я ознакомлен и принимаю <Link className="ruleLink" to = "/info/rule" target="_blank">правила</Link>
                    </div>
                    <div className="error">
                        <div>{this.state.error}</div>
                    </div>
                    <div className="button left" onClick={this.handleNoReg}>Назад</div>
                    <div className="button" onClick={this.handleReg}>Регистрация</div>
                </div>
        }
        else {
            inner =
                <div>
                    <div className="login-form-title">Вход</div>
                    <div className={"login-form-login wrapper " + (this.state.valid.login?'valid':'noValid')}>
                        <input type="text" id="login-form-login"
                               value={this.state.input.login}
                               onChange={this.handleChange.bind(this, 'login')}
                               onKeyUp={this.onKeyEnter}
                               onBlur={this.handleValidateName}
                        />
                    </div>
                    <div className={"login-form-password wrapper " + (this.state.valid.pass?'valid':'noValid')}>
                        <input type="password" id="login-form-password" value={this.state.input.pass}
                               onChange={this.handleChange.bind(this, 'pass')}
                               onKeyUp={this.onKeyEnter}
                               onBlur={this.handleValidatePass}
                        />
                    </div>
                    <div className="error">
                        <div>{this.state.error}</div>
                    </div>
                    <div className="button left" onClick={this.handleReg}>Регистрация</div>
                    <div className="button" onClick={this.handleLogin}>Войти</div>
                </div>
        }

        var avatar;
        if (this.props.loginState) {
            avatar = <div style={{backgroundImage: 'url("css/img/' + this.props.avatarUrl + '")'}}></div>
        }

        return (
            <div>
                <div id="login-btn" className={this.props.loginState?'out':'in'} onClick={this.handleClick}>
                    {this.props.loginState ? 'Выйти' : 'Войти'}{avatar}
                </div>
                <div id="login-panel" className={this.state.style} onClick={this.handleClick}>
                    <div className={"login-form" + (this.state.reg?' reg':'')}>
                        <div className="close-btn" onClick={this.handleClick}>X</div>
                        {inner}
                    </div>
                </div>
            </div>
        );
    }
});