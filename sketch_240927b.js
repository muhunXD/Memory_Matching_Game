let buttons = [];
let numbers = [];
let flip = [];
let lastClickedIndex = -1; // To store the last clicked index
let secondLastClickedIndex = -1; // To store the second last clicked index
let nums_gen = 0;
let rows_gen = 0;
let startTime = 0;
let currentPlayer = 'Player 1'; // Default to Player 1
let player1Score = 0;
let player2Score = 0;
let gameCompleted = false;
let difficulty;
let instructionText; // Text element for instructions
let hintButton; // Button to show hint
let hintText = ''; // Hint message

function setup() {
  createCanvas(500, 400);

  // Create input box for player and difficulty selection
  difficulty = createInput('Player and Difficulty');
  difficulty.position(625, 400);

  // Create a text element below the input box for instructions
  instructionText = createP('Enter the player number (1 or 2) and difficulty (1 = Easy, 2 = Medium, 3 = Hard). Example: "12" for Player 1, Medium.');
  instructionText.position(350, 440); // Position below the input box

  difficulty.input(DiffSet);
  noLoop();
}

function generateButtons() {
  numbers = generateRandomNumbers(nums_gen);
  flip = new Array(rows_gen * 5).fill(false);
  let cols = 5;
  let w = (width - 100) / cols;
  let h = (height - 100) / rows_gen;

  for (let i = 0; i < rows_gen; i++) {
    for (let j = 0; j < cols; j++) {
      let index = i * cols + j;
      let button = createButton('');
      button.position(j * w + 500, i * h + 50);
      button.size(w, h);
      button.mousePressed(() => flipNumber(index, button));
      buttons.push(button);
    }
  }
}

function generateRandomNumbers(pairCount) {
  let nums = [];
  
  // Create pairs of numbers, each number appears exactly twice
  for (let i = 1; i <= pairCount; i++) {
    nums.push(i);
    nums.push(i);
  }
  
  // Shuffle the numbers array
  for (let i = nums.length - 1; i > 0; i--) {
    let j = floor(random(0, i + 1));
    [nums[i], nums[j]] = [nums[j], nums[i]]; // Swap numbers for shuffle
  }
  
  return nums;
}

function convertNumberToLines(num) {
  let line = '';
  for (let i = 0; i < num; i++) {
    line += '|'; // Append a vertical bar for each unit of the number
  }
  return line;
}

function flipNumber(index, button) {
  if (!flip[index] && !gameCompleted) {
    button.html(convertNumberToLines(numbers[index])); // Convert the number to lines
    flip[index] = true;

    // Check for a match
    if (lastClickedIndex !== -1) {
      if (numbers[lastClickedIndex] === numbers[index] && lastClickedIndex !== index) {
        button.style('background-color', 'green'); // Change color to green
        buttons[lastClickedIndex].style('background-color', 'green'); // Change previous button color to green
        
        if (currentPlayer === 'Player 1') {
          player1Score++; // Increment Player 1's score
        } else {
          player2Score++; // Increment Player 2's score
        }
        
        lastClickedIndex = -1; // Reset last clicked index
        secondLastClickedIndex = -1; // Reset second last clicked index
      } else {
        // If a third button is clicked and the previous two don't match
        if (secondLastClickedIndex !== -1) {
          // Flip back the last two buttons
          buttons[lastClickedIndex].html(''); // Flip back the previous button
          buttons[secondLastClickedIndex].html(''); // Flip back the second last button
          flip[lastClickedIndex] = false; // Update flip state
          flip[secondLastClickedIndex] = false; // Update flip state
        }
        // Update the clicked indexes
        secondLastClickedIndex = lastClickedIndex; // Move last clicked to second last
        lastClickedIndex = index; // Update last clicked index

        // Switch to the other player
        currentPlayer = (currentPlayer === 'Player 1') ? 'Player 2' : 'Player 1';
      }
    } else {
      lastClickedIndex = index; // Set the first clicked button
    }

    // Check if the game is completed
    checkGameCompletion();
  }
}

function checkGameCompletion() {
  // Check if all buttons are flipped and their background is green
  let allMatched = flip.every((flipped, index) => flipped && buttons[index].style('background-color') === 'green');

  if (allMatched) {
    gameCompleted = true; // Mark the game as completed
    noLoop(); // Stop the timer
  }
}

function DiffSet() {
  let input = difficulty.value();
  
  let playerNumber = input[0]; // First character is player number
  let diff = input[1]; // Second character is difficulty level

  // Set current player based on input
  currentPlayer = (playerNumber === '1') ? 'Player 1' : 'Player 2';

  // Set difficulty based on input
  if (diff == "1") {
    rows_gen = 2;
    nums_gen = 5;
  } else if (diff == "2") {
    rows_gen = 4;
    nums_gen = 10;
  } else if (diff == "3") {
    rows_gen = 8;
    nums_gen = 20;
  } else {
    return;
  }

  difficulty.remove();
  instructionText.remove(); // Remove instruction text after starting the game
  generateButtons();
  startTime = millis(); // Start the timer after difficulty is set

  // Create hint button and position it below the canvas
  hintButton = createButton('Show Hint');
  hintButton.position(625, 450);
  hintButton.mousePressed(showHint); // Call showHint when button is clicked

  loop(); // Start the draw loop for the timer
}

function showHint() {
  // Only show hint if there is a last clicked index
  if (lastClickedIndex !== -1) {
    let lastRow = Math.floor(lastClickedIndex / 5);
    let lastCol = lastClickedIndex % 5;
    
    // Find the first unmatched number that is the same as the last clicked number
    let correctIndex = numbers.findIndex((num, idx) => num === numbers[lastClickedIndex] && idx !== lastClickedIndex && !flip[idx]);
    
    if (correctIndex !== -1) {
      let correctRow = Math.floor(correctIndex / 5);
      let correctCol = correctIndex % 5;
      
      let distance = Math.abs(lastRow - correctRow) + Math.abs(lastCol - correctCol); // Manhattan distance
      
      hintText = `Hint: The matching number is ${distance} steps away.`;
    } else {
      hintText = 'Hint: No available matching number.';
    }
  } else {
    hintText = 'Hint: No number has been clicked yet.';
  }
}

function draw() {
  background(255);

  let elapsedTime = millis() - startTime;
  let seconds = floor(elapsedTime / 1000); // Convert to seconds
  
  fill(0);
  textSize(24);
  text("Time: " + seconds + " s", 50, 50); // Display the timer
  
  // Display the current player and scores
  text("Current Player: " + currentPlayer, 50, 100);
  text("Player 1 Score: " + player1Score, 50, 150);
  text("Player 2 Score: " + player2Score, 50, 200);
  
  // Display the hint message
  textSize(18);
  fill(0);
  text(hintText, 50, 300);
}
