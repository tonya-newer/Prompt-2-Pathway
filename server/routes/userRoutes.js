const express = require("express");
const userController = require("../controllers/userController.js");
const { authenticate, authorize } = require("../middleware/auth.js");

const router = express.Router();

router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.get("/", authenticate, authorize(["platform_admin"]), userController.getUsers);
router.post("/", authenticate, authorize(["platform_admin"]), userController.addUser);
router.put("/:id", authenticate, authorize(["platform_admin"]), userController.updateUser);
router.delete("/:id", authenticate, authorize(["platform_admin"]), userController.deleteUser);

module.exports = router;