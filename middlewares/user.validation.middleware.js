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
    // TODO: Implement validatior for user entity during update

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

exports.createUserValid = createUserValid;
exports.updateUserValid = updateUserValid;