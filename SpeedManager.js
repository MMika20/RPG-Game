// SpeedManager.js
let speed = 270; // Beispielwert

const increaseSpeed = (amount) => {
    speed += amount;
};

const getSpeed = () => {
    return speed;
};

export default { increaseSpeed, getSpeed };
