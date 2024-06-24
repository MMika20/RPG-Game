let coins = 0;

export default {
    getCoins() {
        return coins;
    },

    addCoins(amount) {
        coins += amount;
    },

    resetCoins() {
        coins = 0;
    }
};
