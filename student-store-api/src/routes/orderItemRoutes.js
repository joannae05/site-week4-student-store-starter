const express = require("express");
const router = express.Router();
const controllerItems = require("../controllers/orderItemController");

router.get("/", controllerItems.getAll);
// router.get("/:id/total", controllerItems.getOrderTotal);

module.exports = router;
