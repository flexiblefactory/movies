import React, { Component } from 'react';
import logo from './logo.svg';

//components
import Emoji from './Emoji';

//styles
import './App.scss';
import './App.less';
import './App.styl';

import { observer } from "mobx-react";
import { Movie } from './Movie';
import { GenreList } from './GenreList';
import { RatingSlider } from './RatingSlider';

@observer
class App extends Component {

  renderStatus() {

    const { api } = this.props;

    return (
      <div className="App-subtitle">
        <div>
          region: {api.region}&nbsp;
        | {api.nowPlayingByGenres.size} genres
        | {api.selectedGenres.size}  selected genres
        | {api.moviesInSelectedGenres.length}  movies in all {api.selectedGenres.size > 0 ? api.selectedGenres.size + ' selected' : ''} genres
        | {api.moviesByMinimumRating.length}  movies with rating at least {api.minimumRating}&nbsp;
        | {api.selectedMovies.length} results with rating at least {api.minimumRating} and in all selected genres
          {api.isLoaded ? '' : ` | Loading page ${api.page} of ${api.totalPages} - API is rate limited`}
        </div>
      </div>
    );
  }

  renderHeader() {

    return (
      <div className="header">
        <img src={logo} className="App-logo" alt="logo" />
        <h2 className="App-title">
          <Emoji label="danger" emoji="☢" />
          <span> WhatMoviesApp </span>
          <Emoji label="danger" emoji="☢" />
        </h2>
        <div className="App-subtitle">

          Find now-playing movies by rating and genre!

          </div>
      </div>
    );
  }

  renderMovies() {

    const { api } = this.props;

    return (
      <div className="movies">
        {
          api.selectedMovies.map(movie => {

            return <Movie key={`movie${movie.id}`} api={api} movie={movie} />;

          })
        }
      </div>
    );
  }

  render() {

    const api = this.props.api;

    return (

      <div className="App">

        {this.renderHeader()}

        {this.renderStatus()}

        <RatingSlider api={api} />

        <GenreList api={api} />

        {this.renderMovies()}

      </div>
    );
  }
}
export default App;
