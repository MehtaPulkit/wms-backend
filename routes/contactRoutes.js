const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT);
router
  .route("/")
  .get(contactController.getAllContacts)
  .post(contactController.createNewContact)
  .patch(contactController.updateContact)
  .delete(contactController.deleteContact);

router.route("/:id").get(contactController.getContact);

module.exports = router;
