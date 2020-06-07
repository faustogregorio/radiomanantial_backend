const express = require("express");
const {
  getAnuncios,
  getAnuncio,
  createAnuncio,
  deleteAnuncio,
  getRedesSociales,
  getSliders,
  getAnuncioImagenPrincipal,
  updateAnuncioImagenPrincipal,
  getAnuncioLogo,
  updateAnuncioLogo,
  getAnuncioSlider,
  updateAnuncioSlider,
  getAnuncioNombre,
  updateAnuncioNombre,
  getAnuncioContenido,
  updateAnuncioContenido,
  getAnuncioRedesSociales,
  updateAnuncioRedesSociales
} = require("../controllers/anuncios");
const router = express.Router();

const { protect } = require("../middleware/auth");

router.route("/").get(getAnuncios).post(protect, createAnuncio);
router.route("/redes-sociales").get(getRedesSociales);
router.route("/sliders").get(getSliders);
router
  .route("/imagen-principal/:id")
  .get(getAnuncioImagenPrincipal)
  .put(protect, updateAnuncioImagenPrincipal);

router.route("/logo/:id").get(getAnuncioLogo).put(protect, updateAnuncioLogo);
router.route("/sliders/:id").get(getAnuncioSlider).put(protect, updateAnuncioSlider);
router.route("/nombre/:id").get(getAnuncioNombre).put(protect, updateAnuncioNombre);
router.route("/contenido/:id").get(getAnuncioContenido).put(protect, updateAnuncioContenido);
router.route("/redes-sociales/:id").get(getAnuncioRedesSociales).put(protect, updateAnuncioRedesSociales);

router.route("/:id").get(getAnuncio).delete(protect, deleteAnuncio);

module.exports = router;
