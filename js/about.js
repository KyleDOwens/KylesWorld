/* 
 * In the 'about' page, I have a section for my most recent music obsession
 * However, I don't update my website often enough for that section to change frequently
 * So, I am adding a backlog of previous obsessions, and having the website slowly cycle between those
 * The list of obsessions is in the correct chronological order, with the first index being the oldest obsession, and the last being the most recent
 * This means the listed obsession will be behind by a few months, but that's okay with me (since I might delete that section entirely later)
*/

let lastObsessionUpdate = new Date(2026, 9-1, 1);
let obsessionCycle = [
    ["frou frou", "details", "./images/music/favorites/froufrou_details.jpg"],
    ["HYUKOH, 落日飛車 Sunset Rollercoaster", "AAA", "./images/music/2024/hyukoh_aaa.jpg"],
    ["circa survive", "juturna", "./images/music/favorites/circasurvive_juturna.jpg"],
    ["kate bollinger", "songs from a thousand frames of mind", "./images/music/2024/katebollinger_songsfromathousandframesofmind.jpg"],
    ["james ivy", "the seams", "./images/music/2026/jamesivy_theseams.jpg"],
];

function getObsession() {
    let now = new Date();
    let daysSinceLastUpdate = Math.floor((now - lastObsessionUpdate) / (1000 * 60 * 60 * 24)) + 1;
    let monthsSinceUpdate = (now.getFullYear() - lastObsessionUpdate.getFullYear()) * 12 + (now.getMonth() - lastObsessionUpdate.getMonth());

    let index = Math.max(Math.min(monthsSinceUpdate, obsessionCycle.length - 1), 0);
    console.log(`index = ${index}`);
    let artist = obsessionCycle[index][0];
    console.log(`artist = ${artist}`);
    let album = obsessionCycle[index][1];
    console.log(`album = ${album}`);
    let image = obsessionCycle[index][2];
    console.log(`image = ${image}`);

    let htmlString = ` \
        <u>${artist}</u> - <i>${album}</i> \
        <br> \
        <img style="width: 100px; height: 100px;" src="${image}"> \
    `;

    console.log(htmlString);
    document.getElementById("obsession").innerHTML = htmlString;
}

window.addEventListener("load", () => {
    getObsession();
});