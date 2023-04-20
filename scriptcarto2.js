        // Coordonnées du centre de la Nouvelle-Aquitaine
        const defaultCenter = [44.826, -0.555];
        const defaultZoom = 7;

        // Initialisation de la carte
        const map = L.map('map').setView(defaultCenter, defaultZoom);

        // Ajout d'un fond de carte
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Charger les données geoJSON et Excel
        const loadData = async () => {
            const epciGeoJsonUrl = 'epci3.geojson';
            const epciListUrl = 'liste2.xlsx';

            const geoJsonResponse = await fetch(epciGeoJsonUrl);
            const geoJsonData = await geoJsonResponse.json();

            const excelResponse = await fetch(epciListUrl);
            const excelArrayBuffer = await excelResponse.arrayBuffer();
            const excelData = XLSX.read(new Uint8Array(excelArrayBuffer), { type: 'array' });
            const epciList = XLSX.utils.sheet_to_json(excelData.Sheets[excelData.SheetNames[0]]);

            // Créer un dictionnaire avec les codes et les noms des EPCI
            const epciDataDict = {};
            for (const epci of epciList) {
                epciDataDict[epci.epci_code] = {
                    name: epci.LIBEPCI,
                    bassin: epci["BASSIN"],
                    etudes: epci["ETUDES RECENCEES"],
                    corrcar: epci["CORRIDORS CARS"],
                    corrcovoit: epci["CORRIDORS COVOITURAGES"],
                    com: epci["CONTRATS OPERATIONNELS DE MOBILITES"]
                };
            }

            var coloredGeoJSONLayer, whiteGeoJSONLayer;

            // Ajouter les polygones et les noms sur la carte
            coloredGeoJSONLayer = L.geoJSON(geoJsonData, {
                style: (feature) => {
                    const fillColor = feature.properties.AOM === "OUI" ? "#5F02E4" : "#FF0000";
                    return { 
                        fillColor: fillColor,
                        weight: 1,
                        color : "#6B0589",
                        opacity: 1,
                        fillOpacity: 0.5
                       

                        };
                },
                onEachFeature: function(feature, layer) {
        const epciCode = feature.properties.epci_code;
        const epciData = epciDataDict[epciCode];
        var popupContent = "<strong>" + epciData.name + "</strong><br><strong>AOM : </strong>" + feature.properties.AOM;

        if (epciData.bassin && epciData.bassin.trim() !== '') {
            popupContent += "<br><strong>Bassin</strong>: " + epciData.bassin.replace(/\n/g, '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
        }
        
        if (epciData.etudes && epciData.etudes.trim() !== '') {
            popupContent += "<br><strong>Études</strong>: " + epciData.etudes.replace(/\n/g, '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
        }

        if (epciData.corrcar && epciData.corrcar.trim() !== '') {
            popupContent += "<br><strong>Corridors cars</strong>: " + "<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+  epciData.corrcar.replace(/\n/g, '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
        }

        if (epciData.corrcovoit && epciData.corrcovoit.trim() !== '') {
            popupContent += "<br><strong>Corridor covoiturage </strong>: " + epciData.corrcovoit.replace(/\n/g, '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
        }

        if (epciData.com && epciData.com.trim() !== '') {
            popupContent += "<br><strong>Contrats opérationnels de mobilités</strong>: " + epciData.com.replace(/\n/g, '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
        }

        layer.bindPopup(popupContent);
    }
            }).addTo(map);
      

            // Ajouter les polygones avec contours blancs
            whiteGeoJSONLayer = L.geoJSON(geoJsonData, {
                style: (feature) => {
                    const hasWhiteOutline = feature.properties["LISTE INTERCOMMUNALITES BASE — EPCI NA_MEMBRE NAM"] === "OUI";
                    const outlineColor = hasWhiteOutline ? "#FFFFFF" : "none";
        
                    return {
                        weight: 2,
                        color: outlineColor,
                        fill: false
                    };
                },

            }).addTo(map);
        };
    
        


loadData();




//LOGO !

// Définir les dimensions du logo
var logoHeight = Math.round(window.innerWidth * 0.05);
var logoWidth = Math.round((logoWidth / 255) * 785);

// Créer l'élément d'image pour le logo
var logoImg = L.DomUtil.create('img', 'leaflet-logo');
logoImg.src = 'logo.jpg';
logoImg.style.width = logoWidth + 'px';
logoImg.style.height = logoHeight + 'px';
logoImg.style.border = '1px solid black'; // Ajouter une bordure noire fine

// Ajouter le logo à la carte
var logo = L.control({ position: 'bottomleft' });
logo.onAdd = function(map) {
  var div = L.DomUtil.create('div', 'leaflet-logo-container');
  div.appendChild(logoImg);
  return div;
};
logo.addTo(map);

// Mettre le logo au-dessus des autres éléments
var logoContainer = logo.getContainer();
logoContainer.style.zIndex = 9999;