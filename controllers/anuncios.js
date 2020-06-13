const path = require("path");
const sql = require("../config/db");
const fs = require("fs");

//@description      Get all redes sociales
//@route            GET /api/v1/anuncios/redes-sociales
//@access           Public
exports.getRedesSociales = (req, res, next) => {
  sql.query(
    `SELECT idRedSocial as id, nombre, logo FROM redes_sociales;`,
    function (error, results, fields) {
      if (error) next(error);

      res.status(200).json({
        success: true,
        data: results,
      });
    }
  );
};

//@description      Get sliders
//@route            GET /api/v1/anuncios/sliders
//@access           Public
exports.getSliders = (req, res, next) => {
  sql.query(
    `SELECT idAnunciante as id, foto as img FROM anunciantes;`,
    function (error, results, fields) {
      if (error) next(error);

      res.status(200).json({
        success: true,
        data: results,
      });
    }
  );
};

//@description      Get all anuncios
//@route            GET /api/v1/anuncios
//@access           Public
exports.getAnuncios = (req, res, next) => {
  sql.query(
    `SELECT idAnunciante as id, logo, foto FROM anunciantes ORDER BY id desc;`,
    function (error, results, fields) {
      if (error) next(error);

      res.status(200).json({
        success: true,
        data: results,
      });
    }
  );
};

//@description      Get single anuncio
//@route            GET /api/v1/anuncios/:id
//@access           Public
exports.getAnuncio = (req, res, next) => {
  const anuncioId = req.params.id;
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log('IP: ', ip);
  sql.query(
    `INSERT INTO visitas VALUES (${anuncioId},'${ip}', now())`,
    function (error, results, fields) {
      if (error);
      sql.query(
        `SELECT 
    nombre_html as nombreHTML,
    logo,
    foto,
    contenido_html as contenidoHTML 
    FROM anunciantes WHERE idAnunciante=${anuncioId}`,
        function (error, results, fields) {
          if (error) next(error);
          res.status(200).json({
            success: true,
            data: results[0],
          });
        }
      );
    }
  );
};

//@description      Get anuncio visitas
//@route            GET /api/v1/anuncios/visitas/:id
//@access           Public
exports.getVisitas = (req, res, next) => {
  const anuncioId = req.params.id;

  sql.query(
    `
    SELECT COUNT(idAnunciante) as visitas FROM visitas WHERE idAnunciante=${anuncioId}
    `,
    function (error, results, fields) {
      if (error) next(error);
      res.status(200).json({
        success: true,
        data: results[0],
      });
    }
  );
};

//@description      Get anuncio redes sociales
//@route            GET /api/v1/anuncios/redes-sociales/:id
//@access           Public
exports.getAnuncioRedesSociales = (req, res, next) => {
  const idAnunciante = req.params.id;
  sql.query(
    `SELECT ars.idRedSocial as id, url, logo
    FROM anunciantes_redes_sociales as ars 
    inner join redes_sociales as rs 
    on ars.idRedSocial=rs.idRedSocial WHERE idAnunciante=${idAnunciante};`,
    function (error, results, fields) {
      if (error) next(error);

      res.status(200).json({
        success: true,
        data: results,
      });
    }
  );
};

