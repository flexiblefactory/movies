import { when } from 'mobx';
import { MoviesApi } from './api';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;

const api = new MoviesApi();

function testMovieInResults(genreId, movieId, minimumRating, expectedCount) {
  api.minimumRating = minimumRating;
  api.selectedGenres.set(genreId, true);
  expect(api.selectedMovies.filter(m => m.id === movieId).length)
    .toEqual(expectedCount);
  api.selectedGenres.delete(genreId);
}

function testMovieInGenre(genreId, movieId, expectedCount) {
  api.selectedGenres.set(genreId, true);
  expect(api.moviesInSelectedGenres.filter(m => m.id === movieId).length)
    .toEqual(expectedCount);
  api.selectedGenres.delete(genreId);
}

function testMovieInRating(movieId, minimumRating, expectedCount) {
  api.minimumRating = minimumRating;
  expect(api.moviesByMinimumRating
    .filter(m => m.id === movieId).length)
    .toEqual(expectedCount);
}

it('fetches expected movies for a selected genre', async () => {
  await when(() => api.isLoaded);
  console.log('api loaded: ' + api.isLoaded);

  expect(api.isLoaded).toEqual(true);

  //We would expect to see movie id 493922 in genre id 53
  //testMovieInGenre(53, 493922, 1);

  //We would expect to see movie id 493922 in genre id 22
  //testMovieInGenre(22, 493922, 1);

  //We would expect to see movie id:443463 in genre id 18
  //testMovieInGenre(18, 443463, 1);

  //We would not expect to see movie id:443463 in genre id 80
  testMovieInGenre(80, 443463, 0);

});

it('fetches expected movies for a minimum rating', async () => {

  await when(() => api.isLoaded);

  //We would expect to see  movie id 463272 in ratings over 6.
  //testMovieInRating(463272, 6, 1);

  //We would not expect to see  movie id 346910 in ratings over 6.
  testMovieInRating(346910, 6, 0);

  //We would not expect to see  movie id 493922 in ratings over 7
  testMovieInRating(493922, 7, 0);

});


it('fetches expected movies for a minimum rating and a selected genre', async () => {

  await when(() => api.isLoaded);

  //If genre id 53 was chosen, with a vote_average over 7, we would expect to see movie id 489999
  testMovieInResults(53, 489999, 7, 1);

  //If we chose genre 53 with  a vote_average over 8, we would not expect to see movie id 489999
  testMovieInResults(53, 489999, 8, 0);

  //If we chose genre 18 with a vote_average over 6, we would not expect to see movie id 339103
  testMovieInResults(18, 339103, 6, 0);

  //if we chose genre 18 with a vote_average over 5, we would expect to see movie id 339103
  //testMovieInResults(18, 339103, 5, 1);

  //if we chose genre 14 with a vote_average over 5, we would expect to see movie id 507569
  //testMovieInResults(14, 507569, 5, 1);

  //if we chose genre 16 with a vote_average over 7, we would not expect to see movie id 507569
  testMovieInResults(16, 507569, 7, 0);

  //if we chose genre 35 with a vote_average over 7, we would not expect to see movie id 453272
  testMovieInResults(35, 453272, 7, 0);

});









