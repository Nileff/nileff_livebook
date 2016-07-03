/**
 * Created by Alender on 02.03.2016.
 */

import React from "react"
import {Link} from "react-router"
import Rating from "./../../main/rating"

export default React.createClass({
    render: function() {
        return (
            <div className="chapter-wrapper">
                <Link className="chapter-item" activeClassName='active' to={'/book/' + this.props.chapter.id}>
                    <div className="public">{this.props.chapter.public}</div>
                    <div className="name">
                        <div>{this.props.chapter.name}</div>
                    </div>
                    <div className="author" data-tooltip={this.props.chapter.author.rating}>
                        <div>
                            {this.props.chapter.author.name}
                            <br/>
                            {this.props.chapter.author.name2}
                        </div>
                    </div>
                    <Rating>{this.props.chapter.rating}</Rating>
                </Link>
            </div>
        );
    }
});