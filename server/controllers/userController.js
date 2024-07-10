const ApiError = require("../error/ApiError.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, Basket } = require("../models/models.js");

const generateJwt = (userId, email, role) =>
  jwt.sign({ id: userId, email, role }, process.env.SECRET_KEY, {
    expiresIn: "24h",
  });

class UserController {
  async registration(req, res, next) {
    const { email, password, role } = req.body;

    if (!email || !password)
      return next(ApiError.badRequest("uncorrect email or password"));

    const candidate = await User.findOne({ where: { email } });
    if (candidate) return next(ApiError.badRequest("email already exists"));

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword, role });
    const basket = await Basket.create({ userId: user.id });
    const token = generateJwt(user.id, user.email, user.role);

    return res.json({ token });
  }
  async login(req, res, next) {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) return next(ApiError.internal("this user isn't exist"));
    let comparePassword = bcrypt.compareSync(password, user.password);
    if (!comparePassword)
      return next(ApiError.badRequest("incorrect password"));
    const token = generateJwt(user.id, user.email, user.role);

    return res.json({ token });
  }
  async check(req, res, next) {
    const { user } = req;
    const token = generateJwt(user.id, user.email, user.role);
    return res.json({ token });
  }
}

module.exports = new UserController();
