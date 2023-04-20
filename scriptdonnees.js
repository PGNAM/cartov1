// Récupérer le fichier Excel
var xhr = new XMLHttpRequest();
xhr.open('GET', 'liste2.xlsx', true);
xhr.responseType = 'arraybuffer';

xhr.onload = function(e) {
  // Lire le fichier Excel
  var data = new Uint8Array(xhr.response);
  var workbook = XLSX.read(data, {type: 'array'});

  // Sélectionner la première feuille de calcul
  var worksheet = workbook.Sheets[workbook.SheetNames[0]];

  // Convertir les données en format JSON
  var jsonData = XLSX.utils.sheet_to_json(worksheet);

  // Créer le tableau HTML
  var table = document.createElement('table');
  table.setAttribute('border', '6');
  

  // Ajouter l'en-tête du tableau
  var headerRow = table.insertRow(-1);
  var headers = ['LIBEPCI', 'DEPARTEMENT', 'MEMBRE NAM', 'BASSIN', 'CORRIDORS CARS', 'CORRIDORS COVOITURAGE', 'ETUDES RECENCEES', 'CONTRATS OPERATIONNELS DE MOBILITES'];
  headers.forEach(function(header) {
    var th = document.createElement('th');
    th.innerHTML = header;
    headerRow.appendChild(th);
  });

// Ajouter les données au tableau
jsonData.forEach(function(rowData) {
    var row = table.insertRow(-1);
    headers.forEach(function(header) {
      var cell = row.insertCell(-1);
      cell.innerHTML = rowData[header] !== undefined ? rowData[header] : ''; // Vérifier si la valeur n'est pas "undefined" et remplacer par une chaîne vide si nécessaire
    });
    
  
    // Ajouter un événement clic pour mettre en surbrillance la ligne
    row.addEventListener('click', function() {
      row.classList.toggle('highlight');
    });
  });

  // Obtenir les valeurs uniques d'une colonne donnée
function getUniqueValues(header) {
  var values = [];
  jsonData.forEach(function(rowData) {
    var value = rowData[header];
    if (values.indexOf(value) === -1) {
      values.push(value);
    }
  });
  return values;
}

// Créer une ligne de filtre pour chaque colonne du tableau
var filterRow = table.insertRow(0);
headers.forEach(function(header) {
  var uniqueValues = getUniqueValues(header);
  uniqueValues.sort(); // Tri des valeurs par ordre alphabétique
  var select = document.createElement('select');
  select.appendChild(document.createElement('option')).textContent = '- ' + header + ' -';
  uniqueValues.forEach(function(value) {
    select.appendChild(document.createElement('option')).textContent = value;
  });
  select.addEventListener('change', function() {
    for (var i = 1; i < table.rows.length; i++) {
      var row = table.rows[i];
      if (this.selectedIndex === 0 || row.cells[headers.indexOf(header)].textContent === this.value) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    }
  });
  filterRow.insertCell(-1).appendChild(select);
});



  // Ajouter le tableau à la page HTML
  document.getElementById('table-container').appendChild(table);
};
xhr.send();