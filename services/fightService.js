const { FightRepository } = require("../repositories/fightRepository");

class FightersService {
    getAll() {
        return FightRepository.getAll();
    }

    create(fight) {
        return FightRepository.create(fight);
    }
}

module.exports = new FightersService();