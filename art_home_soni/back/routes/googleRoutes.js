const passport = require("passport");
const jwt = require("jsonwebtoken");

const router = require("express").Router();

router.get("/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false
  }),
  (req, res) => {
    // Здесь можешь выдать JWT, как при обычной авторизации:
    const token = jwt.sign({
      id: req.user._id,
      email: req.user.email,
      name: req.user.name,
    }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.redirect(`http://localhost:5173/google-auth?token=${token}`);
  }
);

module.exports = router;
