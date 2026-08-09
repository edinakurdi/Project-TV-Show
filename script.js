// -----------------------------------------------------
// STATE
// -----------------------------------------------------
const state = {
  allEpisodes: [],
  searchTerm: "",
  selectedEpisodeID: "all",
};

function setup() {
  state.allEpisodes = getAllEpisodes();
  populateEpisodeSelect(state.allEpisodes);
  render();
}

//create episode codes
function makeEpisodeCode(season, episodeNumber) {
  season = String(season).padStart(2, "0");
  episodeNumber = String(episodeNumber).padStart(2, "0");
  const code = "S" + season + "E" + episodeNumber;
  return code;
}

//create episode card
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

// create episode cards
function makePageForEpisodes(episodeList) {
  const cardContainer = document.getElementById("root");
  // clear existing cards displayed
  cardContainer.innerHTML = "";

  // create new cards from search result filtered list
  const episodeCards = episodeList.map(createEpisodeCard);
  cardContainer.append(...episodeCards);

  // update count of displayed episodes
  const countDisplay = document.getElementById("count-result");
  countDisplay.textContent = `${episodeList.length}/${allEpisodes.length}`;
}

// search and select elements
const searchInput = document.getElementById("search");
const episodeSelect = document.getElementById("episode-select");

// populate selector with option elements
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

// search functionality
searchInput.addEventListener("input", (event) => {
  const searchValue = event.target.value;

  // Reset selector dropdown to "Show all" when searching
  episodeSelect.value = "all";

  const filteredEpisodes = allEpisodes.filter((episode) => {
    return (
      episode.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      episode.summary.toLowerCase().includes(searchValue.toLowerCase())
    );
  });
  makePageForEpisodes(filteredEpisodes);
});

// episode selector change listener
episodeSelect.addEventListener("change", (event) => {
  const selectedValue = event.target.value;

  if (selectedValue === "all") {
    makePageForEpisodes(allEpisodes);
  } else {
    const selectedEpisode = allEpisodes.find(
      (episode) => String(episode.id) === selectedValue,
    );
    if (selectedEpisode) {
      // Clear search box to avoid conflicting filter state
      searchInput.value = "";
      makePageForEpisodes([selectedEpisode]);
    }
  }
});

window.onload = setup;
