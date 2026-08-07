let allEpisodes = [];

function setup() {
  allEpisodes = getAllEpisodes();

  // console.log(allEpisodes);
  // console.log(allEpisodes[0]);

  makePageForEpisodes(allEpisodes);
}
//create episode codes
function makeEpisodeCode(season, episodeNumber) {
  season = String(season).padStart(2, "0");
  episodeNumber = String(episodeNumber).padStart(2, "0");
  const code = "S" + season + "E" + episodeNumber;
  return code;
}

// console.log(makeEpisodeCode(2, 7)); // expected: S02E07
// console.log(makeEpisodeCode(10, 3)); // expected: S10E03

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

// create all cards
function makePageForEpisodes(episodeList) {
  const cardContainer = document.getElementById("card-container");
  const episodeCards = episodeList.map(createEpisodeCard);
  cardContainer.append(...episodeCards);
}

window.onload = setup;
