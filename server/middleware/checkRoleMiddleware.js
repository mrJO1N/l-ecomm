const jwt = require("jsonwebtoken");

module.exports = (role) => {
  return (req, res, next) => {
    if (req.method === "OPTIONS") next();
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) throw new Error("Missing token");

      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      req.user = decoded;
      if (decoded.role !== role)
        return res.status(403).json({ message: "invalid role" });
      next();
    } catch (err) {
      res.status(403).json({ message: "not auth" });
    }
  };
};
