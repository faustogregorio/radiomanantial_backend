const express = require("express");
const {
  getImagenesPrincipales,
  createImagenPrincipal,
  deleteImagenPrincipal,
  getSelectedMainImage,
  updateSelectedMainImage
} = require("../controllers/imagenPrincipal");
const router = express.Router();

const { protect } = require("../middleware/auth");

//router.route("/:id/photo").put(protect, anuncioPhotoUpload);

router.route("/").get(getImagenesPrincipales).post(protect, createImagenPrincipal);
router.route("/:id").delete(protect, deleteImagenPrincipal).put(protect, updateSelectedMainImage);
router.route("/selected").get(getSelectedMainImage);

/* router
  .route("/:id")
  .get(getAnuncio)
  .put(protect, updateAnuncio)
  .delete(protect, deleteAnuncio);
 */
module.exports = router;
