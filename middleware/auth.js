const jwt = require("jsonwebtoken");
const sql = require("../config/db");

// Protect routes
exports.protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // set token from Bearer token in header
    token = req.headers.authorization.split(" ")[1];
    console.log('headers', token);

  } else if (req.cookies.token) {
    //set token from cookie
    token = req.cookies.token;
    console.log('cookie', token);
  }

  // Make sure token exists
  if (!token) {
    return next(new Error("Not authorized to access this route"));
  }

  try {
    // Veridy token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);

    sql.query(`SELECT role FROM users WHERE idUser=${decoded.id}`, function (
      error,
      results,
      fields
    ) {
      if (error) next(error);

      if (results && results.length === 0) {
        return next(new Error(`Usuario no existe`));
      }
      if (results[0]["role"] === "admin") {
        req.idUser = decoded.id;
        next();
      } else {
        return next(new Error(`No estas autorizado`));
      }
    });
  } catch (error) {
    return next(new Error(`Token error`));
  }
};
