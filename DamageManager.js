
let dmg = 1; // Startschaden von Pfeilen

const increaseDamage = (amount) => {
    dmg += amount;
};

const getDamage = () => {
    return dmg;
};

export default { increaseDamage, getDamage };
