// setup all routes
const express = require("express");
const router = express.Router();
const controller = require("../controllers/orderController");
const controllerItems = require("../controllers/orderItemController");

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

router.get("/items", controllerItems.getAll);
router.post("/:id/items", controllerItems.create);
router.get("/:id/total", controllerItems.getOrderTotal);

module.exports = router;
