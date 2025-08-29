

let animationId = null;

const canvas = document.getElementById('rocketCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 600;

ctx.fillStyle = "white";
ctx.fillRect(190, 500, 20, 50);


const g = 9.81; 
let rocketX = 190; 
let rocketY = 500;
let velocity = 0;
let acceleration = 0;
let time = 0;
let running = false;
let safetyFactor = 1.05;
let burnTime = 0;

// calling the drawRocket function so that the rocket can appear before launch 
drawRocket();


//click listener to be able to tell when the launch button is hit 

document.getElementById("launchButton").addEventListener("click", () => {


    const mass = parseFloat(document.getElementById("mass").value);
    const thrust = parseFloat(document.getElementById("thrust").value);
    burnTime = parseFloat(document.getElementById("burnTime").value);
    const dragCoefficient = parseFloat(document.getElementById("drag").value);



    // minimum thurst alert to tell the user they need more thrust to move the rocket upward
    let minimumThrust = Math.round(mass * g * safetyFactor);

    if (thrust < minimumThrust){
         document.getElementById("vel").textContent = `⚠️ Thrust too low! Minimum: ${minimumThrust} N`;

    return;
    }



    rocketY = 500;
    velocity = 0;
    acceleration = 0;
    time = 0;
    running = true;

    if (animationId) {
    cancelAnimationFrame(animationId);
}


    animate(mass, thrust, burnTime, dragCoefficient);

});


function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawRocket() {
    clearCanvas();      

    // rectangle
    ctx.fillStyle = "white";
    ctx.fillRect(rocketX, rocketY, 20, 50);; 


    // triangle
    ctx.beginPath();
    ctx.moveTo(rocketX + 10, rocketY - 15); 
    ctx.lineTo(rocketX, rocketY);          
    ctx.lineTo(rocketX + 20, rocketY);      
    ctx.closePath();
    ctx.fillStyle = "white";
    ctx.fill();   

    // left wing 
    ctx.beginPath();
    ctx.moveTo(rocketX, rocketY + 30);
    ctx.lineTo(rocketX - 10, rocketY + 50);
    ctx.lineTo(rocketX, rocketY + 50); 
    ctx.closePath();
    ctx.fill();

    // right wing 
    ctx.beginPath();
    ctx.moveTo(rocketX + 20 , rocketY + 30);
    ctx.lineTo(rocketX + 30 , rocketY + 50);
    ctx.lineTo(rocketX + 20, rocketY  + 50);
    ctx.closePath();
    ctx.fill();








    // burn time flame 
    if (time < burnTime) {
    let flameHeight = 10 + Math.random() * 5; 
    let flameGradient = ctx.createLinearGradient(rocketX + 10, rocketY + 50, rocketX + 10, rocketY + 50 + flameHeight);
    flameGradient.addColorStop(0, "yellow");
    flameGradient.addColorStop(1, "red"); 
    ctx.beginPath();
    ctx.moveTo(rocketX + 10, rocketY + 50); 
    ctx.lineTo(rocketX, rocketY + 50 + flameHeight); 
    ctx.lineTo(rocketX + 20, rocketY + 50 + flameHeight); 
    ctx.closePath();
    ctx.fillStyle = "orange";
    ctx.fill();
    
}
}




// this function will update the rocket with the inputted peramters 
function updateRocket( mass, thrust, burnTime, dragCoefficient){
    const dt = 0.1;


    time += dt;

    // this will apply thrust only while burning 
    let currentThrust = time < burnTime ? thrust : 0; 
    // 
    let drag = dragCoefficient * velocity * velocity  * Math.sign(velocity);

    acceleration = (currentThrust - mass  * g - drag ) / mass;

    //Update Velocity 

    velocity += acceleration * dt;


    rocketY -=  velocity * dt * 20; //scale factor for visibility 

    // telemetry data
    document.getElementById("vel").textContent = `Velocity: ${velocity.toFixed(2)} m/s`;
    document.getElementById("acc").textContent = `Acceleration: ${acceleration.toFixed(2)} m/s²`;
    document.getElementById("fuel").textContent = `Fuel time left: ${Math.max(0, (burnTime - time)).toFixed(2)} s`;
    document.getElementById("netAcc").textContent = `Net Acceleration: ${acceleration.toFixed(2)} m/s²`;
    console.log({rocketY, velocity, acceleration, time});

}



function animate( mass, thrust, burnTime, dragCoefficient) {


    if (!running) return;
    if (rocketY < -60 || rocketY > 700) {
        running = false;
        return;
    }

    updateRocket(mass, thrust, burnTime, dragCoefficient);    
    drawRocket();      
    animationId = requestAnimationFrame(() => animate(mass, thrust, burnTime, dragCoefficient));


     
}
