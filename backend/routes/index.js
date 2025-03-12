const express = require("express");
const router = express.Router();

router.use("/user", require("./userRoute"));
router.use("/tpo", require("./tpoRoute"));



module.exports = router;