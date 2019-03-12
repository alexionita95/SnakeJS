const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const rectWidth=16;

//const BG="#121220"
const BG="#50C878"
//const SQUARE="#3895D3"
const SQUARE="#00AA00"
//const BORDER="#1261A0"
const BORDER="#000000"

//const FOOD_BORDER="#770000"
const FOOD_BORDER="#000000"
//const FOOD_BG="#FF0000";
const FOOD_BG="#FFFF00";
//const WALL_BG="#1261A0"
const WALL_BG="#B22222"
//const WALL_BORDER="#072F5F"
const WALL_BORDER="#000000"
const WIDTH=240;
const HEIGHT=288;
var snake=[];
var head={x:0,y:0};
var food={x:0,y:0};
var walls=[]
var dir=0;
var score=0;
var scoreIncrement=100;
var running=true;
var pause=false;
function initWalls()
{
	rows = Math.floor(HEIGHT/rectWidth);
	cols = Math.floor(WIDTH/rectWidth);
	for(i=0;i<rows;++i)
	{
		walls[i]=[];
		for(j=0;j<cols;++j)
			walls[i][j]=0;
	}
	addWall(0,0,cols,0);
	addWall(0,rows-1,cols,0);
	addWall(0,0,rows,1);
	addWall(cols-1,0,rows,1);
}
function addWall(x,y,l,d)
{
	switch(d){
	case 0:
	for(i=x;i<x+l;++i)
		walls[y][i]=1;
	break;
	case 1:
	for(i=y;i<y+l;++i)
		walls[i][x]=1;
	break;
	}
}
function initSnake()
{
	snake=[];
	x= Math.floor(Math.floor(WIDTH/rectWidth)/2)*rectWidth;
	y=Math.floor(Math.floor(HEIGHT/rectWidth)/2)*rectWidth;
	snake.push({x:x-3*rectWidth,y:y});
	snake.push({x:x-2*rectWidth,y:y});
	snake.push({x:x-rectWidth,y:y});
	head={x:x,y:y};
	snake.push(head);
	initWalls();
	generateFood();
	score=0;
	running=true;
	dir=0;

}
function drawWalls()
{
	rows = Math.floor(HEIGHT/rectWidth);
	cols = Math.floor(WIDTH/rectWidth);
	for(i=0;i<rows;++i)
	{
		for(j=0;j<cols;++j)
			if(walls[i][j]==1)
			drawSquare(j*rectWidth,i*rectWidth,WALL_BG,WALL_BORDER);
	}
}
function drawBoard()
{
	context.fillStyle = BG;
	context.fillRect(0,0,WIDTH,HEIGHT);
	drawWalls();
	/*for(y=0;y<500;y+=rectWidth)
	for(x=0;x<500; x+=rectWidth)
		context.strokeRect(x,y, rectWidth, rectWidth);*/
}
function move()
{
	snake.shift();
	addHead();
	eat();
	running=!checkGameOver();	
}
function isPositionFree(x,y)
{
	i=Math.floor(y/rectWidth);
	j=Math.floor(x/rectWidth);
	if(walls[i][j]==1)
		return false;
	for(i=0;i<snake.length;++i)
	if(snake[i].x==x && snake[i].y==y)
		return false;
	return true;
}
function generateFood()
{
	x=Math.floor(Math.random()*(WIDTH/rectWidth))*rectWidth;
	y=Math.floor(Math.random()*(HEIGHT/rectWidth))*rectWidth;
	food.x=x;
	food.y=y;
	if(!isPositionFree(x,y))
		generateFood();
}

