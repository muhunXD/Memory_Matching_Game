//Name: Amontep Changdaeng
//ID: 6601012630092

let buttons = [];
let numbers = [];
let flip = [];
let lastClickedIndex = -1; // To store the last clicked index
let secondLastClickedIndex = -1; // To store the second last clicked index

function setup() {
  createCanvas(500, 400);
  noLoop();
  let rows = 4;
  let cols = 5;
  let w = width / cols;
  let h = height / rows;

  numbers = generateRandomNumbers(10);

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let index = i * cols + j; 
      let button = createButton(''); 
      button.position(j * w + 500, i * h + 50);
      button.size(w, h);
      button.mousePressed(() => flipNumber(index, button));
      buttons.push(button); 
      flip.push(false); 
    }
  }
}

function generateRandomNumbers(pairCount) {
  let nums = [];
  while (nums.length < pairCount * 2) {
    let num = floor(random(1, pairCount + 1));
    if (nums.filter(n => n === num).length < 2) {
      nums.push(num);
    }
  }
  return nums;
}

function flipNumber(index, button) {
  if (!flip[index]) { 
    button.html(numbers[index]); 
    flip[index] = true; 
    
    // Check for a match
    if (lastClickedIndex !== -1) {
      if (numbers[lastClickedIndex] === numbers[index] && lastClickedIndex !== index) {
        button.style('background-color', 'green'); // Change color to green
        buttons[lastClickedIndex].style('background-color', 'green'); // Change the previous button color to green
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
        secondLastClickedIndex = lastClickedIndex; // Move the last clicked to second last
        lastClickedIndex = index; // Update last clicked index
      }
    } else {
      lastClickedIndex = index; // Set the first clicked button
    }
  }
}

function draw() {
  
}
