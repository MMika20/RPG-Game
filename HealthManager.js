import GameUI from "./scenes/GameUI";
import sceneEvents from "./events/EventsCenter";

class HealthManager {
    static health = 5; // Beispielwert, kann nach Bedarf angepasst werden

    static increaseHealth(amount) {
        this.health += amount;
        sceneEvents.emit('player-health-changed', this.health);
    }

    static getHealth() {
        return this.health;
    }

    static setHealth(health) {
        this.health = this.health;
        sceneEvents.emit('player-health-changed', this.currentHealth);
    }
}

export default HealthManager;
