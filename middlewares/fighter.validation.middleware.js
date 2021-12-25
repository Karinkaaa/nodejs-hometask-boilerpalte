const { fighter } = require("../models/fighter");
const FighterService = require("../services/fighterService");
const { ResponseError } = require("./response.middleware");
const { isEqualObjectKeys } = require("./user.validation.middleware");

const createFighterValid = (req, res, next) => {
    // TODO: Implement validation for fighter entity during creation

    const { id, ...fighterTemplate } = fighter;
    const incomeFighter = { health: 100, ...req.body };

    if (isEqualObjectKeys(fighterTemplate, incomeFighter)) {
        const { name, power, defense, health } = incomeFighter;

        if (isValidPower(power) &&
            isValidDefense(defense) &&
            isValidHealth(health) &&
            isUniqueValueInFighterDB("name", name)
        ) {
            return next();
        }
    }
    res.err = new ResponseError("Fighter entity to create isn't valid", 400);
    next();
};

const updateFighterValid = (req, res, next) => {
    // TODO: Implement validatior for fighter entity during update
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
    return !FighterService.search({ [key]: value });
};

exports.createFighterValid = createFighterValid;
exports.updateFighterValid = updateFighterValid;