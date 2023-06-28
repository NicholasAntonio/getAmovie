document
  .getElementById("quizForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const genre = document.querySelector('input[name="genre"]:checked').value;

    getGenreId(genre);
  });

const API_KEY = "ee3ceb67888a044d82ec977c50e4c7f5";

function getGenreId(genre) {
  const genreUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`;

  fetch(genreUrl)
    .then((response) => response.json())
    .then((data) => {
      const genreId = getGenreIdFromList(data.genres, genre);
      if (genreId) {
        getMovie(genreId);
      }
    });
}

function getGenreIdFromList(genres, genre) {
  const selectedGenre = genres.find(
    (g) => g.name.toLowerCase() === genre.toLowerCase()
  );
  return selectedGenre ? selectedGenre.id : null;
}

function getMovie(genreId) {
  const apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreId}`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      if (data.results && data.results.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.results.length);
        const movie = data.results[randomIndex];
        display(movie);
      } else {
        displayError("Nenhum filme encontrado para esse gênero.");
      }
    })
    .catch((error) => {
      console.error("Erro ao obter filme:", error);
      displayError(
        "Ocorreu um erro ao obter o filme. Por favor, tente novamente mais tarde!"
      );
    });
}
function display(movie) {
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = `
  <div class="loading"></div>
`;

  const movieInfo = `
  <h3>Esse filme pode ser do seu agrado:</h3>
  <p>${movie.title}</p>
  <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="${movie.title}">
`;

  setTimeout(() => {
    resultDiv.innerHTML = movieInfo;
  }, 1000);
}

function displayError(message) {
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = `
      <p class="error">${message}</p>
  `;
}
