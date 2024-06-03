const express = require('express');
const router = express.Router();
const auth = require('../controllers/auth.controller')
const Authorize= require('../middlewares/auth.middleware');

// POST: api/auth
router.post('/', auth.login)

// GET: api/auth/tiempo
router.get ('/tiempo',Authorize('Administrador'), auth.tiempo)

module.exports = router