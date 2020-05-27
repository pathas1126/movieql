import axios from "axios";
const BASE_URL = "https://yts.am/api/v2/";
const MOVIES_LIST_URL = `${BASE_URL}list_movies.json`;
const MOVIE_DETAIL_URL = `${BASE_URL}movie_details.json`;
const MOVIE_SUGGESTIONS = `${BASE_URL}movie_suggestions.json`;

export const getMovies = async (limit, rating) => {
  const {
    data: {
      data: { movies },
    },
  } = await axios(MOVIES_LIST_URL, {
    params: {
      limit,
      rating,
    },
  });
  return movies;
};

export const getMovie = async (id) => {
  const {
    data: {
      data: { movie },
    },
  } = await axios(MOVIE_DETAIL_URL, {
    params: {
      movie_id: id,
    },
  });
  return movie;
};

export const getSuggestions = async (id) => {
  const {
    data: {
      data: { movies, movie_count },
    },
  } = await axios(MOVIE_SUGGESTIONS, {
    params: {
      movie_id: id,
    },
  });
  return { movie_count, movies };
};
