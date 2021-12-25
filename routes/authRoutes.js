const { Router } = require("express");
const AuthService = require("../services/authService");
const { responseMiddleware, ResponseError } = require("../middlewares/response.middleware");

const router = Router();

router.post("/login", (req, res, next) => {
    try {
        res.data = AuthService.login(req.body);
    } catch (err) {
        res.err = new ResponseError(err.message, 404);
    } finally {
        next();
    }
}, responseMiddleware);

module.exports = router;