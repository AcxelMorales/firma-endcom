const express = require("express");
const router = express.Router();

const appController = require("../controller/app.controller");

/* GET home page. */
router.get("/", appController.index);
router.post("/", appController.generate);

router.get("/check", appController.check);

module.exports = router;
