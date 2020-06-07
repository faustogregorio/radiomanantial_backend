
const express = require('express');
const {
    registerUser,
    login,
    logout,
    isAuthenticated
} = require('../controllers/auth');
const { protect } = require("../middleware/auth");


const router = express.Router();

router.post('/register', registerUser);
router.post('/login', login);
router.get('/logout', logout);
router.route('/authenticated').get(protect, isAuthenticated);

module.exports = router;