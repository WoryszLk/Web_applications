
var map = L.map('map').setView([51.505, -0.09], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

var playerLocation = L.latLng(51.505, -0.09);

var playerMarker = L.marker(playerLocation).addTo(map);

function getLocationPermission() {
    navigator.geolocation.getCurrentPosition(
        function (position) {
            var coords = position.coords;
            alert('Twoja lokalizacja: ' + coords.latitude + ', ' + coords.longitude);
            map.panTo(new L.LatLng(coords.latitude, coords.longitude));
            playerMarker.setLatLng(new L.LatLng(coords.latitude, coords.longitude));
        },
        function (error) {
            console.error('Błąd pobierania lokalizacji: ', error);
        }
    );
}

document.getElementById('myLocationBtn').addEventListener('click', getLocationPermission);
document.getElementById('downloadMapBtn').addEventListener('click', downloadMap);

function downloadMap() {
    map.closePopup();

    html2canvas(document.getElementById('map'), { useCORS: true }).then(function (canvas) {
        var url = canvas.toDataURL();

 
        centerPuzzleBoard(url);
    });
}


function centerPuzzleBoard(imageUrl) {
    var puzzleBoard = document.getElementById('puzzleBoard');
    puzzleBoard.innerHTML = '';

    var puzzleTable = document.createElement('table');
    puzzleTable.className = 'puzzleTable';

    var puzzleSize = 4; 
    var pieceSize = 100; 

    var tableSize = puzzleSize * pieceSize;

    puzzleTable.style.position = 'fixed';
    puzzleTable.style.top = '70%'; 
    puzzleTable.style.left = '50%';
    puzzleTable.style.transform = 'translate(-50%, -50%)';
    puzzleTable.style.borderCollapse = 'collapse';

    var puzzleArray = [];

    for (var row = 0; row < puzzleSize; row++) {
        var tr = document.createElement('tr');
        var puzzleRow = [];

        for (var col = 0; col < puzzleSize; col++) {
            var td = document.createElement('td');
            td.className = 'puzzlePiece';
            td.style.width = pieceSize + 'px';
            td.style.height = pieceSize + 'px';
            td.style.backgroundImage = 'url(' + imageUrl + ')';
            td.style.backgroundSize = tableSize + 'px ' + tableSize + 'px';
            td.style.backgroundPosition = '-' + col * pieceSize + 'px -' + row * pieceSize + 'px';
            td.style.border = '1px solid #000';

            td.setAttribute('draggable', 'true');
            td.setAttribute('data-row', row);
            td.setAttribute('data-col', col);

            puzzleRow.push(td);
            tr.appendChild(td);
        }

        puzzleArray.push(puzzleRow);
        puzzleTable.appendChild(tr);
    }

    puzzleBoard.appendChild(puzzleTable);

    var puzzlePieces = document.querySelectorAll('.puzzlePiece');
    puzzlePieces.forEach(function (piece) {
        piece.addEventListener('dragstart', function (event) {
            event.dataTransfer.setData('text/plain', JSON.stringify({
                row: piece.getAttribute('data-row'),
                col: piece.getAttribute('data-col')
            }));
        });
    });

    puzzleTable.addEventListener('dragover', function (event) {
        event.preventDefault();
    });

    puzzleTable.addEventListener('drop', function (event) {
        event.preventDefault();

        var draggedPiece = JSON.parse(event.dataTransfer.getData('text/plain'));


        var dropRow = parseInt(event.target.getAttribute('data-row'));
        var dropCol = parseInt(event.target.getAttribute('data-col'));

        var targetPiece = puzzleArray[dropRow][dropCol];
        puzzleArray[dropRow][dropCol] = puzzleArray[draggedPiece.row][draggedPiece.col];
        puzzleArray[draggedPiece.row][draggedPiece.col] = targetPiece;

        targetPiece.setAttribute('data-row', dropRow);
        targetPiece.setAttribute('data-col', dropCol);

        var targetParent = event.target.parentNode;
        targetParent.replaceChild(puzzleArray[dropRow][dropCol], event.target);


        if (checkIfPuzzleComplete(puzzleArray)) {
            alert('Gratulacje! Puzzle ułożone.');
            console.log('Wszystkie puzzle są ułożone poprawnie!');
        }
    });


    var downloadButton = document.createElement('button');
    downloadButton.textContent = 'Pobierz obraz';
    downloadButton.addEventListener('click', function () {
        downloadImage(imageUrl);
    });

    puzzleBoard.appendChild(downloadButton);
}


function checkIfPuzzleComplete(puzzleArray) {

    var rows = puzzleArray.length;
    var cols = puzzleArray[0].length;

    for (var row = 0; row < rows; row++) {
        for (var col = 0; col < cols; col++) {
            if (parseInt(puzzleArray[row][col].getAttribute('data-row')) !== row ||
                parseInt(puzzleArray[row][col].getAttribute('data-col')) !== col) {
                return false;
            }
        }
    }
    return true;
}


function showNotification(message) {
    var notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;

    document.body.appendChild(notification);


    setTimeout(function () {
        document.body.removeChild(notification);
    }, 3000);
}


function downloadImage(imageUrl) {
    var link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'puzzle_image.png';
    link.click();
}