//@description      update anuncio redes sociales
//@route            PUT /api/v1/anuncios/redes-sociales/:id
//@access           Private
exports.updateAnuncioRedesSociales = (req, res, next) => {
  const idAnunciante = req.params.id;
  const redesSociales = req.body;

  sql.query(
    `DELETE from anunciantes_redes_sociales WHERE idAnunciante=${idAnunciante};`,
    function (error, results, fields) {
      if (error) next(error);
      let valuesRedesSociales = "";

      let ids = [];
      for (let index = 0; index < redesSociales.length; index++) {
        if (!ids.includes(redesSociales[index].id)) {
          ids.push(redesSociales[index].id);
          if (index === 0) {
            valuesRedesSociales = `(${idAnunciante},${redesSociales[index].id},'${redesSociales[index].url}',now())`;
          } else {
            valuesRedesSociales = `${valuesRedesSociales},(${idAnunciante},${redesSociales[index].id},'${redesSociales[index].url}',now())`;
          }
        }
      }
      sql.query(
        `INSERT INTO anunciantes_redes_sociales 
        VALUES ${valuesRedesSociales}`,
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

//@description      Get anuncio contenido
//@route            GET /api/v1/anuncios/contenido/:id
//@access           Public
exports.getAnuncioContenido = (req, res, next) => {
  const idAnunciante = req.params.id;
  sql.query(
    `SELECT contenido_json FROM anunciantes WHERE idAnunciante=${idAnunciante};`,
    function (error, results, fields) {
      if (error) next(error);

      res.status(200).json({
        success: true,
        contenidoJSON: results[0]["contenido_json"],
      });
    }
  );
};

//@description      update anuncio contenido
//@route            PUT /api/v1/anuncios/contenido/:id
//@access           Private
exports.updateAnuncioContenido = (req, res, next) => {
  const idAnunciante = req.params.id;
  const { contenidoHTML, contenidoJSON } = req.body;
  console.log("HTML", contenidoHTML);
  console.log("JSON", contenidoJSON);

  sql.query(
    `UPDATE anunciantes SET contenido_json='${contenidoJSON}', contenido_html='${contenidoHTML}' WHERE idAnunciante=${idAnunciante};`,
    function (error, results, fields) {
      if (error) next(error);

      res.status(200).json({
        success: true,
        nombreJSON: results,
      });
    }
  );
};

//@description      Get anuncio nombre
//@route            GET /api/v1/anuncios/nombre/:id
//@access           Public
exports.getAnuncioNombre = (req, res, next) => {
  const idAnunciante = req.params.id;
  sql.query(
    `SELECT nombre_json FROM anunciantes WHERE idAnunciante=${idAnunciante};`,
    function (error, results, fields) {
      if (error) next(error);

      res.status(200).json({
        success: true,
        nombreJSON: results[0]["nombre_json"],
      });
    }
  );
};

//@description      update anuncio nombre
//@route            PUT /api/v1/anuncios/nombre/:id
//@access           Private
exports.updateAnuncioNombre = (req, res, next) => {
  const idAnunciante = req.params.id;
  const { nombreHTML, nombreJSON } = req.body;

  sql.query(
    `UPDATE anunciantes SET nombre_json='${nombreJSON}', nombre_html='${nombreHTML}' WHERE idAnunciante=${idAnunciante};`,
    function (error, results, fields) {
      if (error) next(error);

      res.status(200).json({
        success: true,
        nombreJSON: results,
      });
    }
  );
};

//@description      Get anuncio imagenes/sliders
//@route            GET /api/v1/anuncios/sliders/:id
//@access           Public
exports.getAnuncioSlider = (req, res, next) => {
  const idAnunciante = req.params.id;
  sql.query(
    `SELECT nombre FROM sliders WHERE idAnunciante=${idAnunciante};`,
    function (error, results, fields) {
      if (error) next(error);

      res.status(200).json({
        success: true,
        data: results,
      });
    }
  );
};

//@description      Update anuncio slider
//@route            PUT /api/v1/anuncios/sliders/:id
//@access           Private
exports.updateAnuncioSlider = (req, res, next) => {
  const idAnunciante = req.params.id.split("__")[0];
  const sliderJsonString = req.params.id.split("__")[1];
  const slider = JSON.parse(sliderJsonString);
  if (!req.files) {
    return next(new Error(`Please upload a file`));
  }

  let imagenes = [];
  for (const key in req.files) {
    if (!req.files[key].mimetype.startsWith("image")) {
      return next(new Error(`Please upload an image file`));
    }
    imagenes.push(req.files[key]);
  }

  for (const slide of slider) {
    deleteFile(slide["nombre"]);
  }
  sql.query(`DELETE FROM sliders WHERE idAnunciante=${idAnunciante}`, function (
    error,
    results,
    fields
  ) {
    if (error) next(error);
    let valuesSliders = "";
    for (let index = 0; index < imagenes.length; index++) {
      imagenes[index].name = `anunciante_${idAnunciante}_slider_${Date.now()}${
        path.parse(imagenes[index].name).ext
      }`;
      uploadFile(imagenes[index]);
      if (index === 0) {
        valuesSliders = `(0,'${imagenes[index].name}',now(),${idAnunciante})`;
      } else {
        valuesSliders = `${valuesSliders},(0,'${imagenes[index].name}',now(),${idAnunciante})`;
      }
    }
    sql.query(
      `INSERT INTO sliders 
            VALUES ${valuesSliders}`,
      function (error, results, fields) {
        if (error) next(error);
        res.status(200).json({
          success: true,
          data: results,
        });
      }
    );
  });
};

//@description      Get single anuncio logo
//@route            GET /api/v1/anuncios/logo/:id
//@access           Public
exports.getAnuncioLogo = (req, res, next) => {
  const idAnunciante = req.params.id;
  sql.query(
    `SELECT logo FROM anunciantes WHERE idAnunciante=${idAnunciante}`,
    function (error, results, fields) {
      if (error) next(error);
      res.status(200).json({
        success: true,
        data: results,
      });
    }
  );
};

//@description      Update anuncio logo
//@route            PUT /api/v1/anuncios/logo/:id
//@access           Private
exports.updateAnuncioLogo = (req, res, next) => {
  const idAnunciante = req.params.id.split("__")[0];
  const logo = req.params.id.split("__")[1];
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
  file.name = `anunciante_${idAnunciante}_logo_${Date.now()}${
    path.parse(file.name).ext
  }`;
  deleteFile(logo);

  fs.writeFile(
    `./public/uploads/${file.name}`,
    file.data,
    function (err) {
      if (err) return next(err);
      sql.query(
        `UPDATE anunciantes 
        SET logo='${file.name}' WHERE idAnunciante=${idAnunciante}`,
        function (error, results, fields) {
          if (error) next(error);
          res.status(201).json({
            success: true,
            logo: file.name,
            data: results,
          });
        }
      );
    }
  );
};

//@description      Get single anuncio logo
//@route            GET /api/v1/anuncios/logo/:id
//@access           Public
exports.getAnuncioImagenPrincipal = (req, res, next) => {
  const idAnunciante = req.params.id;
  sql.query(
    `SELECT foto FROM anunciantes WHERE idAnunciante=${idAnunciante}`,
    function (error, results, fields) {
      if (error) next(error);
      res.status(200).json({
        success: true,
        data: results,
      });
    }
  );
};

//@description      Update anuncio imagen principal
//@route            PUT /api/v1/anuncios/imagen-principal/:id
//@access           Private
exports.updateAnuncioImagenPrincipal = (req, res, next) => {
  const idAnunciante = req.params.id.split("__")[0];
  const foto = req.params.id.split("__")[1];
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
  file.name = `anunciante_${idAnunciante}_principal_${Date.now()}${
    path.parse(file.name).ext
  }`;
  deleteFile(foto);

  fs.writeFile(
    `./public/uploads/${file.name}`,
    file.data,
    function (err) {
      if (err) return next(err);
      sql.query(
        `UPDATE anunciantes 
        SET foto='${file.name}' WHERE idAnunciante=${idAnunciante}`,
        function (error, results, fields) {
          if (error) next(error);
          res.status(200).json({
            success: true,
            foto: file.name,
            data: results,
          });
        }
      );
    }
  );
};

//@description      Create new anuncio
//@route            POST /api/v1/anuncios
//@access           Private
exports.createAnuncio = (req, res, next) => {
  const {
    nombreHTML,
    nombreJSON,
    contenidoHTML,
    contenidoJSON,
    redes,
  } = req.body;
  if (!req.files) {
    return next(new Error(`Please upload a file`));
  }
  let imagenes = [];
  for (const key in req.files) {
    if (!req.files[key].mimetype.startsWith("image")) {
      return next(new Error(`Please upload an image file`));
    }
    if (key.startsWith("imagenes")) {
      imagenes.push(req.files[key]);
    }
  }
  const principal = req.files.principal;
  const logo = req.files.logo;
  principal.name = `anunciante_principal_${Date.now()}${
    path.parse(principal.name).ext
  }`;
  logo.name = `anunciante_logo_${Date.now()}${path.parse(logo.name).ext}`;

  uploadFile(principal);
  uploadFile(logo);

  sql.query(
    `INSERT INTO anunciantes 
    VALUES(0,'${nombreHTML}','${nombreJSON}','${logo.name}','${principal.name}','${contenidoHTML}','${contenidoJSON}',now())`,
    function (error, results, fields) {
      if (error) next(error);
      const idAnunciante = results["insertId"];
      let redesSociales;
      if (redes === "redes") {
        redesSociales = [{ id: 1, url: "https://www.facebook.com/" }];
      } else {
        redesSociales = JSON.parse(redes);
      }
      let valuesRedesSociales = "";
      let ids = [];
      for (let index = 0; index < redesSociales.length; index++) {
        if (!ids.includes(redesSociales[index].id)) {
          ids.push(redesSociales[index].id);
          if (index === 0) {
            valuesRedesSociales = `(${idAnunciante},${redesSociales[index].id},'${redesSociales[index].url}',now())`;
          } else {
            valuesRedesSociales = `${valuesRedesSociales},(${idAnunciante},${redesSociales[index].id},'${redesSociales[index].url}',now())`;
          }
        }
      }
      sql.query(
        `INSERT INTO anunciantes_redes_sociales 
        VALUES ${valuesRedesSociales}`,
        function (error, results, fields) {
          if (error) next(error);
          let valuesSliders = "";
          for (let index = 0; index < imagenes.length; index++) {
            imagenes[index].name = `anunciante_slider_${Date.now()}${
              path.parse(imagenes[index].name).ext
            }`;
            uploadFile(imagenes[index]);
            if (index === 0) {
              valuesSliders = `(0,'${imagenes[index].name}',now(),${idAnunciante})`;
            } else {
              valuesSliders = `${valuesSliders},(0,'${imagenes[index].name}',now(),${idAnunciante})`;
            }
          }
          sql.query(
            `INSERT INTO sliders 
            VALUES ${valuesSliders}`,
            function (error, results, fields) {
              if (error) next(error);
              res.status(201).json({
                success: true,
                id: idAnunciante,
                principal: principal.name,
                data: results,
              });
            }
          );
        }
      );
    }
  );
};

//@description      Delete anuncio
//@route            DELETE /api/v1/anuncios/:id
//@access           Private
exports.deleteAnuncio = (req, res, next) => {
  const id = req.params.id.split("__")[0];
  const foto = req.params.id.split("__")[1];
  const logo = req.params.id.split("__")[2];

  sql.query(`SELECT nombre FROM sliders WHERE idAnunciante=${id}`, function (
    error,
    results,
    fields
  ) {
    if (error) next(error);
    const sliders = results;
    sql.query(`DELETE FROM anunciantes WHERE idAnunciante=${id}`, function (
      error,
      results,
      fields
    ) {
      if (error) next(error);
      for (const slider of sliders) {
        deleteFile(slider["nombre"]);
      }
      deleteFile(foto);
      deleteFile(logo);
      res.status(200).json({
        success: true,
        data: results,
      });
    });
  });
};


function uploadFile(file) {
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
