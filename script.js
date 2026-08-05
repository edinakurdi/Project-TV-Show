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

window.onload = setup;
