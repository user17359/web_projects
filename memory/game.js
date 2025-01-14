var Leaderboard = /** @class */ (function () {
    function Leaderboard() {
        this.leaderboardData = [
            { name: "Gracz1", score: 42 },
            { name: "Gracz2", score: 28 },
            { name: "Gracz3", score: 14 },
        ];
        this.reshuffle = function () { reset(); };
    }
    Leaderboard.prototype.showLeaderboard = function (playerName, playerScore) {
        var _this = this;
        this.leaderboardData.push({ name: playerName, score: playerScore });
        this.leaderboardData.sort(function (a, b) { return a.score - b.score; });
        this.leaderboardData = this.leaderboardData.slice(0, 10);
        var leaderboardBody = document.getElementById("leaderboard-body");
        leaderboardBody.innerHTML = "";
        this.leaderboardData.forEach(function (entry, index) {
            var row = document.createElement("tr");
            row.innerHTML = "\n                <td>".concat(index + 1, "</td>\n                <td>").concat(entry.name, "</td>\n                <td>").concat(entry.score, "</td>\n            ");
            leaderboardBody.appendChild(row);
        });
        document.getElementById("leaderboard").style.display = "block";
        document.getElementById("play-again").onclick = function () {
            _this.reshuffle();
            document.getElementById("leaderboard").style.display = "none";
        };
    };
    return Leaderboard;
}());
var canvas = document.getElementById('game');
var ctx = canvas.getContext('2d');
var rows = 2;
var cols = 2;
var cellWidth = canvas.width / cols;
var cellHeight = canvas.height / rows;
var moveCounter = 0;
var level = 0;
var limit = 2;
var cardImages = [
    'images/image1.jpg', 'images/image1.jpg',
    'images/image2.jpg', 'images/image2.jpg',
    'images/image3.jpg', 'images/image3.jpg',
    'images/image4.jpg', 'images/image4.jpg',
    'images/image5.jpg', 'images/image5.jpg',
    'images/image6.jpg', 'images/image6.jpg',
    'images/image7.jpg', 'images/image7.jpg',
    'images/image8.jpg', 'images/image8.jpg'
];
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || window.webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;
var commands = ["A1", "A2", "A3", "A4", "B1", "B2", "B3", "B4", "C1", "C2", "C3", "C4", "D1", "D2", "D3", "D4"];
var leaderboard = new Leaderboard();
var identifiers = new Map([
    ["A", 0],
    ["B", 1],
    ["C", 2],
    ["D", 3],
    ["a", 0],
    ["b", 1],
    ["c", 2],
    ["d", 3],
]);
var recognition = new SpeechRecognition();
if (SpeechGrammarList) {
    var speechRecognitionList = new SpeechGrammarList();
    var speechRecognitionList = new SpeechGrammarList();
    var grammar = '#JSGF V1.0; grammar commands; public <commands> = ' + commands.join(' | ') + ' ;';
    speechRecognitionList.addFromString(grammar, 1);
    recognition.grammars = speechRecognitionList;
}
recognition.continuous = false;
recognition.lang = 'pl-PL';
recognition.interimResults = false;
recognition.maxAlternatives = 1;
function shuffle(array, pairs) {
    var _a;
    var selected = array.slice(0, pairs * 2);
    for (var i = selected.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        _a = [selected[j], selected[i]], selected[i] = _a[0], selected[j] = _a[1];
    }
    return selected;
}
var firstCard = null;
var secondCard = null;
function drawGrid() {
    ctx.strokeStyle = '#000'; // Grid line color
    ctx.lineWidth = 1; // Grid line width
    for (var i = 0; i <= cols; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cellWidth, 0);
        ctx.lineTo(i * cellWidth, canvas.height);
        ctx.stroke();
    }
    for (var i = 0; i <= rows; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * cellHeight);
        ctx.lineTo(canvas.width, i * cellHeight);
        ctx.stroke();
    }
    var columnLabels = ['A', 'B', 'C', 'D'];
    ctx.fillStyle = '#000'; // Text color
    ctx.font = '20px Arial';
    for (var i = 0; i < cols; i++) {
        ctx.fillText(columnLabels[i], (i + 0.5) * cellWidth - 10, 20);
    }
    for (var i = 0; i < rows; i++) {
        ctx.fillText((i + 1).toString(), 10, (i + 0.5) * cellHeight + 10);
    }
}
function drawRect(x, y, width, height) {
    ctx.fillStyle = '#d3d3ff'; // Card color
    ctx.fillRect(x, y, width, height); // Draw the rectangle
    ctx.strokeStyle = '#000'; // Card border color
    ctx.strokeRect(x, y, width, height); // Draw the border
}
// Draw cards with question marks
function drawCards(cards) {
    ctx.font = '40px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (var row = 0; row < rows; row++) {
        var _loop_1 = function (col) {
            var index = row * cols + col;
            var x = col * cellWidth + (cellWidth - 200) / 2; // Center the card
            var y = row * cellHeight + (cellHeight - 100) / 2; // Center the card
            drawRect(x, y, 200, 100); // Draw the card
            if (cards[index].isFlipped) {
                var img_1 = new Image();
                img_1.src = cards[index].src;
                img_1.onload = function () {
                    ctx.drawImage(img_1, x, y, 200, 100); // Draw the image on the card
                };
            }
            else {
                ctx.fillStyle = '#000'; // Text color
                ctx.fillText('?', x + 100, y + 50); // Draw the question mark
            }
        };
        for (var col = 0; col < cols; col++) {
            _loop_1(col);
        }
    }
}
function initializeGame() {
    var usedImages = shuffle(cardImages, Math.pow(2, (level + 1)));
    var cards = usedImages.map(function (src, index) { return ({
        src: src,
        isFlipped: false,
        position: index
    }); });
    drawGrid();
    drawCards(cards);
    canvas.addEventListener('click', function (event) {
        var rect = canvas.getBoundingClientRect();
        var x = event.clientX - rect.left;
        var y = event.clientY - rect.top;
        var col = Math.floor(x / cellWidth);
        var row = Math.floor(y / cellHeight);
        var index = row * cols + col;
        if (!cards[index].isFlipped && (firstCard === null || secondCard === null)) {
            cards[index].isFlipped = true;
            drawCards(cards);
            if (firstCard === null) {
                firstCard = index;
            }
            else {
                secondCard = index;
                onCardsSelected(cards, firstCard, secondCard);
            }
        }
    });
    recognition.onresult = function (event) {
        var command = event.results[0][0].transcript;
        console.log(command);
        var alpha1 = identifiers.get(command[0]);
        var alpha2 = identifiers.get(command[3]);
        var pic1 = (parseInt(command[1]) - 1) * cols + alpha1;
        var pic2 = (parseInt(command[4]) - 1) * cols + alpha2;
        cards[pic1].isFlipped = true;
        cards[pic2].isFlipped = true;
        drawCards(cards);
        onCardsSelected(cards, pic1, pic2);
        console.log('Confidence: ' + event.results[0][0].confidence);
    };
}
function onCardsSelected(cards, first, second) {
    moveCounter += 1;
    if (cards[first].src === cards[second].src) {
        firstCard = null;
        secondCard = null;
        if (cards.every(function (card) { return card.isFlipped; })) {
            setTimeout(function () {
                if (level < limit) {
                    level += 1;
                    if (level == 1) {
                        rows = 2;
                        cols = 4;
                    }
                    else {
                        rows = 4;
                        cols = 4;
                    }
                    cellWidth = canvas.width / cols;
                    cellHeight = canvas.height / rows;
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    initializeGame();
                    alert('Gratulaje! Teraz kolejny poziom ^^');
                }
                else {
                    alert('Gratulacje gra ukończona!!!');
                    leaderboard.showLeaderboard("PlayerHere", moveCounter);
                }
            }, 1000);
        }
    }
    else {
        setTimeout(function () {
            cards[first].isFlipped = false;
            cards[second].isFlipped = false;
            firstCard = null;
            secondCard = null;
            drawCards(cards);
        }, 1000);
    }
}
function reset() {
    rows = 2;
    cols = 2;
    cellWidth = canvas.width / cols;
    cellHeight = canvas.height / rows;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    level = 0;
    moveCounter = 0;
    initializeGame();
}
var voiceButton = document.getElementById('voice');
voiceButton.onclick = function () {
    recognition.start();
    console.log('Ready to receive a command.');
};
initializeGame();