function addHead()
{
	switch(dir)
	{
		case 0:{
		x=head.x+rectWidth;
		head={x:x,y:head.y};
		snake.push(head);
		}
		break;
		case 1:
		{
		x=head.x-rectWidth;
		head={x:x,y:head.y};
		snake.push(head);
		}
		break;
		case 2:
		{
		y=head.y+rectWidth;
		head={x:head.x,y:y};
		snake.push(head);
		}
		break;
		case 3:
		{
		y=head.y-rectWidth;
		head={x:head.x,y:y};
		snake.push(head);
		}
		break;
	}
}
function eat()
{
	if(food.x==head.x && food.y==head.y)
	{
		addHead();
		generateFood();
		render();
		score+= scoreIncrement;
	}
}
function checkDirColision(x,y)
{
	switch(dir)
	{
		case 0:{
			checkJ=Math.floor((head.x)/rectWidth);
			checkI=Math.floor(head.y/rectWidth);
			if((head.x+rectWidth == x && head.y==y) || walls[checkI][checkJ]==1)
				return true;

		}
		break;
		case 1:
		{
			checkJ=Math.floor((head.x)/rectWidth);
			checkI=Math.floor(head.y/rectWidth);
			if((head.x-rectWidth == x && head.y==y) || walls[checkI][checkJ]==1)
				return true;
		}
		break;
		case 2:
		{
		checkJ=Math.floor(head.x/rectWidth);
		checkI=Math.floor((head.y)/rectWidth);
		if((head.y+rectWidth === y && head.x===x) || walls[checkI][checkJ]==1)
				return true;
		}
		break;
		case 3:
		{
			checkJ=Math.floor(head.x/rectWidth);
			checkI=Math.floor((head.y)/rectWidth);
			if((head.y-rectWidth === y && head.x===x) || walls[checkI][checkJ]==1)
				return true;
		}
		break;
	}
	return false;
}
function checkGameOver()
{
	result=false;
	for(i=0;i<snake.length-1;++i)
		if(checkDirColision(snake[i].x,snake[i].y)==true)
			return true;
return false;
}
function loop()
{
if(!pause){
if(running)
{
	move();
	render();
	
}
else
{
	renderGameOver();
}
}
else
{
	renderPauseScreen();
}
}
function render()
{
	drawBoard();
	drawSquare(food.x,food.y,FOOD_BG,FOOD_BORDER);
	for(i=0;i<snake.length;++i)
		drawSquare(snake[i].x,snake[i].y,SQUARE,BORDER);
	document.getElementById("score").innerText="Score: "+score;
}
function renderPauseScreen()
{
	pWidth=300;
	pHeight=200;
	offset=5;
	x=WIDTH/2-pWidth/2;
	y=HEIGHT/2-pHeight/2;
	context.fillStyle = BORDER;
	context.fillRect(x,y,pWidth,pHeight);
	context.fillStyle = BG;
	context.fillRect(x+offset,y+offset,pWidth-2*offset,pHeight-2*offset);
	context.fillStyle = "white";
	context.font = "bold 50px Arial";
	context.textAlign = "center"
	tX = WIDTH/2
	tY = HEIGHT/2+10;
	context.fillText("PAUSE", tX, tY);
	
}
function renderGameOver()
{
	pWidth=300;
	pHeight=200;
	offset=5;
	x=WIDTH/2-pWidth/2;
	y=HEIGHT/2-pHeight/2;
	context.fillStyle = BORDER;
	context.fillRect(x,y,pWidth,pHeight);
	context.fillStyle = BG;
	context.fillRect(x+offset,y+offset,pWidth-2*offset,pHeight-2*offset);
	context.fillStyle = "white";
	context.font = "bold 30px Arial";
	context.textAlign = "center"
	tX = WIDTH/2
	tY = HEIGHT/2;
	context.fillText("GAME OVER", tX, tY);
    context.font = "bold 20px Arial";
	context.fillText("SCORE: "+score, tX, tY+30);
}
function drawSquare(x,y,color,border)
{

	context.fillStyle = color;
	context.fillRect(x,y,rectWidth,rectWidth);
	context.strokeStyle=border;
	context.lineWidth = 2;
	context.strokeRect(x,y, rectWidth, rectWidth);
}

function changeDir(d)
{
	if(running && !pause){
	if((d!=0 && d!=1) && (dir==0 || dir==1)){
		dir=d;
	}
	if((d!=2 && d!=3) && (dir==2 || dir==3)){
		dir=d;

	}
	else
	{
	  if(d==dir)
		move();
	}
	render();
	}	
}
function handle(e)
{
	var key = e.keyCode;
	switch(key)
	{
		case 37:
		changeDir(1);
		break;
		case 38:
		changeDir(3);
		break;
		case 39:
		changeDir(0);
		break;
		case 40:
		changeDir(2);
		break;
		case 82:
		initSnake();
		break;
		case 32:
		pause=!pause;
		break;
	}
}
initSnake();
document.addEventListener("keydown", handle, false);
setInterval(loop,200);