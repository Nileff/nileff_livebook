import React from "react";

export default React.createClass({
    getInitialState: function () {
        return ({
            input: {
                oldPass: '',
                newPass: '',
                newPass2: ''
            },
            valid: {
                oldPass: true,
                newPass: true,
                newPass2: true
            }
        });
    },
    handleChange: function (name, e) {
        var input = Object.assign({}, this.state.input);
        var valid = Object.assign({}, this.state.valid);
        input[name] = e.target.value;
        valid[name] = true;
        this.setState({input: input, valid: valid});
    },
    onKeyEnter: function (e) {
        if (e.keyCode == 13) {
            this.handleChangePassword();
        }
    },
    handleValidatePass: function (name) {
        if (name == 'newPass' &&
            this.state.input['newPass2'] &&
            this.state.input['newPass2'].length > 0) {
            this.handleValidatePass2('newPass', 'newPass2');
        }
        var Obj = this.state.valid;
        Obj[name] = !!this.state.input[name] && this.state.input[name].length > 7 &&
            this.state.input[name].replace(/[^A-Za-z0-9]/g, '') == this.state.input[name];
        this.setState({valid: Obj});
        return Obj[name];
    },
    handleValidatePass2: function (name1, name2) {
        var Obj = this.state.valid;
        Obj[name2] = this.state.input[name1] == this.state.input[name2];
        this.setState({valid: Obj});
        return Obj[name2];
    },
    handleChangePassword: function () {
        if (this.handleValidatePass('oldPass') &
            this.handleValidatePass('newPass') &
            this.handleValidatePass2('newPass', 'newPass2')
        ) {
            var data = Object.assign({}, this.state.input);
            this.props.updateUserInfo(data);
            this.props.visibleChange();
            this.setState({
                input: {
                    oldPass: '',
                    newPass: '',
                    newPass2: ''
                },
                valid: {
                    oldPass: true,
                    newPass: true,
                    newPass2: true
                }
            });
        }
    },
    render () {
        return (
            <div className="modal-window">
                <div className="modal-body">
                    <div className="modal-header">
                        <div className="title">
                            Изменить пароль
                        </div>
                        <div className="close" onClick={this.props.visibleChange}>X</div>
                    </div>
                    <div className="modal-content">
                        <div className={"old-password wrapper " + (this.state.valid.oldPass?'valid':'noValid')}>
                            <input type="password" id="old-password" value={this.state.input.oldPass}
                                   autoComplete="off"
                                   onChange={this.handleChange.bind(this, 'oldPass')}
                                   onKeyUp={this.onKeyEnter}
                                   onBlur={this.handleValidatePass.bind(this, 'oldPass')}
                            />
                        </div>
                        <div className={"new-password wrapper " + (this.state.valid.newPass?'valid':'noValid')}>
                            <input type="password" id="new-password" value={this.state.input.newPass}
                                   autoComplete="off"
                                   onChange={this.handleChange.bind(this, 'newPass')}
                                   onKeyUp={this.onKeyEnter}
                                   onBlur={this.handleValidatePass.bind(this, 'newPass')}
                            />
                        </div>
                        <div className={"new-password2 wrapper " + (this.state.valid.newPass2?'valid':'noValid')}>
                            <input type="password" id="new-password2" value={this.state.input.newPass2}
                                   autoComplete="off"
                                   onChange={this.handleChange.bind(this, 'newPass2')}
                                   onKeyUp={this.onKeyEnter}
                                   onBlur={this.handleValidatePass2.bind(this, 'newPass', 'newPass2')}
                            />
                        </div>
                    </div>
                    <div className="modal-footer">
                        <div className="button" onClick={this.handleChangePassword}>Сохранить</div>
                    </div>
                </div>
            </div>
        );
    }
});