const config = require("../config/auth.config");
const db = require("../models");
const isValidEmail = require("../utils/validateEmail.js");
const User = db.user;
const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
  if (!req.body.username || !req.body.email || !req.body.password) {
    return res
      .status(400)
      .send({ message: "Please provide a username, email and password." });
  }

  if (!req.body.firstName || !req.body.lastName) {
    return res
      .status(400)
      .send({ message: "Please provide a first and last name." });
  }

  if (req.body.password.length < 6) {
    return res.status(500).send({
      message: "Error! Password must be at least 6 characters.",
    });
  }

  if (req.body.password !== req.body.confirmPassword) {
    return res.status(500).send({
      message: "Error! Passwords do not match.",
    });
  }

  if (!isValidEmail(req.body.email)) {
    return res.status(500).send({
      message: "Error! Invalid Email.",
    });
  }

  const user = new User({
    firstname: req.body.firstName,
    lastname: req.body.lastName,
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  });

  try {
    await user.save();

    if (req.body.roles) {
      const roles = await Role.find({
        name: { $in: req.body.roles },
      });

      user.roles = roles.map((role) => role._id);
      await user.save();
    } else {
      const role = await Role.findOne({ name: "user" });
      user.roles = [role._id];
      await user.save();
    }

    res.send({ message: "User was registered successfully!" });
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

exports.signin = async (req, res) => {
  try {

    const query = isValidEmail(req.body.username)
  ? { email: req.body.username }
  : { username: req.body.username };

    const user = await User.findOne(query).populate("roles", "-__v");

    if (!user) {
      return res.status(404).send({ message: "Invalid Username or Password!" });
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(404).send({
        message: "Invalid Username or Password!",
      });
    }

    const token = jwt.sign({ id: user.id }, config.secret, {
      algorithm: "HS256",
      allowInsecureKeySizes: true,
      expiresIn: 86400, // 24 hours
    });

    const authorities = user.roles.map(
      (role) => "ROLE_" + role.name.toUpperCase()
    );

    res.setHeader("Set-Cookie", `${config.cookieName}=${token}; path=/;`);
    res.status(200).send({
      id: user._id,
      username: user.username,
      email: user.email,
      roles: authorities,
      accessToken: token,
    });
  } catch (err) {
    res
      .status(500)
      .send({
        message:
          err.message || "An error occurred while processing your request.",
      });
  }
};

exports.logout = (req, res) => {
    res.clearCookie(config.cookieName);
    res.redirect('/login');
  };
