const express = require('express');
const router = express.Router();
const categorias = require('../controllers/categorias.controller');
const Authorize= require('../middlewares/auth.middleware');

// GET: api/categorias
router.get('/', categorias.getAll);
// GET: api/categorias/
router.get('/:id',Authorize('Usuario,Administrador'), categorias.get);
// POST: api/categorias
router.post('/', categorias.create);
// PUT: api/categorias/5
router.put('/:id',Authorize('Administrador'), categorias.update);
// DELETE: api/categorias/5
router.delete('/:id',Authorize('Administrador'), categorias.delete);

module.exports = router;
