const path = require("path");
const sql = require("../config/db");
const fs = require("fs");

//@description      Create new modulo
//@route            POST /api/v1/modulos
//@access           Private
exports.createModulo = (req, res, next) => {
  const nombre = req.body.nombre;
  if (!req.files) {
    return next(new Error(`Por favor agregue los archivos`));
  }
  const fileHTML = req.files.HTMLfile;
  const fileJSON = req.files.JSONfile;
  // Make sure the file is a text/plain
  if (
    !fileHTML.mimetype.startsWith("text/plain") &&
    !fileJSON.mimetype.startsWith("text/plain")
  ) {
    return next(new Error(`Please upload a text file`));
  }
  fileHTML.name = `modulo_${nombre}_HTML_${Date.now()}${
    path.parse(fileHTML.name).ext
  }`;
  fileJSON.name = `modulo_${nombre}_JSON_${Date.now()}${
    path.parse(fileJSON.name).ext
  }`;

  saveFile(fileHTML);
  saveFile(fileJSON);

  sql.query(
    `INSERT INTO modulos VALUES (0, '${nombre}','${fileHTML.name}','${fileJSON.name}',now())`,
    function (error, results, fields) {
      if (error) next(error);
      res.status(200).json({
        success: true,
        data: results,
      });
    }
  );
};

//@description      Update modulo
//@route            POST /api/v1/modulos/:id
//@access           Private
exports.updateModulo = (req, res, next) => {
  const id = req.params.id;
  const { nombre, fileOldHTML, fileOldJSON } = req.body;
  if (!req.files) {
    return next(new Error(`Por favor agregue los archivos`));
  }
  const fileHTML = req.files.HTMLfile;
  const fileJSON = req.files.JSONfile;
  // Make sure the file is a text/plain
  if (
    !fileHTML.mimetype.startsWith("text/plain") &&
    !fileJSON.mimetype.startsWith("text/plain")
  ) {
    return next(new Error(`Please upload a text file`));
  }
  fileHTML.name = `modulo_${nombre}_HTML_${Date.now()}${
    path.parse(fileHTML.name).ext
  }`;
  fileJSON.name = `modulo_${nombre}_JSON_${Date.now()}${
    path.parse(fileJSON.name).ext
  }`;
  deleteFile(fileOldHTML);
  deleteFile(fileOldJSON);
  saveFile(fileHTML);
  saveFile(fileJSON);

  sql.query(
    `UPDATE modulos SET 
    nombre='${nombre}', 
    modulo_html='${fileHTML.name}', 
    modulo_json='${fileJSON.name}'
    WHERE idModulo=${id}`,
    function (error, results, fields) {
      if (error) next(error);
      res.status(200).json({
        success: true,
        data: results,
      });
    }
  );
};

//@description      Get all modulos
//@route            GET /api/v1/modulos
//@access           Public
exports.getModulos = (req, res, next) => {
  sql.query(
    `SELECT idModulo as id, nombre, modulo_html as htmlNombre, modulo_json as jsonNombre FROM modulos ORDER BY idModulo desc`,
    function (error, results, fields) {
      if (error) next(error);

      res.status(200).json({
        success: true,
        data: results,
      });
    }
  );
};

//@description      Delete modulo
//@route            DELETE /api/v1/modulos/:id
//@access           Private
exports.deleteModulo = (req, res, next) => {
  const id = req.params.id.split("__")[0];
  const htmlNombre = req.params.id.split("__")[1];
  const jsonNombre = req.params.id.split("__")[2];

  sql.query(`DELETE FROM modulos WHERE idModulo=${id}`, function (
    error,
    results,
    fields
  ) {
    if (error) next(error);
    deleteFile(htmlNombre);
    deleteFile(jsonNombre);
    res.status(200).json({
      success: true,
      data: results,
    });
  });
};

//@description      Get single modulo
//@route            GET /api/v1/modulos/:id
//@access           Public
exports.getModulo = (req, res, next) => {
  const id = req.params.id;
  sql.query(
    `SELECT modulo_json as nombreJSON, nombre, modulo_html as nombreHTML FROM modulos WHERE idModulo=${id}`,
    function (error, results, fields) {
      if (error) next(error);
      res.status(200).json({
        success: true,
        data: results[0],
      });
    }
  );
};

function saveFile(file) {
  try {
    fs.writeFileSync(`./public/uploads/${file.name}`, file.data);
    console.log(`File ${file.name} has been saved.`);
  } catch (error) {
    console.error(error);
  }
}

function deleteFile(nombre) {
  try {
    fs.unlinkSync(`./public/uploads/${nombre}`);
    console.log(`File ${nombre} deleted!`);
  } catch (error) {
    console.error(`File ${nombre} not deleted!, it maybe not exist`);
  }
}
