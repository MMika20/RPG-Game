// SpeedManager.js
let speed = 270; // Startgeschwindigkeit

const increaseSpeed = (amount) => {
    speed += amount;
};

const getSpeed = () => {
    return speed;
};

export default { increaseSpeed, getSpeed };
