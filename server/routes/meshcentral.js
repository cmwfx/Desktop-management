const express = require("express");
const { changePassword, lockPC } = require("../controllers/meshcentral");

const router = express.Router();

const { protect } = require("../middleware/auth");

router.post("/change-password", protect, changePassword);
router.post("/lock-pc", protect, lockPC);

module.exports = router;
