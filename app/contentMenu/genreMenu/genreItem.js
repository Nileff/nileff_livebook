/**
 * Created by Alender on 08.02.2016.
 */

import React from "react"
import { Link } from "react-router"

export default React.createClass({
    render: function () {
        return (
            <div className="genre-conteiner">
                <Link className="genre-item" activeClassName='active' to={'/library/genre/' + this.props.genre.id}>
                    <div className="genre-icon-wraper">
                        <div className={"icon-" + this.props.genre.name}></div>
                    </div>
                    <div className="name">
                        <div>{this.props.genre.text}</div>
                    </div>
                    <div className="book-count">{this.props.genre.book_count}</div>
                    <div className="button">Просмотр</div>
                </Link>
            </div>
        );
    }
});