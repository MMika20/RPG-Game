// CoinCounter.js
let coins = 12000;

export default {
    getCoins() {
        return coins;
    },

    addCoins(amount) {
        coins += amount;
    },

    subtractCoins(amount) {
        if (coins >= amount) {
            coins -= amount;
            return true;
        }
        return false; // Wenn nicht genügend Coins vorhanden sind
    },

    resetCoins() {
        coins = 0;
    }
};
