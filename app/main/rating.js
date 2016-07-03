/**
 * Created by Alender on 08.02.2016.
 */

import React from "react"

export default React.createClass({
    getDefaultProps: function() {
        return {
            handlerClick: function() {}
        };
    },

    render: function() {
        var handlerClick = this.props.handlerClick;

        var starRatingArr = [0,1,2,3,4];
        var starRatingRound = Math.round(this.props.children);
        var starRating = starRatingArr.map(function(item){
            if(item < starRatingRound)
                return (<div key={item} className="star fill"></div>);
            else
                return (<div key={item} className="star"></div>);
        });

        return (
            <div className="rating">
                <div className="starRating" data-tooltip={Math.round(this.props.children * 100) / 100} onClick={handlerClick}>
                    {starRating}
                </div>
            </div>
        );
    }
});