const { Router } = require("express");
const FighterService = require("../services/fighterService");
const { createFighterValid, updateFighterValid } = require("../middlewares/fighter.validation.middleware");
const { responseMiddleware, ResponseError } = require("../middlewares/response.middleware");

const router = Router();

router.get("/", (req, res, next) => {
    res.data = FighterService.getAll();
    next();
}, responseMiddleware);

router.get("/:id", (req, res, next) => {
    const fighter = FighterService.search(req.params);

    if (fighter) {
        res.data = fighter;
    } else {
        res.err = new ResponseError("Fighter not found", 404);
    }
    next();
}, responseMiddleware);

router.post("/", createFighterValid, (req, res, next) => {
    if (res.err) return next();

    res.data = FighterService.create(req.body);
    next();
}, responseMiddleware);

router.put("/:id", updateFighterValid, (req, res, next) => {
    if (res.err) return next();

    res.data = FighterService.update(req.params.id, req.body);
    next();
}, responseMiddleware);

router.delete("/:id", (req, res, next) => {
    const fighter = FighterService.delete(req.params.id);

    if (fighter) {
        res.data = fighter;
    } else {
        res.err = new ResponseError("Fighter not found", 404);
    }
    next();
}, responseMiddleware);

module.exports = router;