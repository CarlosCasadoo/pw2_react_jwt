const db = require("../models");
const Role = db.role;
const User = db.user;

exports.allAccess = async (req, res) => {
  try {
    const counter = await User.countDocuments();
    res.status(200).send({
      counter: counter,
      message: "Contenido Público.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

exports.userBoard = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate({ path: "roles", select: "-__v" })
      .lean();

    if (!user) {
      return res.status(404).send("User not found");
    }

    const roles = user.roles.map((role) => role.name.toUpperCase());

    res.status(200).send({
      user: user.username,
      roles: roles,
      email: user.email,
      createdAt: user.createdAt
        ? user.createdAt.toLocaleDateString("es-ES")
        : "N/A",
      message: "Contenido de usuario.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

exports.adminBoard = async (req, res) => {
  try {
    const allUsers = await User.find()
      .populate({
        path: "roles",
        select: "name",
      })
      .select("username firstname lastname email createdAt");

      

    const users = allUsers.map((user) => {

      const username = user.username;
      const firstname = user.firstname? user.firstname : "N/A";
      const lastname = user.lastname? user.lastname : "N/A";
      const fullname = `${firstname} ${lastname}`;
      const email = user.email;
      const createdAt = user.createdAt
        ? user.createdAt.toLocaleDateString("es-ES")
        : "N/A";
      const roles = user.roles.map((role) => role.name);
      return { username, firstname, lastname, fullname, email, createdAt, roles };
    });

    res.status(200).send({
      users: users,
      quantity: allUsers.length,
      message: "Contenido de admin.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};

exports.adminPanel = (req, res) => {
  res.sendFile(process.cwd() + "/public/admin.html");
};

exports.moderatorPanel = (req, res) => {
  res.sendFile(process.cwd() + "/public/mod.html");
};

exports.profile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.redirect("/login");
    }

    const roles = await Role.find({ _id: { $in: user.roles } });

    if (roles.some((role) => role.name === "admin")) {
      return res.redirect("/admin");
    } else if (roles.some((role) => role.name === "moderator")) {
      return res.redirect("/mod");
    } else {
      return res.sendFile(process.cwd() + "/public/profile.html");
    }
  } catch (error) {
    console.error(error);
    return res.redirect("/login");
  }
};
