var totalRows = 23;
var totalCols = 45;
var inProgress = false;
//var initialMessage = "Click or drag cells to build walls! Press start when you finish and have selected an algorithm!";
var cellsToAnimate = [];
var createWalls = false;
var algorithm = null;
var justFinished = false;
var animationSpeed = "Fast"; //by default
var animationState = null;
var startCell = [8, 15]; //by default
var endCell = [18, 25]; //by default

var movingStart = false;
var movingEnd = false;

function generateGrid(rows, cols) {
  var grid = "<table>"; //opening table tag
  for (row = 1; row <= rows; row++) {
    grid += "<tr>";
    for (col = 1; col <= cols; col++) {
      grid += "<td></td>";
    }
    grid += "</tr>";
  }
  grid += "</table>"; //closing table tag
  return grid;
}

var myGrid = generateGrid(totalRows, totalCols);
//ye my grid mei apne paas puri table aa jaegi

$("#tableContainer").append(myGrid); //aur ussi table ko hum append kr denge

/* ----------------- */
/* ---- BUTTONS ---- */
/* ----------------- */

//3333333333333333333333333333333333333333333333333333333333333333333333333333333333
$("#startBtn").click(function () {
  if (algorithm == null) {
    return;
  }
  if (inProgress) {
    update("wait");
    return;
  }
  traverseGraph(algorithm);//Four   Four   Four   Four   Four   Four   Four   
});

/* --------------------- */
/* --- NAV BAR MENUS --- */
/* --------------------- */

//11111111111111111111111111111111111111111111111111111111111111111111111111111111111111
$("#algorithms .dropdown-item").click(function () {
  if (inProgress) {
    update("wait");
    return;
  }
  algorithm = $(this).text();
  updateStartBtnText();
  console.log("Algorithm has been changd to: " + algorithm);
});

$("#speed .dropdown-item").click(function () {
  if (inProgress) {
    update("wait");
    return;
  }
  animationSpeed = $(this).text();
  updateSpeedDisplay();
  console.log("Speed has been changd to: " + animationSpeed);
});

//2222222222222222222222222222222222222222222222222222222222222222222222222222222222222
function updateStartBtnText() {
  if (algorithm == "Depth-First-Search") {
    $("#startBtn").html("Visualize DFS");
  }else if (algorithm == "Breadth-First-Search") {
    $("#startBtn").html("Visualize BFS");
  }
  return;
}

function updateSpeedDisplay() {
  if (animationSpeed == "Slow") {
    $(".speedDisplay").text("Speed: Slow");
  } else if (animationSpeed == "Medium") {
    $(".speedDisplay").text("Speed: Medium");
  } else if (animationSpeed == "Fast") {
    $(".speedDisplay").text("Speed: Fast");
  }
  return;
}

//FOUR    FOUR    FOUR    FOUR    FOUR    FOUR    FOUR    FOUR    FOUR    FOUR    FOUR
async function traverseGraph(algorithm) {
  inProgress = true;
  clearBoard((keepWalls = true)); //FIVE    FIVE    FIVE    FIVE    FIVE    FIVE    FIVE    FIVE

  var startTime = Date.now();
  var pathFound = executeAlgo(); //SIX  SIX  SIX  SIX  SIX  SIX  SIX  SIX  SIX  SIX
  var endTime = Date.now();
  await animateCells(); //ELEVEN   ELEVEN   ELEVEN   ELEVEN   ELEVEN   ELEVEN
  if (pathFound) {
    updateResults(endTime - startTime, true, countLength()); //THIRTEEN   THIRTEEN   THIRTEEN   THIRTEEN   THIRTEEN
  } else {
    updateResults(endTime - startTime, false, countLength());
  }
  inProgress = false;
  justFinished = true;
}

//FIVE   FIVE   FIVE   FIVE   FIVE   FIVE   FIVE   FIVE   FIVE   FIVE   FIVE   FIVE   FIVE   FIVE
function clearBoard(keepWalls) {
  var cells = $("#tableContainer").find("td");
  var startCellIndex = startCell[0] * totalCols + startCell[1];
  var endCellIndex = endCell[0] * totalCols + endCell[1];

  for (var i = 0; i < cells.length; i++) {
    isWall = $(cells[i]).hasClass("wall");
    $(cells[i]).removeClass();
    if (i == startCellIndex) {
      $(cells[i]).addClass("start");
    } else if (i == endCellIndex) {
      $(cells[i]).addClass("end");
    } else if (keepWalls && isWall) {
      //if vo cell wall hai and keepWalls bhi true hai to make it a wall
      $(cells[i]).addClass("wall");
    }
  }
}

