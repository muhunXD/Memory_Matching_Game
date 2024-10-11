//Name: Amontep Changdaeng
//ID: 6601012630092
//Multiplayer
//Hint
//Timer


let buttons = [];
let numbers = [];
let flip = [];
let lastClickedIndex = -1; // To store the last clicked index
let secondLastClickedIndex = -1; // To store the second last clicked index
let difficulty;
let nums_gen = 0; 
let rows_gen = 0;
let time = 0;
let player;

function setup() {
  createCanvas(500, 400);
  difficulty = createInput('1 for Easy,2 for Medium,3 for Hard');
  difficulty.position(625, 400);
  difficulty.input(DiffSet);
  noLoop(); 
  generateButtons();
  player_select();
  
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
  while (nums.length < pairCount * 4) {
    let num = floor(random(1, pairCount + 1));
    if (nums.filter(n => n === num).length < 4) {
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
        buttons[lastClickedIndex].style('background-color', 'green'); // Change previous button color to green
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
      }
    } else {
      lastClickedIndex = index; // Set the first clicked button
    }
  }
  
}

function DiffSet() {
  let diff = difficulty.value();
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
  generateButtons();
  text(numbers,100,100,200,200);
}

function timer(){
  let i = 1;
  while (time<60){
    text_time = text(time+i,100,100,200,200);
    time = time + i;
  }  
}

function draw_timer(){
  
}

function player_select(){
  button1 = createButton('Player 1');
  button1 = button.style('background-color', 'blue');
  button1.mousePressed(player1);
  button1.position(700, 300);
  button2 = createButton('Player 2');
  button2 = button.style('background-color', 'red');
  button2.position(100,100);
  button1.mousePressed(player2);
   
}

function draw() {
  timer();
}
