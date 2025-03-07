const express = require("express");
const {
	getComputers,
	getComputer,
	createComputer,
	updateComputer,
	deleteComputer,
} = require("../controllers/computers");

const router = express.Router();

const { protect, authorize } = require("../middleware/auth");

router
	.route("/")
	.get(getComputers)
	.post(protect, authorize("admin"), createComputer);

router
	.route("/:id")
	.get(getComputer)
	.put(protect, authorize("admin"), updateComputer)
	.delete(protect, authorize("admin"), deleteComputer);

module.exports = router;
