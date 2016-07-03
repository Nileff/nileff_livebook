/**
 * Created by Alender on 08.02.2016.
 */

import React from "react"
import { Link } from "react-router"
import Rating from "./../../main/rating"

export default React.createClass({
    render: function () {
        var genre = this.props.book.genre.map(function (item) {
            return <Link activeClassName='active' key={item.id} to={'/library/genre/' + item.id}>{item.text}</Link>;
        });

        var co_author;
        var co_author_arr = this.props.book.co_author;
        var author_id = this.props.book.author.id;
        for(var i in co_author_arr){
            if(co_author_arr[i].id == author_id){
                co_author_arr.splice(i, 1);
                break;
            }
        }
        if (co_author_arr.length > 1) {
            co_author = co_author_arr.map(function (item) {
                return <Link activeClassName='active' key={item.id} to={'/library/author/' + item.id}>
                    {item.name}
                </Link>;
            });
            co_author = <div>{co_author_arr.length}<div>{co_author}</div></div>;
        }
        else {
            if (co_author_arr.length == 0)
                co_author = 0;
            else
                co_author =
                    <Link activeClassName='active'
                          key={co_author_arr[0].id}
                          to={'/library/author/' + co_author_arr[0].id}>
                        {co_author_arr[0].name}
                    </Link>;
        }

        return (
            <div className="book-conteiner">
                <div className="book-item">
                    <div className="name">
                        <Link activeClassName='active' to={'/book/' + this.props.book.id}>
                            {this.props.book.name}
                        </Link>
                    </div>
                    <div className="genre">{genre}</div>
                    <div className="author">
                        <Link activeClassName='active'
                              key={this.props.book.author.id}
                              to={'/library/author/' + this.props.book.author.id}>
                            {this.props.book.author.name}
                        </Link>
                    </div>
                    <div className="co-author">{co_author}</div>
                    <div className="max-level">{this.props.book.max_level}</div>
                    <div className="description">
                        <p>{this.props.book.text}</p>
                    </div>
                    <Rating>{this.props.book.rating}</Rating>
                    <div className="dates">
                        <div className="public">{this.props.book.publicDate}</div>
                        <div className="update">{this.props.book.updateDate}</div>
                    </div>
                    <Link activeClassName='active' to={'/book/' + this.props.book.id}>
                        <div className="button">Читать</div>
                    </Link>
                </div>
            </div>
        );
    }
});