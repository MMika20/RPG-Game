class KillCounter {
    constructor() {
        this.orcKills = 0;
        this.necromancerKills = 0;
    }

    incrementOrcKills() {
        this.orcKills += 1;
    }

    incrementNecromancerKills() {
        this.necromancerKills += 1;
    }

    getOrcKills() {
        return this.orcKills;
    }

    getNecromancerKills() {
        return this.necromancerKills;
    }
}

export default new KillCounter();
