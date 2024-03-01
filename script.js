const SHAPES = [
  [
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0]
  ],
  [
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 1]
  ],
  [
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 0]
  ],
  [
    [1, 1, 0],
    [0, 1, 1],
    [0,0,0]

  ],
  [
    [0, 1, 1],
    [1, 1, 0],
    [0,0,0]
  ],
  [
    [1, 1, 1],
    [0, 1, 0],
    [0,0,0]
    
  ],
  [
    [1, 1],
    [1, 1]
  ],
];

const COLORS = [
  "#fff",
  "#9b5fe0",
  "#5ED515",
  "#15D52C",
  "#15D52C",
  "#1515D5",
  "#9B15D5",
  "#D51544",
];

const ROWS = 20;
const COLS = 10;

let canvas = document.querySelector("#tetris");
let scoreboard=document.querySelector("h2")
let ctx = canvas.getContext("2d");
ctx.scale(30, 30);

let pieceobj = null;
let grid= generateGrid();
let score=0
console.log(grid);
// console.log(pieceobj);
function generaterandomPiece() {
  let ran = Math.floor(Math.random() * 7);
  //   console.log(SHAPES[ran]);
  let piece = SHAPES[ran];
  let colorindex = ran + 1;
  let x = 4;
  let y = 0;
  return { piece, x, y, colorindex };
}


setInterval(newGamesState,500);
function newGamesState()
{
  checkGrid()
  if(pieceobj==null)
  {
    pieceobj=generaterandomPiece();
    renderpiece();
  }
  moveDown();
}

// 80 93 100 102
function checkGrid(){
  let count=0;
  for(let i=0;i<grid.length;i++)
  {
    let allfilled=true
    for(let j=0;j<grid[0].length;j++)
    {
      if(grid[i][j]==0)
      {
        allfilled=false
      }
    }
    if(allfilled)
    {
      count++;
      grid.splice(i,1);
      grid.unshift([0,0,0,0,0,0,0,0,0,0])
    }
  }
  if(count==1)
  {
    score+=10
  }
  scoreboard.innerHTML="Score: "+score
}

function renderpiece() {
  let piece = pieceobj.piece;
  for (let i = 0; i < piece.length; i++) {
    for (let j = 0; j < piece[i].length; j++) {
      if (piece[i][j] == 1) {
        ctx.fillStyle = COLORS[pieceobj.colorindex];
        ctx.fillRect(pieceobj.x + j,pieceobj.y+i, 1, 1);
      }
    }
  }
}

function moveLeft(){
  if(!collision(pieceobj.x-1,pieceobj.y))
    pieceobj.x-=1;
  renderGrid();
}

function moveRight(){
  if(!collision(pieceobj.x+1,pieceobj.y))
    pieceobj.x+=1;
  renderGrid();
}

function rotate(){
  let rotatedpiece=[];
  let piece=pieceobj.piece
  for(let i=0;i<piece.length;i++)
  {
    rotatedpiece.push([])
    for(let j=0;j<piece[i].length;j++)
    {
      rotatedpiece[i].push(0);  
    }
  }

  for(let i=0;i<piece.length;i++)
  {
    for(let j=0;j<piece[i].length;j++)
    {
      rotatedpiece[i][j]=piece[j][i]
    }
  }

  for(let i=0;i<rotatedpiece.length;i++)
  {
    rotatedpiece[i]=rotatedpiece[i].reverse()
  }
  if(!collision(pieceobj.x,pieceobj.y,rotatedpiece))
  {
    pieceobj.piece=rotatedpiece
  }
  renderGrid();
}



function moveDown() {
  if(!collision(pieceobj.x,pieceobj.y+1))
    pieceobj.y+=1;
  else{
      for(let i=0;i<pieceobj.piece.length;i++)
      {
        for(let j=0;j<pieceobj.piece[i].length;j++)
        {
          if( pieceobj.piece[i][j]==1)
          {
            let p=pieceobj.x+j;
            let q=pieceobj.y+i;
            grid[q][p]=pieceobj.colorindex
          }
        }
        
      }
      if(pieceobj.y==0){
        alert("The Game is Over")
        grid=generateGrid()
        score=0
      }
      pieceobj=null;
  }
    renderGrid();
}


function collision(x,y,rotatedpiece){
  let piece=rotatedpiece || pieceobj.piece;
  for(let i=0;i<piece.length;i++)
  {
    for(let j=0;j<piece[i].length;j++)
    {
      if(piece[i][j]==1)
      {
        let p=x+j;
        let q=y+i;
        if(p>=0 && p<COLS && q>=0 && q<ROWS)
        {
            if(grid[q][p]>0)
            return  true;
        }
        else{
          return true;
        }
      }
    }
  }
  return false;
}

function generateGrid(){
  let grid=[];
  for(let i=0;i<ROWS;i++)
  {
    grid.push([])
    for(let j=0;j<COLS;j++)
    {
        grid[i].push(0);

    }
  }
  return grid;  
}


function renderGrid(){
    for(let i=0;i<grid.length;i++)
    {
      for(let j=0;j<grid[i].length;j++)
      {
        ctx.fillStyle=COLORS[grid[i][j]];
        ctx.fillRect(j,i,1,1)
      }
    }
    renderpiece();
}

document.addEventListener("keydown",function(e){
  let key=e.code;
  if(key=="ArrowDown")
  {
    moveDown();
  }
  else if(key=="ArrowLeft")
  {
    moveLeft();
  }
  else if(key=="ArrowRight")
  {
    moveRight();
  }
  else if(key=="ArrowUp")
  {
    rotate();
  }
})