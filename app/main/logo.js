/**
 * Created by Alender on 16.12.2015.
 */

import React from "react"
import { Link } from "react-router"

export default React.createClass({
    render: function() {
        return (
            <Link  id="logo-panel" activeClassName="active" to = "/home">
                <div id="logo-text">
                    Живая<br/>
                    Книга
                </div>
            </Link>
        );
    }
});