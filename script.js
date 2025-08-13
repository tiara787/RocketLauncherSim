const canvas = document.getElementById('rocketCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 600;

ctx.fillStyle = "white";
ctx.fillRect(190, 500, 20, 50);

let rocketX = 190; 
let rocketY = 500;


function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawRocket() {
    clearCanvas();      

    ctx.fillStyle = "white";
    ctx.fillRect(rocketX, rocketY, 20, 50);;  
}

function updateRocket(){
    rocketY -= 2;
}


function animate() {
    updateRocket();    
    drawRocket();      
    requestAnimationFrame(animate);  
}

animate(); 