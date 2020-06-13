const sql = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//@description      Register user
//@route            POST /api/v1/auth/register
//@access           Public
exports.registerUser = async (req, res, next) => {
  let { user, password, role } = req.body;
  if (role === "admin") {
    return next(new Error(`Admin is not valid value`));
  }
  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);
  sql.query(
    `INSERT INTO users VALUES (0,'${user}','${password}','${role}',now())`,
    function (error, results, fields) {
      if (error) next(error);

      const token = jwt.sign(
        { id: results["insertId"] },
        'ramadinanotial',
        {
          expiresIn: '30d',
        }
      );

      res.status(201).json({
        success: true,
        data: results,
        token: token,
      });
    }
  );
};

//@description      Login user
//@route            POST /api/v1/auth/login
//@access           Public
exports.login = async (req, res, next) => {
  let { user, password } = req.body;
  console.log(user);
  // Validate user & password
  if (!user || !password) {
    return next(new Error(`Please provide an user and password`));
  }

  //check for user

  /* const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt); */
  sql.query(`SELECT password,idUser FROM users WHERE user='${user}'`, function (
    error,
    results,
    fields
  ) {
    if (error) next(error);

    if (results.length === 0) {
      res.status(404).json({
        success: false,
        message: "Nombre de usuario incorrecto",
      });
      return;
    }
    bcrypt.compare(password, results[0].password, function (err, result) {
      if (error) next(error);
      if (result) {
        const idUser = results[0].idUser;
        sendTokenResponse(idUser, 200, res);
      } else {
        res.status(404).json({
          success: false,
          message: "Contraseña incorrecta",
        });
        return;
      }
    });
  });
};

// Create cookie and send response
const sendTokenResponse = (idUser, statusCode, res) => {
  const token = jwt.sign({ id: idUser }, 'ramadinanotial', {
    expiresIn: '30d',
  });

  const options = {
    expires: new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  /*  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  } */

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token: token,
  });
};

//@description      Log user out / clear cookie
//@route            GET /api/v1/auth/logout
//@access           Private
exports.logout = async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    logout: true,
  });
};

//@description      Get current logged in user
//@route            POST /api/v1/auth/authenticated
//@access           Public
exports.isAuthenticated = async (req, res, next) => {
  res.status(200).json({
    success: true
  });
};
