// -----------------------------------------------------
// STATE
// -----------------------------------------------------
const state = {
  allEpisodes: [],
  searchTerm: "",
  selectedEpisodeId: "all",
};

// -----------------------------------------------------
// ENDPOINT
// -----------------------------------------------------
const endpoint = "https://api.tvmaze.com/shows/82/episodes";

// -----------------------------------------------------
// SETUP
// -----------------------------------------------------

async function setup() {
  try {
    state.allEpisodes = await fetchEpisodes();
    populateEpisodeSelect(state.allEpisodes);
    render();
  } catch {
    const errorContainer = document.getElementById("card-container");
    errorContainer.textContent = "Error loading page";
  }
}

// -----------------------------------------------------
// FETCH EPISODES FROM API
// -----------------------------------------------------

const fetchEpisodes = async () => {
  const response = await fetch(endpoint);
  return await response.json();
};

// -----------------------------------------------------
// FILTER & RENDER EPISODES
// -----------------------------------------------------

function render() {
  //NORMALISE: make search case-insensitive
  const searchTerm = state.searchTerm.toLowerCase();

  //FILTER EPISODES: create array that has only episodes where either the episode name OR the summary contains the search term
  const filteredEpisodes = state.allEpisodes.filter((episode) => {
    // If an episode is selected in dropdown, check that it matches
    if (
      state.selectedEpisodeId !== "all" &&
      String(episode.id) !== state.selectedEpisodeId
    ) {
      return false;
    }
    const episodeName = episode.name.toLowerCase();
    const episodeSummary = episode.summary.toLowerCase();

    return (
      episodeName.includes(searchTerm) || episodeSummary.includes(searchTerm)
    );
  });
  makePageForEpisodes(filteredEpisodes);
}

// -----------------------------------------------------
// EPISODE CODE
// -----------------------------------------------------

function makeEpisodeCode(season, episodeNumber) {
  season = String(season).padStart(2, "0");
  episodeNumber = String(episodeNumber).padStart(2, "0");
  const code = "S" + season + "E" + episodeNumber;
  return code;
}

// -----------------------------------------------------
// CREATE EPISODE CARD
// -----------------------------------------------------

const template = document.getElementById("episode-card");

function createEpisodeCard(episode) {
  const card = template.content.cloneNode(true);

  card.querySelector("h2").textContent = episode.name;

  const episodeNumber = makeEpisodeCode(episode.season, episode.number);
  card.querySelector("[data-episode-number]").textContent = episodeNumber;

  const image = card.querySelector("img");
  image.src = episode.image.medium;
  image.alt = `Scene from ${episodeNumber}, ${episode.name}`;

  // remove the <p> tags from the summary
  card.querySelector("[data-summary]").innerHTML = episode.summary
    .replace(/<p>/gi, "")
    .replace(/<\/p>/gi, "");

  return card;
}

// -----------------------------------------------------
// PAGE DISPLAY
// -----------------------------------------------------

// create episode cards
function makePageForEpisodes(episodeList) {
  const cardContainer = document.getElementById("card-container");
  // clear existing cards displayed
  cardContainer.innerHTML = "";

  // create new cards from search result filtered list
  const episodeCards = episodeList.map(createEpisodeCard);
  cardContainer.append(...episodeCards);

  // update count of displayed episodes
  const countDisplay = document.getElementById("count-result");
  countDisplay.textContent = `${episodeList.length}/${state.allEpisodes.length}`;
}

// -----------------------------------------------------
// DOM ELEMENTS: SEARCH & SELECT
// -----------------------------------------------------

const searchInput = document.getElementById("search");
const episodeSelect = document.getElementById("episode-select");

// -----------------------------------------------------
// EPISODE DROPDOWN
// -----------------------------------------------------

// populate selector with option elements
function populateEpisodeSelect(episodes) {
  const optionsHtml = episodes
    .map((episode) => {
      const episodeCode = makeEpisodeCode(episode.season, episode.number);
      const optionText = `${episodeCode} - ${episode.name}`;
      return `<option value="${episode.id}">${optionText}</option>`;
    })
    .join("");

  //in the dropdown show "Show all" first, then add every generated episode option--> place oll in a dropdown
  episodeSelect.innerHTML =
    '<option value="all">Show all episodes</option>' + optionsHtml;
}

// -----------------------------------------------------
// EVENT LISTENERS
// -----------------------------------------------------
// Update the search state whenever the user types
searchInput.addEventListener("input", (event) => {
  state.searchTerm = event.target.value;

  // Reset selector dropdown to "Show all" when searching
  state.selectedEpisodeId = "all"; //updates the state
  episodeSelect.value = "all"; //updates visible dropdown

  render();
});

// Update the selected episode when the dropdown changes
episodeSelect.addEventListener("change", (event) => {
  state.selectedEpisodeId = event.target.value;

  // Clear both the stored and visible search value
  state.searchTerm = "";
  searchInput.value = "";

  render();
});

// -----------------------------------------------------
// START APPLICATION
// -----------------------------------------------------
window.onload = setup;
