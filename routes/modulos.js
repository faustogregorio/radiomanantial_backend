const express = require("express");
const {
  createModulo,
  getModulos,
  deleteModulo,
  getModulo,
  updateModulo
} = require("../controllers/modulos");
const router = express.Router();

const { protect } = require("../middleware/auth");

router.route("/").get(getModulos).post(protect, createModulo);
router
  .route("/:id")
  .get(getModulo)
  .put(protect, updateModulo)
  .delete(protect, deleteModulo);

module.exports = router;
