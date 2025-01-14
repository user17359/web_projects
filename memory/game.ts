const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const rows = 4;
const cols = 4;
const cellWidth = canvas.width / cols;
const cellHeight = canvas.height / rows;

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

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

shuffle(cardImages);

const cards = cardImages.map((src, index) => ({
    src,
    isFlipped: false,
    position: index
}));

let firstCard = null;
let secondCard = null;

function drawGrid() {
    ctx.strokeStyle = '#000'; // Grid line color
    ctx.lineWidth = 1; // Grid line width

    for (let i = 0; i <= cols; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cellWidth, 0);
        ctx.lineTo(i * cellWidth, canvas.height);
        ctx.stroke();
    }

    for (let i = 0; i <= rows; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * cellHeight);
        ctx.lineTo(canvas.width, i * cellHeight);
        ctx.stroke();
    }

    const columnLabels = ['A', 'B', 'C', 'D'];
    ctx.fillStyle = '#000'; // Text color
    ctx.font = '20px Arial';
    for (let i = 0; i < cols; i++) {
        ctx.fillText(columnLabels[i], (i + 0.5) * cellWidth - 10, 20);
    }

    for (let i = 0; i < rows; i++) {
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
function drawCards() {
    ctx.font = '40px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const index = row * cols + col;
            const x = col * cellWidth + (cellWidth - 200) / 2; // Center the card
            const y = row * cellHeight + (cellHeight - 100) / 2; // Center the card
            drawRect(x, y, 200, 100); // Draw the card
            
            if (cards[index].isFlipped) {
                const img = new Image();
                img.src = cards[index].src;
                img.onload = () => {
                    ctx.drawImage(img, x, y, 200, 100); // Draw the image on the card
                };
            } else {
                ctx.fillStyle = '#000'; // Text color
                ctx.fillText('?', x + 100, y + 50); // Draw the question mark
            }
        }
    }
}

canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const col = Math.floor(x / cellWidth);
    const row = Math.floor(y / cellHeight);
    const index = row * cols + col;

    if (!cards[index].isFlipped && (firstCard === null || secondCard === null)) {
        cards[index].isFlipped = true;
        drawCards();

        if (firstCard === null) {
            firstCard = index;
        } else {
            secondCard = index;

            if (cards[firstCard].src === cards[secondCard].src) {
                firstCard = null;
                secondCard = null;
            } else {
                setTimeout(() => {
                    cards[firstCard].isFlipped = false;
                    cards[secondCard].isFlipped = false;
                    firstCard = null;
                    secondCard = null;
                    drawCards();
                }, 1000);
            }
        }
    }
});

drawGrid();
drawCards();