//SIX   SIX   SIX   SIX   SIX   SIX   SIX   SIX   SIX   SIX   SIX   SIX   SIX   SIX
function executeAlgo() {
  if (algorithm == "Depth-First-Search") {
    var visited = createVisited(); //SEVEN  SEVEN  SEVEN  SEVEN  SEVEN  SEVEN

    var pathFound = DFS(startCell[0], startCell[1], visited); //NINE  NINE  NINE  NINE  NINE
  }else if (algorithm == "Breadth-First-Search") {
    var pathFound = BFS();
  }
  return pathFound;
}

//SEVEN    SEVEN    SEVEN    SEVEN    SEVEN    SEVEN    SEVEN    SEVEN    SEVEN    SEVEN    SEVEN
function createVisited() {
  var visited = []; //ye ek boolean array hogi...jisme true means visited false means not visited yet
  var cells = $("#tableContainer").find("td");
  //as hum find("td") kr rhe hai...to cells apne paas ek 1D array hogi "td" ki
  for (var i = 0; i < totalRows; i++) {
    var row = [];
    for (var j = 0; j < totalCols; j++) {
      if (cellIsAWall(i, j, cells)) {
        //EIGHT    EIGHT    EIGHT    EIGHT    EIGHT    EIGHT
        row.push(true);
      } else {
        row.push(false);
      }
    }
    visited.push(row); //visited ko humne 2D nhi lia...1D hi lia hai lekin hai to array hi
    //so 2D render ke liye usme hum puri row push-back kr rhe hai
  }
  return visited;
}

//EIGHT    EIGHT    EIGHT    EIGHT    EIGHT    EIGHT    EIGHT    EIGHT    EIGHT    EIGHT
function cellIsAWall(i, j, cells) {
  var cellNum = i * totalCols + j;
  return $(cells[cellNum]).hasClass("wall");
}

//NINE     NINE     NINE     NINE     NINE     NINE     NINE     NINE     NINE     NINE     NINE
function DFS(i, j, visited) {
  if (i == endCell[0] && j == endCell[1]) {
    cellsToAnimate.push([[i, j], "success"]);
    return true;
  }
  visited[i][j] = true;
  cellsToAnimate.push([[i, j], "searching"]);
  var neighbors = getNeighbors(i, j); //TEN     TEN     TEN     TEN     TEN     TEN     TEN     TEN
  //4 neighbours de diye
  for (var k = 0; k < neighbors.length; k++) {
    var m = neighbors[k][0];
    var n = neighbors[k][1];
    if (!visited[m][n]) {
      var pathFound = DFS(m, n, visited);
      if (pathFound) {
        cellsToAnimate.push([[i, j], "success"]);
        return true;
      }
    }
  }
  cellsToAnimate.push([[i, j], "visited"]);
  return false;
}

function Queue() { 
 this.array = new Array(); // we are creating array which will act as our queue
 this.dequeue = function(){ //dequeue function bna diya
  	return this.array.pop(); 
 } 
 this.enqueue = function(item){
  	this.array.unshift(item); //inserting item in the starting of array(queue)
  	return;
 }
 this.empty = function(){
 	return ( this.array.length == 0 );
 }
 this.clear = function(){
 	this.array = new Array();
 	return;
 }
}

function BFS(){
	var pathFound = false;    //initially path nhi mila ji hmko
	var myQueue = new Queue(); 
	var prev = createPrev();  
	var visited = createVisited();   //visited kon konse hai basically blocked valo ko dekh rhe h 
	myQueue.enqueue( startCell );
	cellsToAnimate.push(startCell, "searching");
	visited[ startCell[0] ][ startCell[1] ] = true;
	while ( !myQueue.empty() ){
		var cell = myQueue.dequeue();
		var r = cell[0];
		var c = cell[1];
		cellsToAnimate.push( [cell, "visited"] );
		if (r == endCell[0] && c == endCell[1]){ //agr endcell tak phuch gye
			pathFound = true;
			break;
		}
		// Put neighboring cells in queue
		var neighbors = getNeighbors(r, c);
		for (var k = 0; k < neighbors.length; k++){
			var m = neighbors[k][0];
			var n = neighbors[k][1];
			if ( visited[m][n] ) { continue ;}
			visited[m][n] = true;
			prev[m][n] = [r, c];
			cellsToAnimate.push( [neighbors[k], "searching"] );
			myQueue.enqueue(neighbors[k]);
		}
	}
	// Make any nodes still in the queue "visited"
	while ( !myQueue.empty() ){
		var cell = myQueue.dequeue();
		var r = cell[0];
		var c = cell[1];
		cellsToAnimate.push( [cell, "visited"] );
	}
	// If a path was found, illuminate it
	if (pathFound) {
		var r = endCell[0];
		var c = endCell[1];
		cellsToAnimate.push( [[r, c], "success"] );
		while (prev[r][c] != null){
			var prevCell = prev[r][c];
			r = prevCell[0];
			c = prevCell[1];
			cellsToAnimate.push( [[r, c], "success"] );
		}
	}
	return pathFound;
}


