export const movies = [
  {
    id: 0,
    name: "Star Wars",
    score: 1,
  },
  {
    id: 1,
    name: "Logan",
    score: 5,
  },
  {
    id: 2,
    name: "LaLa Land",
    score: 10,
  },
];

export const getMovies = () => movies;

export const getById = (id) => {
  const filteredMovies = movies.filter((movie) => movie.id === id);
  return filteredMovies[0];
};

export const deleteMovie = (id) => {
  const cleanedMovies = movies.filter((movie) => movie.id !== id);
  if (movies.length > cleanedMovies.length) {
    return true;
  } else {
    return false;
  }
};

export const addMovie = (name, score) => {
  movie.push({
    id: movies.length,
    name,
    score,
  });
};
