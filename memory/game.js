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
function preloadImages(imageSources) {
    var promises = imageSources.map(function (src) {
        return new Promise(function (resolve, reject) {
            var img = new Image();
            img.src = src;
            img.onload = function () { return resolve(img); };
            img.onerror = reject;
        });
    });
    return Promise.all(promises);
}
var canvas = document.getElementById('game');
var ctx = canvas.getContext('2d');
var rows = 2;
var cols = 2;
var cellWidth = canvas.width / cols;
var cellHeight = canvas.height / rows;
var moveCounter = 0;
var startTime;
var level = 0;
var limit = 2;
var catImages = [
    'images/image1.jpg', 'images/image1.jpg',
    'images/image2.jpg', 'images/image2.jpg',
    'images/image3.jpg', 'images/image3.jpg',
    'images/image4.jpg', 'images/image4.jpg',
    'images/image5.jpg', 'images/image5.jpg',
    'images/image6.jpg', 'images/image6.jpg',
    'images/image7.jpg', 'images/image7.jpg',
    'images/image8.jpg', 'images/image8.jpg'
];
var voivodImages = [
    'images/voi1.png', 'images/voi1.png',
    'images/voi2.png', 'images/voi2.png',
    'images/voi3.png', 'images/voi3.png',
    'images/voi4.png', 'images/voi4.png',
    'images/voi5.png', 'images/voi5.png',
    'images/voi6.png', 'images/voi6.png',
    'images/voi7.png', 'images/voi7.png',
    'images/voi8.png', 'images/voi8.png'
];
var facultiesImages = [
    'images/fac1.png', 'images/fac1.png',
    'images/fac2.jpg', 'images/fac2.jpg',
    'images/fac3.png', 'images/fac3.png',
    'images/fac4.jpg', 'images/fac4.jpg',
    'images/fac5.png', 'images/fac5.png',
    'images/fac6.png', 'images/fac6.png',
    'images/fac7.png', 'images/fac7.png',
    'images/fac8.png', 'images/fac8.png'
];
var cardImages;
var leaderboard = new Leaderboard();
// recognition definitions
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || window.webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;
var commands = ["A1", "A2", "A3", "A4", "B1", "B2", "B3", "B4", "C1", "C2", "C3", "C4", "D1", "D2", "D3", "D4"];
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
    // grid
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
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
    // labels
    var columnLabels = ['A', 'B', 'C', 'D'];
    ctx.fillStyle = '#000';
    ctx.font = '20px Arial';
    for (var i = 0; i < cols; i++) {
        ctx.fillText(columnLabels[i], (i + 0.5) * cellWidth - 10, 20);
    }
    for (var i = 0; i < rows; i++) {
        ctx.fillText((i + 1).toString(), 10, (i + 0.5) * cellHeight + 10);
    }
}
function drawRect(x, y, width, height) {
    ctx.fillStyle = '#d3d3ff';
    ctx.fillRect(x, y, width, height);
    ctx.strokeStyle = '#000';
    ctx.strokeRect(x, y, width, height);
}
function drawCards(cards) {
    ctx.font = '40px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (var row = 0; row < rows; row++) {
        for (var col = 0; col < cols; col++) {
            var index = row * cols + col;
            var x = col * cellWidth + (cellWidth - 200) / 2;
            var y = row * cellHeight + (cellHeight - 100) / 2;
            drawRect(x, y, 200, 100);
            if (cards[index].isFlipped) {
                ctx.drawImage(cards[index].src, x, y, 200, 100);
            }
            else {
                ctx.fillStyle = '#000';
                ctx.fillText('?', x + 100, y + 50);
            }
        }
    }
}
function initializeGame() {
    var usedImages = shuffle(cardImages, Math.pow(2, (level + 1)));
    preloadImages(usedImages).then(function (images) {
        var cards = usedImages.map(function (src, index) { return ({
            code: src,
            src: images[index],
            isFlipped: false,
            position: index
        }); });
        drawGrid();
        drawCards(cards);
        // on card clicked
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
        // voice recognition commands
        recognition.onresult = function (event) {
            console.log("result");
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
    });
}
function onCardsSelected(cards, first, second) {
    moveCounter += 1;
    // if cards match
    if (cards[first].code === cards[second].code) {
        firstCard = null;
        secondCard = null;
        // if level is complete
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
                    var d = new Date();
                    var endTime = d.getTime();
                    alert('Gratulacje gra ukończona!!! Czas ' + Math.floor((endTime - startTime) / 1000) + "s");
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
// after player pressed reset on leaderboard
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
// button for voice
var voiceButton = document.getElementById('voice');
voiceButton.onclick = function () {
    recognition.start();
    console.log('Ready to receive a command.');
};
// setup of menu buttons
var menu = document.getElementById('menu');
var catsButton = document.getElementById('cats');
catsButton.onclick = function () {
    var d = new Date();
    startTime = d.getTime();
    cardImages = catImages;
    initializeGame();
    menu.style.display = "none";
};
var voivodButton = document.getElementById('voivodships');
voivodButton.onclick = function () {
    var d = new Date();
    startTime = d.getTime();
    cardImages = voivodImages;
    initializeGame();
    menu.style.display = "none";
};
var facultiesButton = document.getElementById('faculties');
facultiesButton.onclick = function () {
    var d = new Date();
    startTime = d.getTime();
    cardImages = facultiesImages;
    initializeGame();
    menu.style.display = "none";
};