//TEN    TEN    TEN    TEN    TEN    TEN    TEN    TEN    TEN    TEN    TEN    TEN    TEN
function getNeighbors(i, j) {
  var neighbors = [];
  if (i > 0) {
    neighbors.push([i - 1, j]);
  }
  if (j > 0) {
    neighbors.push([i, j - 1]);
  }
  if (i < totalRows - 1) {
    neighbors.push([i + 1, j]);
  }
  if (j < totalCols - 1) {
    neighbors.push([i, j + 1]);
  }
  return neighbors;
}

//ELEVEN      ELEVEN   ELEVEN   ELEVEN   ELEVEN   ELEVEN   ELEVEN   ELEVEN   ELEVEN
async function animateCells() {
  animationState = null;
  var cells = $("#tableContainer").find("td");
  var startCellIndex = startCell[0] * totalCols + startCell[1];
  var endCellIndex = endCell[0] * totalCols + endCell[1];

  var delay = getDelay(); //TWELVE    TWELVE    TWELVE    TWELVE    TWELVE    TWELVE
  for (var i = 0; i < cellsToAnimate.length; i++) {
    var cellCoordinates = cellsToAnimate[i][0];
    var x = cellCoordinates[0];
    var y = cellCoordinates[1];
    var num = x * totalCols + y; //ye vahi index number nikalne ke liye
    if (num == startCellIndex || num == endCellIndex) {
      continue;
    }
    var cell = cells[num];
    var colorClass = cellsToAnimate[i][1];

    // color krne mei itna delay dena hai
    await new Promise((resolve) => setTimeout(resolve, delay));

    $(cell).removeClass();
    $(cell).addClass(colorClass); //ye kr lia humne cell ko color
  }
  cellsToAnimate = [];
  //console.log("End of animation has been reached!");
  return new Promise((resolve) => resolve(true));
}

//TWELVE   TWELVE   TWELVE   TWELVE   TWELVE   TWELVE   TWELVE   TWELVE   TWELVE   TWELVE
function getDelay() {
  var delay;
  if (animationSpeed === "Slow") {
    if (algorithm == "Depth-First-Search") {
      delay = 25;
    } else {
      delay = 20;
    }
  } else if (animationSpeed === "Medium") {
    if (algorithm == "Depth-First-Search") {
      delay = 15;
    } else {
      delay = 10;
    }
  } else if (animationSpeed == "Fast") {
    if (algorithm == "Depth-First-Search") {
      delay = 8;
    } else {
      delay = 5;
    }
  }
  console.log("Delay = " + delay);
  return delay;
}

//THIRTEEN     THIRTEEN     THIRTEEN     THIRTEEN     THIRTEEN     THIRTEEN     THIRTEEN     THIRTEEN
function updateResults(duration, pathFound, length) {
  var firstAnimation = "boingOutDown";
  var secondAnimation = "boingInUp";

  //kuch bhi change krne ke liye hum pehle class ko remove kr rhe hai..and fir add kr rhe hai
  $("#results").removeClass();
  $("#results").addClass("magictime " + firstAnimation);
  setTimeout(function () {
    //aage funtion likho baad mei timeout value
    $("#resultsIcon").removeClass();
    //$("#results").css("height","80px");
    if (pathFound) {
      $("#results").css("background-color", "#77dd77");
      $("#resultsIcon").addClass("fas fa-check");
    } else {
      $("#results").css("background-color", "#ff6961");
      $("#resultsIcon").addClass("fas fa-times");
    }
    $("#duration").text("Duration: " + duration + " ms");
    $("#length").text("Length: " + length);
    $("#results").removeClass(firstAnimation);
    $("#results").addClass(secondAnimation);
  }, 1100);
}

