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
let restaurants = [];


/********************************
**** STARTUP / ON LOADING IN ****
********************************/
/**
 * Creates the map on load in
 */
document.addEventListener("DOMContentLoaded", () => {
    initializeMap();
    loadLocationsIntoCache();
});

function initializeMap() {
    // Add rate limited tile layer (OpenStreetMap)
    L.tileLayer("https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=" + apiKey, {
        attribution: "© MapTiler © OpenStreetMap contributors"
    }).addTo(map);

    // Add free tile layer
    // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //   attribution: '&copy; OpenStreetMap contributors',
    //   maxZoom: 19,
    // }).addTo(map);

    
}

function applyMarkerColor(marker, cuisineType, visited, rating) {
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
    console.log(visited + " // " + rating + " // " + colorClass);
    marker._icon.classList.add(colorClass);
}

function addMarker(name, lat, long, cuisineType, visited, rating, notes) {
    let newMarker = L.marker([lat, long], {icon: newIcon}).addTo(map)
        .bindPopup(`<strong>${name}</strong><br>${cuisineType}<br>${notes}`);
    applyMarkerColor(newMarker, cuisineType, visited, rating);
}

function addRow(name, cuisineType, visited, notes) {
    let table = document.getElementById("sidebar-table");
    let newRow = table.insertRow(-1);
    newRow.insertCell().innerHTML = name;
    newRow.insertCell().innerHTML = cuisineType;
    newRow.insertCell().innerHTML = visited;
    newRow.insertCell().innerHTML = notes;
}

function loadLocationsIntoCache() {
    // Read all restaurants from CSV, then insert into map/table
    let filename = "csv/locations.csv";
    d3.csv(filename).then(async function(data) {
        data.forEach(row => {           
            restaurants.push(row);
            addMarker(row["name"],
                row["gps"].split(",")[0],
                row["gps"].split(",")[1],
                row["type"],
                row["visited"],
                row["rating"],
                row["notes"]);
            addRow(row["name"], row["type"], row["visited"], row["notes"])
        })
    });
}

