class Leaderboard{
    leaderboardData = [
        { name: "Gracz1", score: 42 },
        { name: "Gracz2", score: 28 },
        { name: "Gracz3", score: 14 },
    ];

     reshuffle = () => {reset()};

    showLeaderboard(playerName, playerScore) {
        this.leaderboardData.push({ name: playerName, score: playerScore });

        this.leaderboardData.sort((a, b) => a.score - b.score);

        this.leaderboardData = this.leaderboardData.slice(0, 10);

        let leaderboardBody = document.getElementById("leaderboard-body");
        leaderboardBody!.innerHTML = "";

        this.leaderboardData.forEach((entry, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${entry.name}</td>
                <td>${entry.score}</td>
            `;
            leaderboardBody!.appendChild(row);
        });

        document.getElementById("leaderboard")!.style.display = "block";

        document.getElementById("play-again")!.onclick = () => {
            this.reshuffle();
            document.getElementById("leaderboard")!.style.display = "none";
        };
    }
}

function preloadImages(imageSources: string[]): Promise<HTMLImageElement[]> {
    const promises = imageSources.map(src => {
        return new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new Image();
            img.src = src;
            img.onload = () => resolve(img);
            img.onerror = reject;
        });
    });
    return Promise.all(promises);
}

const canvas = document.getElementById('game') as HTMLCanvasElement;
const ctx = canvas!.getContext('2d');

var rows = 2;
var cols = 2;
var cellWidth = canvas.width / cols;
var cellHeight = canvas.height / rows;
var moveCounter = 0;

var level = 0;
const limit = 2;

const cardImages = [
    'images/image1.jpg', 'images/image1.jpg',
    'images/image2.jpg', 'images/image2.jpg',
    'images/image3.jpg', 'images/image3.jpg',
    'images/image4.jpg', 'images/image4.jpg',
    'images/image5.jpg', 'images/image5.jpg',
    'images/image6.jpg', 'images/image6.jpg',
    'images/image7.jpg', 'images/image7.jpg',
    'images/image8.jpg', 'images/image8.jpg'
];

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || window.webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

var commands = ["A1", "A2", "A3", "A4", "B1", "B2", "B3", "B4", "C1", "C2", "C3", "C4", "D1", "D2", "D3", "D4"]

let leaderboard = new Leaderboard();

const identifiers = new Map([
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
    var speechRecognitionList = new SpeechGrammarList();var speechRecognitionList = new SpeechGrammarList();
    var grammar = '#JSGF V1.0; grammar commands; public <commands> = ' + commands.join(' | ') + ' ;'
    speechRecognitionList.addFromString(grammar, 1);
    recognition.grammars = speechRecognitionList;
}

recognition.continuous = false;
recognition.lang = 'pl-PL';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

function shuffle(array, pairs) {
    let selected = array.slice(0, pairs * 2)
    for (let i = selected.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [selected[i], selected[j]] = [selected[j], selected[i]];
    }
    return selected;
}

let firstCard: number | null = null;
let secondCard: number | null = null;

function drawGrid() {
    ctx!.strokeStyle = '#000';
    ctx!.lineWidth = 1;
    for (let i = 0; i <= cols; i++) {
        ctx!.beginPath();
        ctx!.moveTo(i * cellWidth, 0);
        ctx!.lineTo(i * cellWidth, canvas.height);
        ctx!.stroke();
    }

    for (let i = 0; i <= rows; i++) {
        ctx!.beginPath();
        ctx!.moveTo(0, i * cellHeight);
        ctx!.lineTo(canvas.width, i * cellHeight);
        ctx!.stroke();
    }

    const columnLabels = ['A', 'B', 'C', 'D'];
    ctx!.fillStyle = '#000';
    ctx!.font = '20px Arial';
    for (let i = 0; i < cols; i++) {
        ctx!.fillText(columnLabels[i], (i + 0.5) * cellWidth - 10, 20);
    }

    for (let i = 0; i < rows; i++) {
        ctx!.fillText((i + 1).toString(), 10, (i + 0.5) * cellHeight + 10);
    }
}

function drawRect(x, y, width, height) {
    ctx!.fillStyle = '#d3d3ff';
    ctx!.fillRect(x, y, width, height);
    ctx!.strokeStyle = '#000';
    ctx!.strokeRect(x, y, width, height);
}

function drawCards(cards) {
    ctx!.font = '40px Arial';
    ctx!.textAlign = 'center';
    ctx!.textBaseline = 'middle';

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const index = row * cols + col;
            const x = col * cellWidth + (cellWidth - 200) / 2;
            const y = row * cellHeight + (cellHeight - 100) / 2;
            drawRect(x, y, 200, 100);
            
            if (cards[index].isFlipped) {
                const img = new Image();
                img.src = cards[index].src;
                img.onload = () => {
                    ctx!.drawImage(cards[index].src, x, y, 200, 100);
                };
            } else {
                ctx!.fillStyle = '#000'; // Text color
                ctx!.fillText('?', x + 100, y + 50);
            }
        }
    }
}

function initializeGame() {
    const usedImages = shuffle(cardImages, 2 ** (level + 1));
    preloadImages(usedImages).then(images => {
        const cards = usedImages.map((src, index) => ({
            src: images[index],
            isFlipped: false,
            position: index
        }));

        drawGrid();
        drawCards(cards);

        canvas.addEventListener('click', (event) => {
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            const col = Math.floor(x / cellWidth);
            const row = Math.floor(y / cellHeight);
            const index = row * cols + col;

            if (!cards[index].isFlipped && (firstCard === null || secondCard === null)) {
                cards[index].isFlipped = true;
                drawCards(cards);

                if (firstCard === null) {
                    firstCard = index;
                } else {
                    secondCard = index;

                    onCardsSelected(cards, firstCard, secondCard);
                }
            }
        });

        recognition.onresult = function(event) {
            var command = event.results[0][0].transcript;
            console.log(command);

            let alpha1 = identifiers.get(command[0]);
            let alpha2 = identifiers.get(command[3]);
            let pic1 = (parseInt(command[1]) - 1) * cols + alpha1!;
            let pic2 = (parseInt(command[4]) - 1) * cols + alpha2!;

            cards[pic1].isFlipped = true;
            cards[pic2].isFlipped = true;
            drawCards(cards);

            onCardsSelected(cards, pic1, pic2);
            console.log('Confidence: ' + event.results[0][0].confidence);
        };
    });
}

function onCardsSelected(cards, first: number, second: number){
    moveCounter += 1;
    if (cards[first].src === cards[second].src) {
        firstCard = null;
        secondCard = null;

        if (cards.every(card => card.isFlipped)) {
            setTimeout(() => {
                if (level < limit) {
                    level +=1 ;
                    if(level == 1){
                        rows = 2;
                        cols = 4;
                    }
                    else{
                        rows = 4;
                        cols = 4;
                    }
                    cellWidth = canvas.width / cols;
                    cellHeight = canvas.height / rows;
                    ctx!.clearRect(0, 0, canvas.width, canvas.height);
                    initializeGame();
                    alert('Gratulaje! Teraz kolejny poziom ^^');
                } else {
                    alert('Gratulacje gra ukończona!!!');
                    leaderboard.showLeaderboard("PlayerHere", moveCounter);
                }
            }, 1000);
        }
    } else {
        setTimeout(() => {
            cards[first].isFlipped = false;
            cards[second].isFlipped = false;
            firstCard = null;
            secondCard = null;
            drawCards(cards);
        }, 1000);
    }
}

function reset () {
    rows = 2;
    cols = 2;
    cellWidth = canvas.width / cols;
    cellHeight = canvas.height / rows;
    ctx!.clearRect(0, 0, canvas.width, canvas.height);
    level = 0;
    moveCounter = 0;
    initializeGame();
}

const voiceButton = document.getElementById('voice');

voiceButton!.onclick = function() {
    recognition.start();
    console.log('Ready to receive a command.');
}

initializeGame()
