import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { MoviesApi } from './api';

ReactDOM.render(<App api={new MoviesApi()} />, document.getElementById('root'));

registerServiceWorker();

