const { UserRepository } = require("../repositories/userRepository");

class UserService {
    getAll() {
        return UserRepository.getAll();
    }

    search(search) {
        const item = UserRepository.getOne(search);
        if (!item) {
            return null;
        }
        return item;
    }

    create(user) {
        return UserRepository.create(user);
    }

    update(id, user) {
        return UserRepository.update(id, user);
    }

    delete(id) {
        const items = UserRepository.delete(id);
        if (!items.length) {
            return null;
        }
        return items[0];
    }
}

module.exports = new UserService();