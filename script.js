// -----------------------------------------------------
// STATE
// -----------------------------------------------------
const state = {
  allShows: [],
  selectedShowId: "",
  allEpisodes: [],
  searchTerm: "",
  selectedEpisodeId: "all",
  cache: {},
};

// -----------------------------------------------------
// ENDPOINT
// -----------------------------------------------------
const showsEndpoint = "https://api.tvmaze.com/shows";

// -----------------------------------------------------
// DOM ELEMENTS
// -----------------------------------------------------
const showSelect = document.getElementById("show-select");
const searchInput = document.getElementById("search");
const episodeSelect = document.getElementById("episode-select");
const template = document.getElementById("episode-card");

// -----------------------------------------------------
// SETUP & FETCH WITH CACHE
// -----------------------------------------------------

// TODO: fetchWithCache is used to cache fetch requests so that we don't have to fetch the same data twice
async function fetchWithCache(url) {
  if (state.cache[url]) {
    return state.cache[url];
  }
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }
  const data = await response.json();
  state.cache[url] = data;
  return data;
}

async function fetchShows() {
  const shows = await fetchWithCache(showsEndpoint);
  // Sort shows alphabetically
  return shows.sort((a, b) =>
    // TODO: localeCompare is used to compare strings alphabetically, case-insensitive <-- remove this comment
    a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
  );
}

async function fetchEpisodesForShow(showId) {
  const url = `https://api.tvmaze.com/shows/${showId}/episodes`;
  return await fetchWithCache(url);
}

async function selectShow(showId) {
  state.selectedShowId = String(showId);
  showSelect.value = String(showId);

  // Reset search and episode dropdown state
  state.searchTerm = "";
  searchInput.value = "";
  state.selectedEpisodeId = "all";
  episodeSelect.value = "all";

  const cardContainer = document.getElementById("card-container");
  cardContainer.textContent = "Loading episodes...";

  try {
    state.allEpisodes = await fetchEpisodesForShow(showId);
    populateEpisodeSelect(state.allEpisodes);
    render();
  } catch (error) {
    cardContainer.textContent = "Error loading episodes";
  }
}

async function setup() {
  try {
    const cardContainer = document.getElementById("card-container");
    cardContainer.textContent = "Loading shows...";

    state.allShows = await fetchShows();
    populateShowSelect(state.allShows);

    if (state.allShows.length > 0) {
      await selectShow(state.allShows[0].id);
    }
  } catch (error) {
    const errorContainer = document.getElementById("card-container");
    errorContainer.textContent = "Error loading page";
  }
}

// -----------------------------------------------------
// SHOW & EPISODE DROPDOWNS
// -----------------------------------------------------

function populateShowSelect(shows) {
  const optionsHtml = shows
    .map((show) => `<option value="${show.id}">${show.name}</option>`)
    .join("");

  showSelect.innerHTML = optionsHtml;
}

function populateEpisodeSelect(episodes) {
  const optionsHtml = episodes
    .map((episode) => {
      const episodeCode = makeEpisodeCode(episode.season, episode.number);
      const optionText = `${episodeCode} - ${episode.name}`;
      return `<option value="${episode.id}">${optionText}</option>`;
    })
    .join("");

  episodeSelect.innerHTML =
    '<option value="all">Show all episodes</option>' + optionsHtml;
}

// -----------------------------------------------------
// FILTER & RENDER EPISODES
// -----------------------------------------------------

function render() {
  const searchTerm = state.searchTerm.toLowerCase();

  const filteredEpisodes = state.allEpisodes.filter((episode) => {
    if (
      state.selectedEpisodeId !== "all" &&
      String(episode.id) !== state.selectedEpisodeId
    ) {
      return false;
    }
    const episodeName = episode.name ? episode.name.toLowerCase() : "";
    const episodeSummary = episode.summary ? episode.summary.toLowerCase() : "";

    return (
      episodeName.includes(searchTerm) || episodeSummary.includes(searchTerm)
    );
  });
  makePageForEpisodes(filteredEpisodes);
}

// -----------------------------------------------------
// EPISODE CODE & CARD GENERATION
// -----------------------------------------------------

function makeEpisodeCode(season, episodeNumber) {
  season = String(season).padStart(2, "0");
  episodeNumber = String(episodeNumber).padStart(2, "0");
  return "S" + season + "E" + episodeNumber; // TODO: rather than creating a variable for code, we could just return the value from the padStart method. <-- remove this comment
}

function createEpisodeCard(episode) {
  const card = template.content.cloneNode(true);

  card.querySelector("h2").textContent = episode.name;

  const episodeNumber = makeEpisodeCode(episode.season, episode.number);
  card.querySelector("[data-episode-number]").textContent = episodeNumber;

  const image = card.querySelector("img");
  // TODO: checking if the image exists and has a medium size before displaying it <-- remove this comment
  if (episode.image && episode.image.medium) {
    image.src = episode.image.medium;
    image.alt = `Scene from ${episodeNumber}, ${episode.name}`;
  } else {
    image.src = "";
    image.alt = `No image available for ${episode.name}`;
  }

  card.querySelector("[data-summary]").innerHTML = episode.summary
    ? episode.summary.replace(/<p>/gi, "").replace(/<\/p>/gi, "")
    : "No summary available."; // TODO: Use optional chaining to check if the summary exists, or display "No summary available." <-- remove this comment

  return card;
}

// -----------------------------------------------------
// PAGE DISPLAY
// -----------------------------------------------------

function makePageForEpisodes(episodeList) {
  const cardContainer = document.getElementById("card-container");
  cardContainer.innerHTML = "";

  const episodeCards = episodeList.map(createEpisodeCard);
  cardContainer.append(...episodeCards);

  const countDisplay = document.getElementById("count-result");
  countDisplay.textContent = `${episodeList.length}/${state.allEpisodes.length}`;
}

// -----------------------------------------------------
// EVENT LISTENERS
// -----------------------------------------------------

showSelect.addEventListener("change", (event) => {
  const showId = event.target.value;
  if (showId) {
    selectShow(showId);
  }
});

searchInput.addEventListener("input", (event) => {
  state.searchTerm = event.target.value;

  state.selectedEpisodeId = "all";
  episodeSelect.value = "all";

  render();
});

episodeSelect.addEventListener("change", (event) => {
  state.selectedEpisodeId = event.target.value;

  state.searchTerm = "";
  searchInput.value = "";

  render();
});

// -----------------------------------------------------
// START APPLICATION
// -----------------------------------------------------
window.onload = setup;
