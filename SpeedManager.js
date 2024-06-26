// SpeedManager.js
let speed = 70; // Beispielwert

const increaseSpeed = (amount) => {
    speed += amount;
};

const getSpeed = () => {
    return speed;
};

export default { increaseSpeed, getSpeed };
