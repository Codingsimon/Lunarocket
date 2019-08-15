var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var ctxRocket = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

var bgColor = "grey";
var rocketColor = "green";

var mountains = [];
var mountainResolution = 200;
var landingstage = randomIntFromRange(20, mountainResolution - 20);
var stagesize = 5;

var thrustpower = -0.5;
var turnpower = 0.01;
var gravstrength = 0.0125;
var landersize = 15;

var xpos = canvas.width/2
var ypos = 50;
var xvel = 0;
var yvel = 0;
var rad = 0;
var spin = 0;
var boosting = false;
var turnleft = false;
var turnright = false;
var thrust = 0;


document.addEventListener( 'keydown', (event) => {
    if(event.keyCode == 32){
        boosting = true;
    }
});

document.addEventListener( 'keydown', (event) => {
    if(event.keyCode == 65){
        turnright = true;
    }
});
         
document.addEventListener( 'keydown', (event) => {
    if(event.keyCode == 68){
        turnleft = true;
    }
});

function printdeg(ra){
    console.log("Orientation: " + (ra * Math.PI/180) + " degrees");
}

function control(){
    if(boosting){
        thrust += thrustpower;
    }
    if(turnleft){
        spin += turnpower
        turnleft = false;
    }
    if(turnright){
        spin -= turnpower
        turnright = false;
    }
}

function gravity(){
    yvel += gravstrength;
}

function posUpdate(){
    // console.log("pre posUpdate" + xpos);
    // console.log("pre posUpdate" + ypos);
    xpos -= xvel;
    ypos += yvel;
}

function turn(){
    printdeg(rad);
    console.log("spin is "+spin)
    rad += spin;
    rad = rad % 360;
    spin = 2999*spin/3000;
    rad = 19*rad/20;
    printdeg(rad);
}

function boost(){
    yvel += Math.cos(rad)*thrust;
    xvel += Math.sin(rad)*thrust;
    console.log(Math.cos(rad)*thrust);
    
    thrust = 0;
    boosting = false;
}

function gametick(){
    control();

    // console.log("xpos:"+xpos);
    // console.log("ypos:"+ypos);
    // console.log("xvel:"+xvel);
    // console.log("yvel:"+yvel);
    // console.log()
    // console.log("rad:"+rad);
    // console.log("spin:"+spin);
    
    gravity();
    turn();
    boost();
    posUpdate();
    
    
}

function randomIntFromRange(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function init(){
    //terrain fillup with random numbers
    var variance = 5;
    mountains[0] = 10;
    for( var i = 1; i < mountainResolution; i++){
        mountains[i] = randomIntFromRange(mountains[i -1] - variance, mountains[i -1] + variance);
    }
            
    //create all mountains
    var mountainamount = Math.random() * 7;
    for(var j = 0; j < mountainamount; j++){

    //create singel higher mountains
    var groth = 2;
    var grothvalue = 5;
    // var start = 100;
    var start = randomIntFromRange(0, mountainResolution);
    var end = randomIntFromRange(start, start + 200);
    // var end = 400;
    var peak = start + ((end - start) / 2);
    for( var i = start; i < end; i++){
        mountains[i] = mountains[i] + groth;

        if(i < peak){
            groth = groth + grothvalue;
        } else {
            groth = groth - grothvalue;
        }  
    }

    }
    
    //bring values back in screen
    for( var i = 1; i < mountains.length; i++){
        if(mountains[i] < 10){
            mountains[i] = randomIntFromRange(15,25);
        }
        if(mountains[i] > canvas.height - 200){
            mountains[i] = canvas.height - 200 - randomIntFromRange(0,10);
        }
    }
    
    //landingstage
    var stageheight = mountains[landingstage];
    for(var i = landingstage; i < landingstage + stagesize; i++){
        mountains[i] = stageheight;
    }

}

function drawBG(){
    ctx.beginPath();
    // ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(30, 30, 155, 350);
    ctx.fillStyle = bgColor;
    ctx.fill();
    ctx.stroke();
}

function drawRocket(){
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = 'red';
    ctx.fillRect(0,0,10,10);
    ctx.translate(xpos, ypos);
    ctx.rotate(rad * 1000);
    ctx.fillStyle = rocketColor;
    ctx.fillRect(0, 0, 10, 30); 
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
}

function drawTerrain(){
    ctx.beginPath();
    
    ctx.fillStyle = 'red';
    ctx.fillRect(canvas.width / mountainResolution * landingstage, canvas.height - 5 - mountains[landingstage], canvas.width / mountainResolution * stagesize - 10, 10);

    ctx.moveTo(0, canvas.height - mountains[0]); 
    for(var i = 0; i < mountains.length; i++){
        ctx.lineTo(canvas.width / mountainResolution * i, canvas.height - 5 - mountains[i]);
    }
    ctx.lineTo(canvas.width * 2, mountains[mountains.length]);
    ctx.stroke();
    ctx.closePath();
}

function drawRotatableLander(){
    ctx.beginPath();
    ctx.fillStyle = 'red';
    s = Math.sin(rad);
    c = Math.cos(rad);
    l = landersize;
    lh = landersize/2;

    lux = c*(-lh)-(s*(-lh)); //-lh
    luy = s*(-lh)+(c*(-lh)); //-lh
    rux = c*(lh)-(s*(-lh)); //lh
    ruy = s*(lh)+(c*(-lh)); //-lh
    llx = c*(-l)-(s*(l)); //-l
    lly = s*(-l)+(c*(l)); //l
    rlx = c*(l)-(s*(l)); //l
    rly = s*(l)+(c*(l)); //l

    ctx.moveTo(xpos + rux, ypos + ruy); //lu
    ctx.lineTo(xpos + lux, ypos + luy); //ru
    ctx.lineTo(xpos + llx, ypos + lly); //rl
    ctx.lineTo(xpos + rlx, ypos + rly); //ll
    ctx.lineTo(xpos + rux, ypos + ruy); //lu
    ctx.stroke();
}
    



function draw() {
    
    ctx.fillStyle = 'rgb(255,255,255)';
    ctx.fillRect(0,0,canvas.width, canvas.height);

    // drawBG();
    gametick();
    // drawRocket();
    drawRotatableLander();
    
    
    drawTerrain();

    

    requestAnimationFrame(draw);
}

init();
requestAnimationFrame(draw);