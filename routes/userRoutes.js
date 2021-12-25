const { Router } = require("express");
const UserService = require("../services/userService");
const { createUserValid, updateUserValid } = require("../middlewares/user.validation.middleware");
const { responseMiddleware, ResponseError } = require("../middlewares/response.middleware");

const router = Router();

router.get("/", (req, res, next) => {
    res.data = UserService.getAll();
    next();
}, responseMiddleware);

router.get("/:id", (req, res, next) => {
    const user = UserService.search(req.params);

    if (user) {
        res.data = user;
    } else {
        res.err = new ResponseError("User not found", 404);
    }
    next();
}, responseMiddleware);

router.post("/", createUserValid, (req, res, next) => {
    if (res.err) return next();

    res.data = UserService.create(req.body);
    next();
}, responseMiddleware);

router.put("/:id", updateUserValid, (req, res, next) => {
    if (res.err) return next();

    res.data = UserService.update(req.params.id, req.body);
    next();
}, responseMiddleware);

router.delete("/:id", (req, res, next) => {
    const user = UserService.delete(req.params.id);

    if (user) {
        res.data = user;
    } else {
        res.err = new ResponseError("User not found", 404);
    }
    next();
}, responseMiddleware);

module.exports = router;