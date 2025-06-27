// setup all routes
const express = require("express");
const router = express.Router();
const controller = require("../controllers/productController");

router.get("/", controller.getNeeded);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

module.exports = router;
