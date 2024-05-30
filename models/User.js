const mongoose = require("mongoose");

// Define address schema
const addressSchema = new mongoose.Schema({
  addressLine1: { type: String, required: true },
  addressLine2: { type: String, required: false },
  suburb: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: {
    type: String,
    default: "Australia",
  },
});
// Define Notification preference schema
const notificationPreferenceSchema = new mongoose.Schema({
  typeNotification: { type: String, default: "Email" },
  newsletterNotification: { type: Boolean, default: true },
  pushNotification: { type: Boolean, default: true },
});

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.facebookId && !this.googleId;
      },
    },
    facebookId: String,
    googleId: String,
    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    roles: {
      type: [String],
      default: ["User"],
    },
    active: {
      type: Boolean,
      default: true,
    },
    postalAddress: addressSchema,
    currentAddress: addressSchema,
    notificationPreference: notificationPreferenceSchema,
    dateOfBirth: { type: Date, required: true },
    mobileNumber: {
      type: String,
      required: true,
    },
    profilePicture: String, //Add Profile picture
    lastLogin: Date, //Add Last login code
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
