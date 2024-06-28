// SpeedManager.js
let speed = 70; // Startgeschwindigkeit

const increaseSpeed = (amount) => {
    speed += amount;
};

const getSpeed = () => {
    return speed;
};

export default { increaseSpeed, getSpeed };
