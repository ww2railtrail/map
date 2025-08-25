import L from 'leaflet';
import 'leaflet.awesome-markers';
import 'leaflet.legend';
import './index.css'
import trailNorthGeoJSON from './data/trail-north.json';
import trailUnpavedGeoJSON from './data/trail-unpaved.json';
import trailSouthGeoJSON from './data/trail-south.json';
import fruitStreetHTML from './popups/parking-fruit-street.html';
import winthropDahlHTML from './popups/parking-winthrop-dahl.html';
import cobbStreetHTML from './popups/parking-cobb-street.html';
import johnsonWoodsHTML from './popups/parking-johnson-woods.html';
import briggsStreetHTML from './popups/parking-briggs-street.html';
import craneStreetHTML from './popups/parking-crane-street.html';


const map = L.map('map').setView([41.99, -71.1869], 13);
const cyclOSM = L.tileLayer('https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '<a href="https://github.com/cyclosm/cyclosm-cartocss-style/releases" title="CyclOSM - Open Bicycle render">CyclOSM</a> | Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap'
}).addTo(map);


const trailNorth = L.geoJSON(trailNorthGeoJSON, {
    style: {
        color: "blue",
        weight: 4
    }
}).addTo(map);

const trailUnpaved = L.geoJSON(trailUnpavedGeoJSON, {
    style: {
        color: "blue",
        weight: 4,
        dashArray: [5, 5],
        dashOffset: 0
    }
}).addTo(map);

const trailSouth = L.geoJSON(trailSouthGeoJSON, {
    style: {
        color: "blue",
        weight: 4
    }
}).addTo(map);

const trailLines = L.featureGroup([trailNorth, trailUnpaved, trailSouth]);


const parkingIcon = L.divIcon({
    className: 'awesome-marker awesome-marker-icon-blue',
    html: '<img class="am-glyph" src="dist/icons/maki/parking.svg" alt="" width="20" height="20" />',
    iconSize: [35, 45],
    iconAnchor: [17, 42],
    popupAnchor: [1, -32]
});

const trailheadIcon = L.divIcon({
    className: 'awesome-marker awesome-marker-icon-green',
    html: '<img class="am-glyph" src="dist/icons/maki/park-alt1.svg" alt="" width="20" height="20" />',
    iconSize: [35, 45],
    iconAnchor: [17, 42],
    popupAnchor: [1, -32]
});

const popupOptions = {
    minWidth: window.innerWidth <= 768 ? 250 : 500,
    autoPan: true,
};

var fruitStreetLots = L.marker([42.006075, -71.196867], { icon: parkingIcon })
    .bindPopup(fruitStreetHTML, popupOptions);
var winthropDahlLot = L.marker([41.9961650796283,-71.18548393249513], { icon: parkingIcon })
    .bindPopup(winthropDahlHTML, popupOptions);
var cobbStreetLot = L.marker([41.992506, -71.184250], { icon: parkingIcon })
    .bindPopup(cobbStreetHTML, popupOptions);
var johnsonWoodsLot = L.marker([41.98630700333649,-71.17862820625307], { icon: parkingIcon })
    .bindPopup(johnsonWoodsHTML, popupOptions);
var briggsStreetLot = L.marker([41.962338235815146,-71.15673065185548], { icon: parkingIcon })
    .bindPopup(briggsStreetHTML, popupOptions);
var craneStreetLot = L.marker([41.95195370728311, -71.14685576641179], { icon: parkingIcon })
    .bindPopup(craneStreetHTML, popupOptions);

var parkingLots = L.layerGroup([fruitStreetLots, winthropDahlLot, cobbStreetLot, johnsonWoodsLot, briggsStreetLot, craneStreetLot])
    .addTo(map);

var henrichJohnsonWoods = L.marker([41.987136376558574,-71.18112802505495], { icon: trailheadIcon })
    .bindPopup('<h2>Henrich-Johnson Woods</h2>Owned by LPS, this conservation land includes several trails');

var conservationLand = L.layerGroup([henrichJohnsonWoods]).addTo(map);


L.control.Legend({
    position: "bottomleft",
    legends: [{
        label: "Paved",
        type: "polyline",
        color: "blue",
        weight: 4,
        opacity: 1.0,
    }, {
        label: "Unpaved",
        type: "polyline",
        color: "blue",
        weight: 4,
        opacity: 1.0,
        dashArray: [5, 5],
        dashOffset: 0
    },{
        label: "Parking",
        type: "image",
        url: "dist/icons/maki/parking.svg",
    },{
        label: "Adjacent Trail Systems",
        type: "image",
        url: "dist/icons/maki/park-alt1.svg",
    }]
}).addTo(map);


// Tiles and overlay selection control.
var tiles = {
    "OSM": osm,
    "CyclOSM": cyclOSM,
};
var overlays = {
    "Parking": parkingLots,
    "Trail Systems": conservationLand
};
var layerControl = L.control.layers(tiles, overlays).addTo(map);

// Hide the custom trail route when CyclOSM is selected because it has it brightly marked already.
map.on('baselayerchange', (e) => {
    if (e.name === "CyclOSM" && map.hasLayer(trailNorth)) {
        map.removeLayer(trailNorth);
        map.removeLayer(trailUnpaved);
        map.removeLayer(trailSouth);
    } else {
        map.addLayer(trailNorth);
        map.addLayer(trailUnpaved);
        map.addLayer(trailSouth);
    }
});

map.fitBounds(trailLines.getBounds());


// DEBUG: Print click coordinate
map.on('click', function(e) {
    var lat = e.latlng.lat;
    var lng = e.latlng.lng;
    console.log("[" + lat + "," + lng + "]");
});