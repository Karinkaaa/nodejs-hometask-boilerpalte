const { fighter } = require("../models/fighter");
const FighterService = require("../services/fighterService");
const { ResponseError } = require("./response.middleware");
const { isExistKeysInTemplateObject, isEqualObjectKeys } = require("./user.validation.middleware");

const createFighterValid = (req, res, next) => {
    const { id, ...fighterTemplate } = fighter;
    const incomeFighter = { health: 100, attack: 5, ...req.body };

    if (isEqualObjectKeys(fighterTemplate, incomeFighter)) {
        const { name, power, defense, health } = incomeFighter;

        if (isValidPower(power) &&
            isValidDefense(defense) &&
            isValidHealth(health) &&
            isUniqueValueInFighterDB("name", new RegExp(name, "i"))
        ) {
            return next();
        }
    }
    res.err = new ResponseError("Fighter entity to create isn't valid", 400);
    next();
};

const updateFighterValid = (req, res, next) => {
    const { id, ...fighterTemplate } = fighter;
    const item = FighterService.search({ id: req.params.id });
    const incomeFighter = req.body;

    if (!item) {
        res.err = new ResponseError("Fighter not found", 404);
    } else if ((incomeFighter && Object.keys(incomeFighter).length === 0) ||
        !isExistKeysInTemplateObject(incomeFighter, fighterTemplate) ||
        !isValidFighterEntityToUpdate(incomeFighter) ||
        !isUniqueValueInFighterDB("name", new RegExp(incomeFighter.name, "i"))
    ) {
        res.err = new ResponseError("Fighter entity to update isn't valid", 400);
    }
    next();
};

const isValidPower = (power) => {
    return power > 1 && power < 100;
};

const isValidDefense = (defense) => {
    return defense > 1 && defense < 10;
};

const isValidHealth = (health) => {
    return health > 80 && health < 120;
};

const isUniqueValueInFighterDB = (key, value) => {
    if (value instanceof RegExp) {
        return !FighterService.getAll().find((fighter) => value.test(fighter[key]));
    }
    return !FighterService.search({ [key]: value });
};

const isValidFighterValue = (key, value) => {
    if (value === "") {
        return false;
    } else if (key === "power") {
        return isValidPower(value);
    } else if (key === "defense") {
        return isValidDefense(value);
    } else if (key === "health") {
        return isValidHealth(value);
    } else {
        return true;
    }
};

const isValidFighterEntityToUpdate = (fighter) => {
    return Object.entries(fighter).every(([key, value]) => isValidFighterValue(key, value));
};

exports.createFighterValid = createFighterValid;
exports.updateFighterValid = updateFighterValid;