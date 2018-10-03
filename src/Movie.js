import React, { Component } from 'react';
import { observer } from "mobx-react";

@observer
export class Movie extends Component {
    render() {
        const { movie, api } = this.props;
        return (
            <div className="movie">
                {
                    movie.poster_path && 
                    <img
                        title={movie.overview}
                        alt={movie.title}
                        src={api.imagePathForMovie(movie)}
                        width="185"
                    />
                }
               
                <div className="info">

                    <h4>{movie.title}</h4>
                    <div>
                        popularity: {movie.popularity}<br />
                        rating: {movie.vote_average}<br />
                    </div>
                    <ul>
                        {
                            movie.genre_ids
                                .map(genreId => <li key={genreId}>{api.genresById[genreId].name}</li>)
                        }
                    </ul>

                </div>
            </div>
        );
    }
}