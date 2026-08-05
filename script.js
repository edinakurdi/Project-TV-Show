//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();

  // console.log(allEpisodes);
  // console.log(allEpisodes[0]);

  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.textContent = `Got ${episodeList.length} episode(s)`;
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

  card.querySelector("[data-summary]").innerHTML = episode.summary;

  return card;
}

// create all cards
function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");

  const episodeCards = episodeList.map(createEpisodeCard);

  rootElem.append(...episodeCards);
}

window.onload = setup;
