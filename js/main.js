import { apiKey } from "./config.js";

const SAT_TX_COORDS = [29.4246, -98.49514];

const map = L.map("map", {
    center: SAT_TX_COORDS,
    zoom: 11,
    zoomControl: true,
});

const newIcon = L.icon({
    iconUrl: "images/marker.png",
    iconSize: [24, 24],
    // iconAnchor: []
});

// Will be list of dictionaries with keys {name, type, visited, notes, gps, googleUrl, originalUrl}
let restaurants = {};

// Dictionary containing the map markers accessed by the restaurant name (name : markerObj)
let markers = {}

/********************************
**** STARTUP / ON LOADING IN ****
********************************/
/**
 * Creates and populates the map and table on load in
 */
document.addEventListener("DOMContentLoaded", () => {
    initializeMap();
    loadLocationsIntoCache();
});

/**
 * Adds a tile layer to the map
 */
function initializeMap() {
    // Add rate limited tile layer (OpenStreetMap)
    // L.tileLayer("https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=" + apiKey, {
    //     attribution: "© MapTiler © OpenStreetMap contributors"
    // }).addTo(map);

    // Add free tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    
}

/**
 * Adds CSS classes to the marker object corresponding to what color it should be (based off rating and visited)
 * @param {string} name The restaurant name
 * @param {string} visited Indication if the restaurant has been visited or not
 * @param {string} rating The restaurant rating, low/medium/high (indicates the priority if not visited)
 */
function applyMarkerColor(marker, visited, rating) {
    let colorClass = ""
    switch (rating) {
        case "high":
            colorClass = (visited) ? "visited-high" : "unvisited-high";
            break;
        case "medium":
            colorClass = (visited) ? "visited-medium" : "unvisited-medium";
            break;
        default:
            colorClass = (visited) ? "visited-low" : "unvisited-low";
            break;
    }
    marker._icon.classList.add(colorClass);
}

/**
 * Adds a new marker to the embedded map
 * @param {string} name The restaurant name
 * @param {string} lat The restaurant latitude
 * @param {string} long The restaurant longitude
 * @param {string} cuisineType The restaurant cuisine type
 * @param {string} visited Indication if the restaurant has been visited or not
 * @param {string} rating The restaurant rating, low/medium/high (indicates the priority if not visited)
 * @param {string} notes Notes about the restaurant
 * @param {string} originalUrl Google Maps URL to the restaurant
 */
function addMarker(name, lat, long, cuisineType, visited, rating, notes, originalUrl) {
    markers[normalizeName(name)] = L.marker([lat, long], {icon: newIcon}).addTo(map)
        .bindPopup(`<b>${name}</b><br>
            ${cuisineType}<br>
            <a href="${originalUrl}" target=_blank>View on Google</a><br>
            <i>${notes}</i>`);
    
    applyMarkerColor(markers[normalizeName(name)], visited, rating);
}

/**
 * Adds a new row to the HTML restaurant list table
 * @param {string} name The restaurant name
 * @param {string} cuisineType The restaurant cuisine type
 * @param {string} visited Indication if the restaurant has been visited or not
 */
function addRow(name, cuisineType, visited) {
    let table = document.getElementById("sidebar-table-body");
    let newRow = table.insertRow(-1);
    newRow.insertCell().innerHTML = name;
    newRow.insertCell().innerHTML = cuisineType;
    newRow.insertCell().innerHTML = visited;
    newRow.insertCell().innerHTML = "<input type=\"checkbox\" onclick=\"updateMarkerShown(this)\">";
}

/**
 * Loads the list of restaurant information in locations.csv into the local cache and updates table/map HTML contents with that info
 */
function loadLocationsIntoCache() {
    // Read all restaurants from CSV, then insert into map/table
    let filename = "csv/locations.csv";
    d3.csv(filename).then(async function(data) {
        data.forEach(row => {   
            // Add data to local cache        
            restaurants[normalizeName(row["name"])] = row;

            // Update map/table
            addMarker(row["name"],
                row["gps"].split(",")[0],
                row["gps"].split(",")[1],
                row["type"],
                row["visited"],
                row["rating"],
                row["notes"],
                row["originalUrl"]);
            addRow(row["name"], row["type"], row["visited"])
        })

        // Now that map/table are set up, read in state from URL (if possible)
        parseUrl();
    });
}

/********************************
**** FILTERING FUNCTIONALITY ****
********************************/
window.updateMarkerShown = function(checkbox) {
    let row = checkbox.closest("tr");
    let name = row.cells[0].innerText;
    let hide = checkbox.checked;

    // Check the checkbox in the "Hide?" column to see if the marker should be shown
    if (hide) {
        markers[normalizeName(name)]._icon.classList.add("hidden");
    }
    else if (markers[normalizeName(name)]._icon.classList.contains("hidden")) {
        markers[normalizeName(name)]._icon.classList.remove("hidden");
    }
}

