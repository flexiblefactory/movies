import React, { Component } from 'react';
import { observer } from "mobx-react";

@observer
export class GenreList extends Component {
  render() {
    const { api } = this.props;
    return (

      <div className="genrelist">
        {
          api.availableGenres.map(genre => {

            const numMoviesInGenre = api.nowPlayingByGenres.get(genre.id).length;

            return (
              <div className="genre" key={genre.id}>
                <input
                    id={`genre${genre.id}`}
                    name={`genre${genre.id}`}
                    type="checkbox"
                    value={api.selectedGenres.has(genre.id)}
                    onChange={() => {

                    if (api.selectedGenres.has(genre.id)) {
                      api.selectedGenres.delete(genre.id);
                    }
                    else {
                      api.selectedGenres.set(genre.id, true);
                    }
                  }}
                />
                <label htmlFor={`genre${genre.id}`}>
                  {genre.name}&nbsp;({numMoviesInGenre})
                </label>
              </div>
            );
          })}
        <div className="content">
          powered by <a href="https://www.themoviedb.org/documentation/api" target="tmdb">TMDB API</a>
        </div>
      </div>
    );
  }
}