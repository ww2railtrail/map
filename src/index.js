import L from 'leaflet';
import 'leaflet.awesome-markers';
import 'leaflet.legend';
import './index.css'

import trailGeoJSON from './data/export.json';

import fruitStreetHTML from './popups/parking-fruit-street.html';
import winthropDahlHTML from './popups/parking-winthrop-dahl.html';
import cobbStreetHTML from './popups/parking-cobb-street.html';
import johnsonWoodsHTML from './popups/parking-johnson-woods.html';
import briggsStreetHTML from './popups/parking-briggs-street.html';
import craneStreetHTML from './popups/parking-crane-street.html';

import henrichJohnsonHTML from './popups/henrich-johnson-woods.html';
import unpavedWarningHTML from './popups/unpaved-warning.html';

import fallFoliageEventHTML from './popups/fall-foliage-event.html';



const map = L.map('map').setView([41.99, -71.1869], 13);
const cyclOSM = L.tileLayer('https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '<a href="https://github.com/cyclosm/cyclosm-cartocss-style/releases" title="CyclOSM - Open Bicycle render">CyclOSM</a> | Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap'
}).addTo(map);

const trailLines = L.geoJSON(trailGeoJSON, {
    style: function (feature) {
        let options = {
            color: "blue",
            weight: 4
        }
        if (feature.properties.surface === "unpaved") {
            options.dashArray = [5, 5];
            options.dashOffset = 0;
        }
        return options;
    }
}).addTo(map);

const parkingIcon = L.divIcon({
    className: 'awesome-marker awesome-marker-icon-blue',
    html: '<img class="am-glyph" src="dist/icons/maki/parking.svg" alt="" width="20" height="20" />',
    iconSize: [35, 45],
    iconAnchor: [17, 42],
    popupAnchor: [1, -32]
});

const trailheadIcon = L.divIcon({
    className: 'awesome-marker awesome-marker-icon-green',
    html: '<img class="am-glyph" src="dist/icons/maki/park.svg" alt="" width="20" height="20" />',
    iconSize: [35, 45],
    iconAnchor: [17, 42],
    popupAnchor: [1, -32]
});

const cautionIcon = L.divIcon({
    className: 'awesome-marker awesome-marker-icon-orange',
    html: '<img class="am-glyph" src="dist/icons/maki/caution.svg" alt="" width="20" height="20" />',
    iconSize: [35, 45],
    iconAnchor: [17, 42],
    popupAnchor: [1, -32]
});

const leafIcon = L.divIcon({
    className: 'awesome-marker awesome-marker-icon-orange',
    html: '<img class="am-glyph" src="dist/icons/leaf.svg" alt="" width="20" height="20" />',
    iconSize: [35, 45],
    iconAnchor: [17, 42],
    popupAnchor: [1, -32]
});

const popupOptions = {
    minWidth: window.innerWidth <= 768 ? 250 : 500,
    autoPan: true,
};

const fruitStreetLots = L.marker([42.006075, -71.196867], { icon: parkingIcon })
        .bindPopup(fruitStreetHTML, popupOptions);
const winthropDahlLot = L.marker([41.9961650796283,-71.18548393249513], { icon: parkingIcon })
        .bindPopup(winthropDahlHTML, popupOptions);
const cobbStreetLot = L.marker([41.992506, -71.184250], { icon: parkingIcon })
        .bindPopup(cobbStreetHTML, popupOptions);
const johnsonWoodsLot = L.marker([41.98619535611607,-71.17845922708513], { icon: parkingIcon })
        .bindPopup(johnsonWoodsHTML, popupOptions);
const briggsStreetLot = L.marker([41.962338235815146,-71.15673065185548], { icon: parkingIcon })
        .bindPopup(briggsStreetHTML, popupOptions);
const craneStreetLot = L.marker([41.95195370728311, -71.14685576641179], { icon: parkingIcon })
        .bindPopup(craneStreetHTML, popupOptions);

const parkingLots = L.layerGroup([fruitStreetLots, winthropDahlLot, cobbStreetLot, johnsonWoodsLot, briggsStreetLot, craneStreetLot]);

const henrichJohnsonWoods = L.marker([41.98771852630877,-71.18112802505495], { icon: trailheadIcon })
    .bindPopup(henrichJohnsonHTML, popupOptions);

const conservationLand = L.layerGroup([henrichJohnsonWoods]);

const unpavedWarning = L.marker([41.99649398810723,-71.18616521358491], {icon: cautionIcon })
    .bindPopup(unpavedWarningHTML, popupOptions);

const warnings = L.layerGroup([unpavedWarning]);

const exampleEvent = L.marker([41.986071746465086,-71.17844849824907], {icon: leafIcon})
    .bindPopup('example event', popupOptions);

const eventAttractions = L.layerGroup([exampleEvent])

const legend = L.control.Legend({
    position: "bottomleft",
    legends: [{
        label: "Paved",
        type: "polyline",
        color: "blue",
        weight: 4,
    }, {
        label: "Unpaved",
        type: "polyline",
        color: "blue",
        weight: 4,
        dashArray: [5, 5],
        dashOffset: 0
    },{
        label: "Free Parking",
        type: "image",
        url: "dist/icons/maki/parking.svg",
    },{
        label: "Take Caution",
        type: "image",
        url: "dist/icons/maki/caution.svg",
    },{
        label: 'Adjacent Trail Systems \n& Conservation Land',
        type: "image",
        url: "dist/icons/maki/park.svg",
    }]
/* In case we want to add the special events to the legend
{
        label: "Special Event Attraction",
        type: "image",
        url: "dist/icons/leaf.svg",
    },{
 */
})

// Fall Foliage Event Control
const customHtmlControl = L.control({ position: 'bottomleft' }); // positions: topleft, topright, bottomleft, bottomright
customHtmlControl.onAdd = function(map) {
    const div = L.DomUtil.create('div', 'leaflet-control-custom-html');
    div.innerHTML = fallFoliageEventHTML;
    L.DomEvent.disableClickPropagation(div);
    return div;
};

const params = new URLSearchParams(location.search);
const specialEvent = params.get("mode") === "event";
console.log(params.toString());

if (specialEvent) {
    console.log("event");
    eventAttractions.addTo(map);
    customHtmlControl.addTo(map);
} else {
    console.log("no event");
    parkingLots.addTo(map);
    conservationLand.addTo(map);
    warnings.addTo(map);
    legend.addTo(map);
}


// Tiles and overlay selection control.
var tiles = {
    "OSM": osm,
    "CyclOSM": cyclOSM,
};
var overlays = {
    "Parking": parkingLots,
    "Trail Systems": conservationLand,
    "Warnings": warnings,
    "Event Attractions": eventAttractions,
};
let layerControlOptions = specialEvent ? {collapsed:false} : {};
var layerControl = L.control.layers(tiles, overlays, layerControlOptions).addTo(map);

// // Hide the custom trail route when CyclOSM is selected because it has it brightly marked already.
// map.on('baselayerchange', (e) => {
//     if (e.name === "CyclOSM" && map.hasLayer(trailLines)) {
//         map.removeLayer(trailLines);
//     } else {
//         map.addLayer(trailLines);
//     }
// });

map.fitBounds(trailLines.getBounds());


// DEBUG: Print click coordinate
map.on('click', function(e) {
    var lat = e.latlng.lat;
    var lng = e.latlng.lng;
    console.log("[" + lat + "," + lng + "]");
});