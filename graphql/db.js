import axios from "axios";
const BASE_URL = "https://yts.am/api/v2/";
const MOVIES_LIST_URL = `${BASE_URL}list_movies.json`;
const MOVIE_DETAIL_URL = `${BASE_URL}movie_details.json`;
const MOVIE_SUGGESTIONS = `${BASE_URL}movie_suggestions.json`;

export const getMovies = async (limit, sort) => {
  const {
    data: {
      data: { movies },
    },
  } = await axios(MOVIES_LIST_URL, {
    params: {
      limit,
      sort_by: sort,
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
      data: { movies },
    },
  } = await axios(MOVIE_SUGGESTIONS, {
    params: {
      movie_id: id,
    },
  });
  return movies;
};
