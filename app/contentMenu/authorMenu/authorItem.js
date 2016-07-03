/**
 * Created by Alender on 08.02.2016.
 */

import React from "react"
import { Link } from "react-router"
import Rating from "./../../main/rating"

export default React.createClass({
    render: function () {
        return (
            <div className="author-conteiner">
                <Link className="author-item"
                      activeClassName='active'
                      to={'/library/author/' + this.props.author.id}>
                    <div className="avatar">
                        <div style={{backgroundImage: 'url("css/img/' + this.props.author.avatarUrl + '")'}}></div>
                    </div>
                    <div className="name">
                        <div>{this.props.author.name}</div>
                    </div>
                    <Rating>
                        {this.props.author.rating}
                    </Rating>
                    <div className="author-count">
                        <div className="author-book-count">
                            {this.props.author.book_count}
                        </div>
                        <div className="author-chapter-count">
                            {this.props.author.chapter_count}
                        </div>
                    </div>
                    <div className="button">Подробнее</div>
                </Link>
            </div>
        );
    }
});