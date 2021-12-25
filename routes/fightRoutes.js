const { Router } = require("express");
const FightService = require("../services/fightService");
const { responseMiddleware } = require("../middlewares/response.middleware");

const router = Router();


router.get("/", (req, res, next) => {
    res.data = FightService.getAll();
    next();
}, responseMiddleware);

router.post("/", (req, res, next) => {
    res.data = FightService.create(req.body);
    next();
}, responseMiddleware);

module.exports = router;