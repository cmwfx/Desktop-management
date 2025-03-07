const express = require("express");
const {
	createSession,
	getSessions,
	getMySession,
	endSession,
} = require("../controllers/sessions");

const router = express.Router();

const { protect, authorize } = require("../middleware/auth");

router
	.route("/")
	.post(protect, createSession)
	.get(protect, authorize("admin"), getSessions);

router.get("/me", protect, getMySession);
router.put("/:id/end", protect, authorize("admin"), endSession);

module.exports = router;
