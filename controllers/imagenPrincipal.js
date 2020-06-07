const path = require("path");
const sql = require("../config/db");
const fs = require("fs");

//@description      Get all imagenes principales
//@route            GET /api/v1/imagenes-principales
//@access           Public
exports.getImagenesPrincipales = (req, res, next) => {
  sql.query(
    `SELECT idImagen as id, nombre, selected FROM imagen_principal ORDER BY idImagen desc`,
    function (error, results, fields) {
      if (error) next(error);

      res.status(200).json({
        success: true,
        data: results,
      });
    }
  );
};

//@description      Get single imagen principal
//@route            GET /api/v1/imagenes-principales/selected
//@access           Public
exports.getSelectedMainImage = (req, res, next) => {
  sql.query(
    `SELECT * FROM imagen_principal WHERE selected=1 limit 1`,
    function (error, results, fields) {
      if (error) next(error);
      res.status(200).json({
        success: true,
        data: results,
      });
    }
  );
};

//@description      Update anuncio
//@route            PUT /api/v1/anuncios/:id
//@access           Private
exports.updateSelectedMainImage = (req, res, next) => {
  const { nombre } = req.body;
  console.log(req.body);
  const id = req.params.id;
  sql.query(
    `UPDATE imagen_principal SET selected=0 WHERE selected=1`,
    function (error, result, fields) {
      if (error) next(error);
      sql.query(
        `UPDATE imagen_principal SET selected=1 WHERE idImagen=${id}`,
        function (error, results, fields) {
          if (error) next(error);
          res.status(200).json({
            success: true,
            data: results,
          });
        }
      );
    }
  );
};

//@description      Create new imagen principal
//@route            POST /api/v1/imagenes-principales
//@access           Private
exports.createImagenPrincipal = (req, res, next) => {
  if (!req.files) {
    return next(new Error(`Please upload a file`));
  }
  console.log(req.files);

  const file = req.files.file;
  // Make sure the image is a photo
  if (!file.mimetype.startsWith("image")) {
    return next(new Error(`Please upload an image file`));
  }

  // Create custom filename
  file.name = `imagen_principal_${Date.now()}${path.parse(file.name).ext}`;
  console.log(file.name);
  console.log(req.files);

  fs.writeFile(
    `${process.env.FILE_UPLOAD_PATH}/${file.name}`,
    file.data,
    function (err) {
      if (err) return next(err);
      sql.query(
        `INSERT INTO imagen_principal VALUES (0, '${file.name}', false,now())`,
        function (error, results, fields) {
          if (error) next(error);
          res.status(200).json({
            success: true,
            data: results,
            nombre: file.name,
          });
        }
      );
    }
  );
};

//@description      Delete imagen principal
//@route            DELETE /api/v1/imagenes-principales/:id
//@access           Private
exports.deleteImagenPrincipal = (req, res, next) => {
  const id = req.params.id.split("__")[0];
  const nombre = req.params.id.split("__")[1];
  console.log(req.params.id);
  fs.unlink(`${process.env.FILE_UPLOAD_PATH}/${nombre}`, function (err) {
    if (err) return next(err);
    // if no error, file has been deleted successfully
    sql.query(`DELETE FROM imagen_principal WHERE idImagen=${id}`, function (
      error,
      results,
      fields
    ) {
      if (error) next(error);
      res.status(200).json({
        success: true,
        data: results,
      });
    });
  });
};
