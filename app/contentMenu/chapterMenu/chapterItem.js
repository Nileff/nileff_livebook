/**
 * Created by Alender on 08.02.2016.
 */

import React from "react"
import { Link } from "react-router"
import Rating from "./../../main/rating"

export default React.createClass({
    render: function () {
        return (
            <div className="book-conteiner">
                <Link activeClassName='active' to={'/book/' + this.props.book.id}
                      className="book-item chapter">
                    <div className="name">
                        <div>{this.props.book.name}</div>
                    </div>
                    <div className="chapter">
                        <div>{this.props.book.chapter_name}</div>
                    </div>
                    <div className="description"><p>{this.props.book.text}</p></div>
                    <Rating>{this.props.book.rating}</Rating>
                    <div className="public">{this.props.book.publicDate}</div>
                    <div>
                        <div className="button">Читать</div>
                    </div>
                </Link>
            </div>
        );
    }
});