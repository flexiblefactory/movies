import React, { Component } from 'react';
import { observer } from "mobx-react";

@observer
export class RatingSlider extends Component{
    
    render(){
        
        const { api } = this.props;

        return (
            <div className="content">
          <div>
            <label htmlFor="rating">Minimum rating: {api.minimumRating}</label>
          </div>
          <input type="range" id="rating" name="rating"
              min="0" max="10" value={api.minimumRating} step=".5"
              onChange={(event) => {
              api.minimumRating = event.target.value;
            }}
          />

        </div>
        );
    }
}