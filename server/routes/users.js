const express = require("express");
const {
	register,
	login,
	getMe,
	updateBalance,
	getUsers,
} = require("../controllers/users");

const router = express.Router();

const { protect, authorize } = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.put("/:id/balance", protect, authorize("admin"), updateBalance);
router.get("/", protect, authorize("admin"), getUsers);

module.exports = router;
