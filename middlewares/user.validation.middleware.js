const { user } = require("../models/user");
const UserService = require("../services/userService");
const { ResponseError } = require("./response.middleware");

const createUserValid = (req, res, next) => {
    const { id, ...userTemplate } = user;
    const { email, phoneNumber, password } = req.body;

    if (isEqualObjectKeys(userTemplate, req.body) &&
        isValidEmail(email) &&
        isValidPhoneNumber(phoneNumber) &&
        isValidPassword(password) &&
        isUniqueValueInUserDB("email", email) &&
        isUniqueValueInUserDB("phoneNumber", phoneNumber)
    ) {
        return next();
    }

    res.err = new ResponseError("User entity to create isn't valid", 400);
    next();
};

const updateUserValid = (req, res, next) => {
    const { id, ...userTemplate } = user;
    const item = UserService.search({ id: req.params.id });
    const incomeUser = req.body;

    if (!item) {
        res.err = new ResponseError("User not found", 404);
    } else if ((incomeUser && Object.keys(incomeUser).length === 0) ||
        !isExistKeysInTemplateObject(incomeUser, userTemplate) ||
        !isValidUserEntityToUpdate(incomeUser)
    ) {
        res.err = new ResponseError("User entity to update isn't valid", 400);
    }
    next();
};

const isEqualObjectKeys = (obj1, obj2) => {
    const objKeys1 = Object.keys(obj1).sort();
    const objKeys2 = Object.keys(obj2).sort();

    return objKeys1.length === objKeys2.length && objKeys1.every((value, index) => value === objKeys2[index]);
};

const isValidEmail = (email) => {
    const pattern = /[a-z0-9]+@gmail\.com/;
    return pattern.test(String(email).toLowerCase());
};

const isValidPhoneNumber = (phoneNumber) => {
    const pattern = /^\+380\d{3}\d{2}\d{2}\d{2}$/;
    return pattern.test(phoneNumber);
};

const isValidPassword = (password) => {
    return password.length > 2;
};

const isUniqueValueInUserDB = (key, value) => {
    return !UserService.search({ [key]: value });
};

const isExistKeysInTemplateObject = (obj, objTemplate) => {
    const objKeys1 = Object.keys(obj);
    const objKeys2 = Object.keys(objTemplate);

    return objKeys1.every((key) => objKeys2.includes(key));
};

const isValidUserValue = (key, value) => {
    if (value === "") {
        return false;
    } else if (key === "email") {
        return isValidEmail(value);
    } else if (key === "phoneNumber") {
        return isValidPhoneNumber(value);
    } else if (key === "password") {
        return isValidPassword(value);
    } else {
        return true;
    }
};

const isValidUserEntityToUpdate = (fighter) => {
    return Object.entries(fighter).every(([key, value]) => isValidUserValue(key, value));
};

exports.createUserValid = createUserValid;
exports.updateUserValid = updateUserValid;
exports.isEqualObjectKeys = isEqualObjectKeys;
exports.isExistKeysInTemplateObject = isExistKeysInTemplateObject;