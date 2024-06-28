import GameUI from "./scenes/GameUI";

let health = 5; // Startleben

const increaseHealth = (amount) => {
    health += amount;
};

const getHealth = () => {
    return health;
};

export default { increaseHealth, getHealth };
