
const path = require('path');
const express = require("express");
const dotenv = require("dotenv");
const morgan = require('morgan');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const errorHandler = require('./middleware/error');
const connection = require('./config/db');

//load env vars
dotenv.config({ path: "./config/config.env" });

// Connect to database
connection;

// Route files
const anuncios = require('./routes/anuncios');
const imagenesPrincipales = require('./routes/imagenPrincipal');
const auth = require('./routes/auth');


const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// File uploading
app.use(fileupload());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
//app.use(xss());

// Rate limiting
/* const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minitos
    max: 100
});
app.use(limiter); */

// Prevent http param pollution
app.use(hpp());

// Enable CORS
app.use(cors());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//Mount routers
app.use('/api/v1/anuncios', anuncios);
app.use('/api/v1/imagenes-principales', imagenesPrincipales);
app.use('/api/v1/auth', auth);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`
    Server running in ${process.env.NODE_ENV} 
    mode on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});