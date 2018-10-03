const apiKey = '<API_KEY_HERE>';
if(apiKey === '<API_KEY_HERE>'){
    throw new Error("Please edit src/config.js to add your TMDB API key. See readme.md.")
}
const apiRoot = 'https://api.themoviedb.org/3';
export const genreListUri = `${apiRoot}/genre/list?api_key=${apiKey}&language=en-US`;
export const nowPlayingMoviesUri = `${apiRoot}/movie/now_playing?api_key=${apiKey}&language=en-GB`;
export const configUri = `${apiRoot}/configuration?api_key=${apiKey}`;