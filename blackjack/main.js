// Access the HTML canvas element and get its 2D rendering context
let canvas = document.getElementById('gameCanvas');
let context = canvas.getContext('2d');
context.font = '20px Arial';

// Game state variables
let playerMoney = 500; // Player's starting money
let bet = 5; // Starting bet
let playerHand = []; // Player's hand of cards
let dealerHand = []; // Dealer's hand of cards
let gameMessage = ''; // Message displayed about game status
let dealerTurn = false; // Flag to track if it's the dealer's turn

// Accessing HTML buttons
let startBtn = document.getElementById('startBtn');
let hitBtn = document.getElementById('hitBtn');
let stayBtn = document.getElementById('stayBtn');
let increaseBetBtn = document.getElementById('increaseBet');
let decreaseBetBtn = document.getElementById('decreaseBet');

// Adding event listeners to buttons
startBtn.addEventListener('click', startGame);
hitBtn.addEventListener('click', playerHit);
stayBtn.addEventListener('click', dealerPlay);
increaseBetBtn.addEventListener('click', increaseBet);
decreaseBetBtn.addEventListener('click', decreaseBet);

// Function to start the game
function startGame() {
    playerHand = [getCard(), getCard()]; // Deal two cards to player
    dealerHand = [getCard(), getCard()]; // Deal two cards to dealer
    gameMessage = '';
    dealerTurn = false;
    renderGame(); // Render the game state
}

// Function for player to hit (take another card)
function playerHit() {
    playerHand.push(getCard()); // Add a new card to player's hand
    checkBust(playerHand); // Check if player has busted
    renderGame(); // Render the game state
}

// Function for dealer's turn
function dealerPlay() {
    dealerTurn = true;
    while (getHandValue(dealerHand) < 17) {
        dealerHand.push(getCard()); // Dealer keeps taking cards until value is 17 or more
    }
    checkBust(dealerHand); // Check if dealer has busted
    renderGame(); // Render the game state
    endGame(); // End the game and determine winner
}

// Function to increase the bet
function increaseBet() {
    bet += 5; // Increase bet by 5
    renderGame(); // Render the game state
}

// Function to decrease the bet
function decreaseBet() {
    if (bet > 5) {
        bet -= 5; // Decrease bet by 5, but not below 5
    }
    renderGame(); // Render the game state
}

// Function to end the game and determine the winner
function endGame() {
    let playerValue = getHandValue(playerHand); // Get player's hand value
    let dealerValue = getHandValue(dealerHand); // Get dealer's hand value

    // Determine game outcome and update player's money
    if (playerValue > 21) {
        playerMoney -= bet;
        gameMessage = 'Player busts. You lose!';
    } else if (dealerValue > 21) {
        playerMoney += bet;
        gameMessage = 'Dealer busts. You win!';
    } else if (playerValue > dealerValue) {
        playerMoney += bet;
        gameMessage = 'You win!';
    } else {
        playerMoney -= bet;
        gameMessage = 'You lose!';
    }

    renderGame(); // Render the final game state
}

// Function to get a random card
function getCard() {
    let suits = ['♠', '♥', '♦', '♣']; // Card suits
    let values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']; // Card values
    return {
        suit: suits[Math.floor(Math.random() * suits.length)],
        value: values[Math.floor(Math.random() * values.length)]
    };
}

// Function to calculate the value of a hand
function getHandValue(hand) {
    let value = 0;
    let aces = 0; // Count of aces in hand

    // Calculate the hand's value, treating aces as 11 initially
    for (let card of hand) {
        if (card.value === 'A') {
            value += 11;
            aces += 1;
        } else if (['K', 'Q', 'J'].includes(card.value)) {
            value += 10;
        } else {
            value += Number(card.value);
        }
    }

    // Adjust for aces if value exceeds 21
    while (value > 21 && aces > 0) {
        value -= 10; // Treat an ace as 1 instead of 11
        aces -= 1;
    }

    return value;
}

// Function to check if a hand has busted
function checkBust(hand) {
    if (getHandValue(hand) > 21) {
        endGame(); // End the game if the hand value exceeds 21
    }
}

// Function to render the game state on the canvas
function renderGame() {
    context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    // Display player's money, bet, and hand value
    context.fillText(`Money: $${playerMoney}`, 10, 460);
    context.fillText(`Bet: $${bet}`, 10, 440);
    context.fillText(`Player: ${getHandValue(playerHand)}`, 10, 420);

    // Display dealer's hand value only during dealer's turn
    if (dealerTurn) {
        context.fillText(`Dealer: ${getHandValue(dealerHand)}`, 10, 50);
    }

    // Draw player's cards
    for (let i = 0; i < playerHand.length; i++) {
        drawCard(playerHand[i], i * 90 + 100, 320);
    }

    // Draw dealer's cards, showing the back of the first card if it's not the dealer's turn
    for (let i = 0; i < dealerHand.length; i++) {
        if (i === 0 && !dealerTurn) {
            drawCardBack(i * 90 + 100, 50); // Draw card back for the first card
        } else {
            drawCard(dealerHand[i], i * 90 + 100, 50); // Draw card face
        }
    }

    // Display the game message, if any
    if (gameMessage !== '') {
        context.fillText(gameMessage, 200, 240);
    }
}

// Function to draw a card face
function drawCard(card, x, y) {
    context.fillStyle = '#FFFFFF'; // Card background color
    context.fillRect(x, y, 70, 100); // Card rectangle
    context.strokeRect(x, y, 70, 100); // Card border
    context.fillStyle = card.suit === '♠' || card.suit === '♣' ? '#000000' : '#FF0000'; // Set font color based on suit
    context.fillText(card.suit, x + 25, y + 50); // Draw card suit
    context.fillText(card.value, x + 25, y + 75); // Draw card value
}

// Function to draw a card back
function drawCardBack(x, y) {
    context.fillStyle = '#FFFFFF'; // Card background color
    context.fillRect(x, y, 70, 100); // Card rectangle
    context.strokeRect(x, y, 70, 100); // Card border
    context.fillStyle = '#000000'; // Card back color
    context.fillRect(x + 5, y + 5, 60, 90); // Card back rectangle
}

startGame(); // Start the game
