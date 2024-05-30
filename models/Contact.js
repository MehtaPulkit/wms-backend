const mongoose = require("mongoose");
//Define contact's address schema
const addressSchema = new mongoose.Schema({
  addressLine1: String,
  addressLine2: String,
  city: String,
  state: String,
  postalCode: String,
  country: {
    type: String,
    default: "India",
  },
});
// Define contact schema
const contactSchema = new mongoose.Schema(
  {
    contactId: { type: String },
    contactType: { type: String, required: true },
    isEmergencyContact: { type: Boolean, required: false },
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    email: { type: String },
    mobileNo: { type: String, required: false },
    address: addressSchema,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

//add acount type link with this
// Define model
module.exports = mongoose.model("Contact", contactSchema);
