class GameState {
    constructor() {
        this.health = 5;
        this.charakter = null;
    }

    getHealth() {
        return this.health;
    }

    setHealth(health) {
        this.health = health;
    }

    setCharakter(charakter) {
        this.charakter = charakter;
    }

    getCharakter() {
        return this.charakter;
    }
}

export default new GameState();
