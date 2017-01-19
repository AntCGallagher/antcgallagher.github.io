var xscl = 50;
var yscl = 75;
var w = 30;
var registers = [];
var pc = 0;
var instructions = [["INC","0"], ["INC","1"], ["DECJZ", "3", "0"]];
// labels is an object that maps label names to their position in the code
var labels = {
  
};

function setup() {
  createCanvas(500,500);
  for (var i=0; i<25; i++) {
    registers.push(new Register(i));
    registers[i].show();
  }
  frameRate(2);
}

function draw() {
  // get and run current instruction
  var todo = instructions[pc];
  
  // identify and run the instruction
  if (todo) {
    clear();
    var command = pc + ": " + todo.join(" ");
    text(command,15,15)
    if (todo[0] == "DECJZ") {
      // DECJZ (i,j)
      var i = todo[1];
      var j = todo[2];
      if (!registers[i].getValue()) {
        pc = j;
      } else {
        registers[i].decrement();
        pc++;
      }
    } else if (todo[0] == "INC") {
      // INC (i)
      var i = todo[1]
      registers[i].increment();
      pc++;
    } else {
      
    }
  }
  
  // show registers
  for (var i=0; i < registers.length; i++) {
    registers[i].show();
  }
  
  // if pc is greater than the number of instructions, the program ends
  if (pc >= instructions.length) {
    noLoop();
  }
  
}

function Register(index) {
  this.index = index;
  this.x = 15 + (this.index % 10) * xscl;
  this.y = 50 + floor(this.index / 10) * yscl;
  this.val = 0;
  this.used = false;
  
  this.show = function() {
    push();
    if (this.used) {
      fill(255,200,200);
    } else {
      noFill();
    }
    translate(this.x,this.y);
    rect(0,0,w,w);
    fill(0);
    textSize(12);
    textAlign(CENTER);
    text(this.val,w/2,w/2);
    pop();
    this.used = false;
  }
  
  this.increment = function() { 
    this.val++;
    this.used = true;
  }
  this.decrement = function() { 
    this.val--;
    this.used = true;
  }
  this.getValue = function() {
    this.used = true;
    return this.val;
  }
}