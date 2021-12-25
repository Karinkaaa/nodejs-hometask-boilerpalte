const { FighterRepository } = require("../repositories/fighterRepository");

class FighterService {
    getAll() {
        return FighterRepository.getAll();
    }

    search(search) {
        const item = FighterRepository.getOne(search);
        if (!item) {
            return null;
        }
        return item;
    }

    create(fighter) {
        return FighterRepository.create({ health: 100, ...fighter });
    }

    update(id, fighter) {
        return FighterRepository.update(id, fighter);
    }

    delete(id) {
        const items = FighterRepository.delete(id);
        if (!items.length) {
            return null;
        }
        return items[0];
    }
}

module.exports = new FighterService();