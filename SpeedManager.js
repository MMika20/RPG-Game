// SpeedManager.js
let speed = 170; // Beispielwert

const increaseSpeed = (amount) => {
    speed += amount;
};

const getSpeed = () => {
    return speed;
};

export default { increaseSpeed, getSpeed };