function updateAllMarkersShown() {
    // For each restaurant, see if the marker needs to be shown/hidden
    let table = document.getElementById("sidebar-table-body");
    for (let row of table.rows) {
        // Check the checkbox in the "Hide?" column to see if the marker should be shown
        let name = row.cells[0].innerText;
        let hide = row.cells[row.cells.length - 1].children[0].checked;
        if (hide) {
            markers[normalizeName(name)]._icon.classList.add("hidden");
        }
        else if (markers[normalizeName(name)]._icon.classList.contains("hidden")) {
            markers[normalizeName(name)]._icon.classList.remove("hidden");
        }
    }
}

document.getElementById("dropdown-button").addEventListener("click", function() {
    
    // Change arrow direction of button
    let button = document.getElementById("dropdown-button");
    button.innerHTML = (button.innerHTML === "▼") ? "▲" : "▼";

    // Open/Close the dropdown menu
    // let dropdown = document.getElementById("filter-select");
    // dropdown.style.display = (dropdown.style.display === "block") ? "none" : "block";
});

function applyFilters(showAll) {
    // Get filter values
    let visitedFilter = document.getElementById("visited-filter").value.toLowerCase();
    let cuisineFilter = document.getElementById("cuisine-filter").value.toLowerCase();
    let ratingFilter = document.getElementById("rating-filter").value.toLowerCase();

    // Update state of map/table to match filter request
    let table = document.getElementById("sidebar-table-body");
    for (let row of table.rows) {
        // Get values of current restaurant
        let checkbox = row.cells[row.cells.length - 1].children[0];
        let name = row.cells[0].innerText;
        let visited = (row.cells[2].innerHTML === "") ? "unvisited" : "visited";
        let cuisineTypes = row.cells[1].innerText.toLowerCase().split(" / ");
        let rating = (restaurants[normalizeName(name)]["rating"]) ? restaurants[normalizeName(name)]["rating"] : "low";

        // Check if all filter criteria are met
        let passVisitedFilter = (visitedFilter === "any") || (visited === visitedFilter);
        let passCuisineFilter = (cuisineFilter === "any") || (cuisineTypes.includes(cuisineFilter));
        let passRatingFilter = (ratingFilter === "any") || (rating === ratingFilter);

        // Update if the marker is shown or not
        if (passVisitedFilter && passCuisineFilter && passRatingFilter) {
            checkbox.checked = (showAll) ? false : true;
        }
        else {
            checkbox.checked = (showAll) ? true : false;
        }

        updateMarkerShown(checkbox);
    }
}

document.getElementById("show-all-button").addEventListener("click", function() {
    applyFilters(true);
});

document.getElementById("hide-all-button").addEventListener("click", function() {
    applyFilters(false);
});

/**
 * Show visited
 * Hide visited
 * Show unvisited
 * Hide unvisited
 * 
 * ==>
 * only visited
 * only unvisited
 * 
 */


/**********************************
**** URL SHARING FUNCTIONALITY ****
**********************************/
/**
 * Normalizes the passed in restaurant name by removing all non-alphanumeric characters
 * @param {string} name The restaurant name to normalize
 * @returns String of the normalized alphanumeric name
 */
function normalizeName(name) {
    return name.replace(/[^a-zA-Z0-9]/g, '');
}

/**
 * Enumerates the names all shown restuarants into a single string
 * @returns String of all the normalized restaurant names currently being shown, delimited by ':'
 */
function enumerateShownRestaurants() {
    let enumeration = "";

    let table = document.getElementById("sidebar-table-body");
    for (let row of table.rows) {
        // Check the checkbox in the "Hide?" column to see if the marker should be shown
        let name = row.cells[0].innerText;
        let hide = row.cells[row.cells.length - 1].children[0].checked;
        if (!hide) {
            enumeration += (enumeration.length == 0) ? "" : ":";
            enumeration += normalizeName(name);
        }
    }

    return enumeration;
}

/**
 * Listener to handle when the button to create the sharable URL is clicked - will update the URL and copy sharable URL to clipboard
 */
document.getElementById("export-button").addEventListener("click", async function() {
    let selections = enumerateShownRestaurants();
    let newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + 
                 "?selections=" + selections;
    window.history.pushState({ path: newUrl }, '', newUrl);

    console.log(newUrl)

    await navigator.clipboard.writeText(newUrl);
    alert('Sharable URL copied to clipboard!');
});

/**
 * Parses the current URL and updates the map/table state to match the information in the URL (if applicable)
 */
function parseUrl() {
    let urlParams = new URLSearchParams(window.location.search);
    let selections = urlParams.get("selections");

    if (!selections) {
        return;
    }

    let table = document.getElementById("sidebar-table-body");
    for (let row of table.rows) {
        // Check the checkbox in the "Hide?" column to see if the marker should be shown
        let name = row.cells[0].innerText;
        if (selections.includes(normalizeName(name))) {
            row.cells[row.cells.length - 1].children[0].checked = false;
        }
        else {
            row.cells[row.cells.length - 1].children[0].checked = true;
        }
    }

    updateAllMarkersShown();
}