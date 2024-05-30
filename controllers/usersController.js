const User = require("../models/User");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");

const uploadDir = path.join(__dirname, "..", "/uploads", "/profilePicture");

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = async (req, res) => {
  // Get all users from MongoDB
  const users = await User.find().select("-password").lean();

  // If no users
  if (!users?.length) {
    return res.status(400).json({ message: "No users found" });
  }

  res.json(users);
};
// @desc Get all users
// @route GET /users/:id
// @access Private
const getUser = async (req, res) => {
  const id = req.params.id;
  // Get all users from MongoDB
  const user = await User.findById(id).select("-password").exec();
  // If no users
  if (!user) {
    return res.status(400).json({ message: "No user found" });
  }

  res.json(user);
};
// @desc Get all users
// @route GET /users/check
// @access Public
const checkDuplicate = async (req, res) => {
  const { email } = req.body;
  const duplicate = await User.findOne({ email })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();

  if (duplicate) {
    return res.status(409).json({
      message: "A user already exists, please check your email and try again",
    });
  } else {
    return res.status(200).json({ message: "New user" });
  }
};
// @desc Create new user
// @route POST /users
// @access Private
const createNewUser = async (req, res) => {
  const {
    email,
    password,
    roles,
    firstName,
    lastName,
    mobileNo,
    birthday,
    newsletter,
  } = req.body;
  // Confirm data
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  // Hash password
  const hashedPwd = await bcrypt.hash(password, 10); // salt rounds

  const userObject =
    !Array.isArray(roles) || !roles.length
      ? {
          email,
          password: hashedPwd,
          firstname: firstName,
          lastname: lastName,
          mobileNumber: mobileNo,
          dateOfBirth: birthday,
          notificationPreference: { newsletterNotification: newsletter },
        }
      : {
          email,
          password: hashedPwd,
          roles,
          firstname: firstName,
          lastname: lastName,
          mobileNumber: mobileNo,
          dateOfBirth: birthday,
          notificationPreference: { newsletterNotification: newsletter },
        };
  // Create and store new user
  const user = await User.create(userObject);

  if (user) {
    //created
    res.status(201).json({ message: `New user ${email} created` });
  } else {
    res.status(400).json({ message: "Invalid user data received" });
  }
};

// @desc Update a user
// @route PATCH /users
// @access Private
const updateUser = async (req, res) => {
  const {
    id,
    email,
    roles,
    active,
    facebookId,
    googleId,
    subscription,
    firstname,
    lastname,
    postalAddress,
    currentAddress,
    dateOfBirth,
    mobileNumber,
    profilePicture,
    lastLogin,
  } = req.body;

  // Confirm data
  if (!id || !email) {
    return res.status(400).json({ message: "User id and email are required" });
  }

  // Does the user exist to update?
  const user = await User.findById(id).exec();
  // return res.json(user);
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  // Check for duplicate
  const duplicate = await User.findOne({ email })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();

  // Allow updates to the original user
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate email" });
  }

  user.email = email;
  user.roles = roles;
  user.active = active;
  user.facebookId = facebookId;
  user.googleId = googleId;
  user.subscription = subscription;
  user.firstname = firstname;
  user.lastname = lastname;
  user.postalAddress = postalAddress;
  user.currentAddress = currentAddress;
  user.dateOfBirth = dateOfBirth;
  user.mobileNumber = mobileNumber;
  user.profilePicture = profilePicture;
  user.lastLogin = lastLogin;

  const updatedUser = await user.save();

  if (updatedUser) {
    res.status(200).json({ message: `User details are updated` });
  } else {
    res.status(400).json({ message: `Update failed` });
  }
};

// @desc Delete a user
// @route DELETE /users
// @access Private
const deleteUser = async (req, res) => {
  const { id } = req.body;

  // Confirm data
  if (!id) {
    return res.status(400).json({ message: "User ID Required" });
  }

  // Does the user still have assigned notes?
  //   const note = await Note.findOne({ user: id }).lean().exec();
  //   if (note) {
  //     return res.status(400).json({ message: "User has assigned notes" });
  //   }

  // Does the user exist to delete?
  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const result = await user.deleteOne();

  const reply = `Email ${result.email} with ID ${result._id} deleted`;

  res.json(reply);
};

const updateAddress = async (req, res) => {
  try {
    const { id, addressType } = req.params;
    const { addressLine1, addressLine2, suburb, state, postalCode } = req.body;

    // Find the user
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create or update the address
    let address = {};
    // Update address fields
    address.addressLine1 = addressLine1;
    address.addressLine2 = addressLine2;
    address.suburb = suburb;
    address.state = state;
    address.postalCode = postalCode;

    if (addressType === "Postal") {
      user.postalAddress = address;
    } else if (addressType === "Current") {
      user.currentAddress = address;
    } else {
      return res.status(400).json({ message: "Invalid address type" });
    }

    // Save the user
    await user.save();

    res.status(200).json({ message: "Address updated successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const updateNotiPreference = async (req, res) => {
  try {
    const { id } = req.params;
    const { typeNotification, newsletterNotification } = req.body;

    // Find the user
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create or update the address
    user.notificationPreference.typeNotification = typeNotification;
    user.notificationPreference.newsletterNotification = newsletterNotification;

    // Save the user
    await user.save();

    res
      .status(200)
      .json({ message: "Notification Preferences updated successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const updatePassword = async (req, res) => {
  const { id, currentPassword, password } = req.body;

  const user = await User.findById(id).exec();
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }
  if (password) {
    // Hash password
    if (currentPassword == password) {
      return res.status(400).json({
        message: "You cannot use the old password as your new password",
      });
    }
    const match = await bcrypt.compare(currentPassword, user.password);

    if (!match)
      return res
        .status(401)
        .json({ message: "Incorrect current password provided" });
    user.password = await bcrypt.hash(password, 10); // salt rounds
  }
  const updatedUser = await user.save();
  if (updatedUser) {
    res.status(200).json({ message: "Password updated successfully" });
  } else {
    res.status(500).json({ message: "Failed to update password" });
  }
};
const uploadUserPicture = async (req, res) => {
  try {
    // Check if user is authenticated and retrieve user data
    const user = await User.findOne({ email: req.user })
      .collation({ locale: "en", strength: 2 })
      .lean()
      .exec();

    // Handle case where user does not exist
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Handle image upload
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    if (user?.profilePicture?.length > 0) {
      //Deleting the existing picture
      const filePath = uploadDir + "\\" + user.profilePicture;
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "File not found" });
      }
      // // Delete the file from the file system
      fs.unlinkSync(filePath);
      // Save updated user data to the database
    }
    await User.findByIdAndUpdate(user._id, {
      profilePicture: req.file.filename,
    });
    return res.status(200).json({ message: "Picture uploaded successfully" });
  } catch (error) {
    console.error("Error uploading picture:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const deleteImg = async (req, res) => {
  try {
    const { filename } = req.body;
    const user = await User.findOne({ email: req.user })
      .collation({ locale: "en", strength: 2 })
      .lean()
      .exec();

    // Handle case where user does not exist
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the file exists
    const filePath = uploadDir + "\\" + filename;

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found" });
    }

    // // Delete the file from the file system
    fs.unlinkSync(filePath);

    await User.findByIdAndUpdate(user._id, {
      profilePicture: "",
    });
    return res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Error deleting image:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = {
  getAllUsers,
  getUser,
  checkDuplicate,
  createNewUser,
  updateUser,
  deleteUser,
  updateAddress,
  updateNotiPreference,
  updatePassword,
  uploadUserPicture,
  deleteImg,
};
