const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

const checkDuplicateUsernameOrEmail = async (req, res, next) => {
  try {
    // Check duplicate username
    const existingUsername = await User.findOne({ username: req.body.username });

    if (existingUsername) {
      return res.status(400).json({ message: 'Failed! Username is already in use!' });
    }

    // Check duplicate email
    const existingEmail = await User.findOne({ email: req.body.email });

    if (existingEmail) {
      return res.status(400).json({ message: 'Failed! Email is already in use!' });
    }

    // If no duplicates, move to the next middleware/controller
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message || 'An error occurred in the checkDuplicateUsernameOrEmail middleware.' });
  }
};

checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          message: `Failed! Role ${req.body.roles[i]} does not exist!`
        });
        return;
      }
    }
  }

  next();
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted
};

module.exports = verifySignUp;