import { observable, computed } from 'mobx';
import { intersection } from 'lodash';

/**
 * Fetches and provides data from TMDB api
 */

//allow fetch to operate inside test environment

import fetch from 'isomorphic-fetch';
import { configUri, genreListUri, nowPlayingMoviesUri } from './config';
import { delay } from './delay';

async function getData(uri) {
    const response = await fetch(uri);
    return response.json();
}

async function fetchGenres() {
    const data = await getData(genreListUri);
    return data.genres;
}

async function getNowPlayingMovies(page, region) {

    const uri = nowPlayingMoviesUri + `&page=${page}&region=${region}`;
    return getData(uri);
}

//API is rate limited to 40 requests per 10 seconds

const RATE_LIMIT_GAP = (10000 / 40) + 5;

export class MoviesApi {

    @observable nowPlaying = [];
    @observable genres = [];
    @observable selectedGenres = new Map();
    @observable minimumRating = 3;
    @observable page = 0;
    @observable totalPages;
    @observable region = 'GB';

    constructor() {
        this.loadData();
    }

    async loadData() {
        //get config for images
        this.config = await getData(configUri);
        this.genres = await fetchGenres();
        this.getAllNowPlayingMovies();
    }

    async getAllNowPlayingMovies() {

        let finished = false;

        //mock window.performance to allow running in test environment

        if (!("performance" in window)) {
            window.performance = { now: () => 0 };
        }

        //load all pages of the now playing movie data for the region

        while (!finished) { //-  to load all pages - use this line instead of the line below
        //while (!finished && this.page<1 ) { //spec says "The input API's should only be called once."

            const t0 = performance.now();
            const data = await getNowPlayingMovies(++this.page, this.region);
            this.totalPages = data.total_pages;
            this.nowPlaying = this.nowPlaying.concat(data.results);
            finished = data.page === data.total_pages;
            const t1 = performance.now();
            const timeSinceLastApiRequest = t1 - t0;
            const delayDuration = Math.max(0, RATE_LIMIT_GAP - timeSinceLastApiRequest);

            //respect 4 request/sec rate-limit

            if (delayDuration > 0) await delay(delayDuration);
        }
        this.page = this.totalPages;
    }

    imagePathForMovie(movie) {
        return `${this.config.images.base_url}${this.config.images.poster_sizes[2]}${movie.poster_path}`;
    }

    @computed get isLoaded() {
        return this.page === this.totalPages;
    }

    @computed get nowPlayingByGenres() {
        //a map of all genre ids and the movies in those genres
        return this.nowPlaying.reduce((map, movie) => {
            movie.genre_ids.reduce((map, genreId) => {
                if (map.has(genreId)) {
                    map.get(genreId).push(movie);
                }
                else {
                    map.set(genreId, [movie]);
                }
                return map;
            }, map);
            return map;
        }, observable.map());
    }

    @computed get availableGenreIds() {
        //all the genre ids that are in the unfiltered set of movies
        return this.nowPlayingByGenres.keys();
    }
    @computed get genresById() {
        //a lookup of genre by id
        return this.genres.reduce((genres, genre) => {
            genres[genre.id] = genre;
            return genres;
        }, {});
    }

    @computed get availableGenres() {
        //all the genres that are in the unfiltered set of movies
        return Array.from(this.availableGenreIds)
            .map(genreId => this.genresById[genreId])
            .sort((a,b)=>{
                return a.name.localeCompare(b.name);
            });
    }

    @computed get nowPlayingBySelectedGenres() {
        //a map of *selected* genre ids, to look up the movies which are in those genres
        return Array.from(this.nowPlayingByGenres.keys())
            .filter(genreId => this.selectedGenres.has(genreId))
            .reduce((map, genreId) => {
                map.set(genreId, this.nowPlayingByGenres.get(genreId));
                return map;
            }, observable.map());
    }

    @computed get moviesInSelectedGenres() {
        //all the movies that are in all the genres that are selected
        //we intersect with the entire set here to return all results when no genres are selected
        return intersection.apply(null, [this.nowPlaying, ...Array.from(this.nowPlayingBySelectedGenres.values())]);
    }

    @computed get moviesByMinimumRating() {
        //movies filtered by min rating
        return this.nowPlaying.filter(movie => movie.vote_average >= this.minimumRating);
    }

    @computed get selectedMovies() {
        //the final result set, sorted by poularity, which is rendered
        return intersection(this.moviesInSelectedGenres, this.moviesByMinimumRating)
            .sort((a, b) => {
                return b.popularity - a.popularity;
            });
    }

}