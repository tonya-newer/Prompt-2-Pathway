const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");
const transporter = require("../config/mailer");

const JWT_SECRET = process.env.JWT_SECRET; 
const JWT_EXPIRES_IN = "1d";

const signup = async (req, res) => {
  try {
    const { email, password, roles } = req.body;

    // check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const newUser = new User({
      email,
      password: hashedPassword,
      roles: roles && roles.length > 0 ? roles : ["client_admin"],
    });

    await newUser.save();

    return res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};


const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // create JWT
    const token = jwt.sign(
      { userId: user._id, roles: user.roles },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        roles: user.roles,
        allowedTabs: user.allowedTabs
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

const addUser = async (req, res) => {
  try {
    const { email, password, roles } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      roles: roles && roles.length > 0 ? roles : ["client_admin"],
    });

    await newUser.save();

    const mailOptions = {
      from: `"Prompt 2 Pathway" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Welcome to Prompt 2 Pathway! Your Account Details Inside",
      text: `Hi Your password is ${password}`,
    };

    // await transporter.sendMail(mailOptions);

    return res.status(201).json({
      message: "New user added successfully",
      user: {
        id: newUser._id,
        email: newUser.email,
        roles: newUser.roles,
        allowedTabs: newUser.allowedTabs
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // exclude password
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { roles, allowedTabs } = req.body;

    // Build update object dynamically
    const updateData = {};
    if (roles) updateData.roles = roles;
    if (allowedTabs) updateData.allowedTabs = allowedTabs;

    const user = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    }).select("email roles allowedTabs");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
	signup,
	login,
  getUsers,
  addUser,
  deleteUser,
  updateUser
}
