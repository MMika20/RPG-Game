let coins = 20000;

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
        return false; // If not enough coins
    },

    coinText(scene, x, y, amount) {
        const text = scene.add.text(x, y, `+${amount}`, { fontSize: '12px', fill: '#ffffff' }).setOrigin(0.5);

        // Timer to remove the text after a short time
        scene.time.delayedCall(1000, () => {
            text.destroy();
        });
    },

    resetCoins() {
        coins = 0;
    }
};
