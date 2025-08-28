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


document.getElementById("launchButton").addEventListener("click", () => {


    const mass = parseFloat(document.getElementById("mass").value);
    const thrust = parseFloat(document.getElementById("thrust").value);
    const burnTime = parseFloat(document.getElementById("burnTime").value);
    const dragCoefficient = parseFloat(document.getElementById("drag").value);


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

    ctx.fillStyle = "white";
    ctx.fillRect(rocketX, rocketY, 20, 50);;  
}

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

    document.getElementById("vel").textContent = `Velocity: ${velocity.toFixed(2)} m/s`;
    document.getElementById("acc").textContent = `Acceleration: ${acceleration.toFixed(2)} m/s²`;
    document.getElementById("fuel").textContent = `Fuel time left: ${Math.max(0, (burnTime - time)).toFixed(2)} s`;
    document.getElementById("netAcc").textContent = `Net Acceleration: ${acceleration.toFixed(2)} m/s²`;
    console.log({rocketY, velocity, acceleration, time});

}



function animate( mass, thrust, burnTime, dragCoefficient) {


    if (!running) return;
    if (rocketY < -50) {
        running = false;
        return;
    }
    updateRocket(mass, thrust, burnTime, dragCoefficient);    
    drawRocket();      
    animationId = requestAnimationFrame(() => animate(mass, thrust, burnTime, dragCoefficient));


     
}
