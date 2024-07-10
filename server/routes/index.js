const Router = require("express");
const router = new Router();

const typeRouter = require("./typeRouter.js");
const userRouter = require("./userRouter.js");
const brandRouter = require("./brandRouter.js");
const deviceRouter = require("./deviceRouter.js");

router.use("/user", userRouter);
router.use("/type", typeRouter);
router.use("/brand", brandRouter);
router.use("/device", deviceRouter);

module.exports = router;
