const express = require("express");
const router = express.Router();

router.use("/user", require("./userRoute"));
router.use("/tpo", require("./tpoRoute"));
router.use("/company", require("./companyRoute"));
router.use("/job", require("./jobRoute"));
router.use("/application", require("./applicationRoute"));



module.exports = router;