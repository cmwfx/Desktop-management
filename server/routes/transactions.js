const express = require("express");
const {
	getTransactions,
	getMyTransactions,
	createDeposit,
} = require("../controllers/transactions");

const router = express.Router();

const { protect, authorize } = require("../middleware/auth");

router.get("/", protect, authorize("admin"), getTransactions);
router.get("/me", protect, getMyTransactions);
router.post("/deposit", protect, authorize("admin"), createDeposit);

module.exports = router;
