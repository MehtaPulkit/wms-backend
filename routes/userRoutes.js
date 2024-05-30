const express = require("express");
const path = require("path");
const router = express.Router();
const usersController = require("../controllers/usersController");
const verifyJWT = require("../middleware/verifyJWT");
const uploadImg = require("../middleware/uploadImg");

// Exclude the verifyJWT middleware for the createNewUser route
router.post("/", usersController.createNewUser);

router.route("/check").post(usersController.checkDuplicate);

//Everything else below needs to be verified
router.use(verifyJWT);
router
  .route("/")
  .get(usersController.getAllUsers)
  .patch(usersController.updateUser)
  .delete(usersController.deleteUser);

router.route("/:id").get(usersController.getUser);
router.patch("/:id/address/:addressType", usersController.updateAddress);
router.patch("/:id/notiPreference", usersController.updateNotiPreference);
router.patch("/updatePassword",usersController.updatePassword)
// upload end point
router.post(
  "/upload",
  uploadImg(path.join(__dirname, "../uploads/profilePicture"), 5),
  usersController.uploadUserPicture
);

router.delete("/deleteImage",usersController.deleteImg);

module.exports = router;