//THIRTEEN      THIRTEEN      THIRTEEN      THIRTEEN      THIRTEEN      THIRTEEN      THIRTEEN      THIRTEEN
function countLength() {
  var cells = $("td");
  var l = 0;
  for (var i = 0; i < cells.length; i++) {
    if ($(cells[i]).hasClass("success")) {
      l++;
    }
  }
  return l;
}

function update(message) {
  $("#resultsIcon").removeClass();
  $("#resultsIcon").addClass("fas fa-exclamation");
  $("#results").css("background-color", "#ffc107");
  $("#length").text("");
  if (message == "wait") {
    $("#duration").text("Please wait for the algorithm to finish.");
  }
}

function createPrev(){
	var prev = [];
	for (var i = 0; i < totalRows; i++){
		var row = [];
		for (var j = 0; j < totalCols; j++){
			row.push(null);
		}
		prev.push(row);
	}
	return prev;
}


//NOW ADDING DIFFERENT DINTIONALITIES WHICH ARE NOT IN EVENT-CHAIN

/* ------------------------- ------------------------------------------------------------*/
/* -------------------------------- MOUSE FUNCTIONS ------------------------------------*/
/* ----------------------------------------------------------------------------------- */

$("td").mousedown(function () {
  var index = $("td").index(this);
  var startCellIndex = startCell[0] * totalCols + startCell[1];
  var endCellIndex = endCell[0] * totalCols + endCell[1];
  if (!inProgress) {
    // Clear board if just finished
    if (justFinished && !inProgress) {
      //means agar finish ho gya..and humne click kia to sara board erase and jaha
      //click kia vaha ek wall bn jaegi
      clearBoard((keepWalls = true));
      justFinished = false;
    }
    if (index == startCellIndex) {
      movingStart = true;
    } else if (index == endCellIndex) {
      movingEnd = true;
    } else {
      createWalls = true; //agar hum click krke dragkr rhe hai to walls bnti rhengi
    }
  }
});

//mousedown mei humne click krkerjha aur hilate gye..and ab utha dia
//koi bhi chiz wall tb bnegi jb uski class toggle hogi
$("td").mouseup(function () {
  createWalls = false;
  movingStart = false;
  movingEnd = false;
});

//The mouseenter event occurs when the mouse pointer is over (enters) the selected element.
$("td").mouseenter(function () {
  if (!createWalls && !movingStart && !movingEnd) {
    return;
  } //ye condn tb kaam ayegi jb hum table ke bahar se click krke fir hover kre hum

  var index = $("td").index(this);
  var startCellIndex = startCell[0] * totalCols + startCell[1];
  var endCellIndex = endCell[0] * totalCols + endCell[1];

  if (!inProgress) {
    //ye condn to ofcourse hai
    if (justFinished) {
      //just for safety
      clearBoard((keepWalls = true));
      justFinished = false;
    }

    if (movingStart && index != endCellIndex) {
      moveStartOrEnd(startCellIndex, index, "start");
    } else if (movingEnd && index != startCellIndex) {
      moveStartOrEnd(endCellIndex, index, "end");
    } else if (index != startCellIndex && index != endCellIndex) {
      $(this).toggleClass("wall");
    }
  }
});

function moveStartOrEnd(prevIndex, newIndex, startOrEnd) {
  var newCellY = newIndex % totalCols;
  var newCellX = Math.floor((newIndex - newCellY) / totalCols);
  if (startOrEnd == "start") {
    startCell = [newCellX, newCellY];
    console.log("Moving start to [" + newCellX + ", " + newCellY + "]");
  } else {
    endCell = [newCellX, newCellY];
    console.log("Moving end to [" + newCellX + ", " + newCellY + "]");
  }
  clearBoard((keepWalls = true));
  return;
}

//ye wo hai jb hum just ek hi oe click krte hai and hover nhi krte
$("td").click(function () {
  var index = $("td").index(this);
  var startCellIndex = startCell[0] * totalCols + startCell[1];
  var endCellIndex = endCell[0] * totalCols + endCell[1];
  if (
    inProgress == false &&
    !(index == startCellIndex) &&
    !(index == endCellIndex)
  ) {
    if (justFinished) {
      clearBoard((keepWalls = true));
      justFinished = false;
    }
    $(this).toggleClass("wall");
  }
});

$("body").mouseup(function () {
  createWalls = false;
  movingStart = false;
  movingEnd = false;
});

$("#clearBtn").click(function () {
  if (inProgress) {
    update("wait");
    return;
  }
  clearBoard((keepWalls = false));
});

clearBoard();