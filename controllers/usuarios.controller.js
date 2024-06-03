const { usuario, rol, sequelize } = require('../models');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
let self = {};

// GET: api/usuarios
self.getAll = async function (req, res) {
    try {
      const data = await usuario.findAll({
        raw: true,
        attributes: ['id', 'email', 'nombre', [sequelize.col('rol.nombre'), 'rol']],
        include: { model: rol, attributes: [] }
      });
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json(error);
    }
}
  

// GET: api/usuarios/email
self.get = async function (req, res) {
    try {
      const email = req.params.email;
      const data = await usuario.findOne({
        where: { email: email },
        raw: true,
        attributes: ['id', 'email', 'nombre', [sequelize.col('rol.nombre'), 'rol']],
        include: { model: rol, attributes: [] }
      });
      if (data) {
        return res.status(200).json(data);
      } else {
        return res.status(404).send();
      }
    } catch (error) {
      return res.status(500).json(error);
    }
}  

// POST: api/usuarios
self.create = async function (req, res) {
    try {
      const rolusuario = await rol.findOne({ where: { nombre: req.body.rol } });
      console.log(rolusuario.id);
      const data = await usuario.create({
        id: crypto.randomUUID(),
        email: req.body.email,
        passwordhash: await bcrypt.hash(req.body.password, 10),
        nombre: req.body.nombre,
        rolid: rolusuario.id
      });
      return res.status(201).json({
        id: data.id,
        email: data.email,
        nombre: data.nombre,
        rolid: rolusuario.nombre
      });
    } catch (error) {
      console.log(error);
    }
  }
  
// PUT: api/usuarios/email
self.update = async function (req, res) {
    try {
      const email = req.params.email;
      const rolusuario = await rol.findOne({ where: { nombre: req.body.rol } });
      req.body.rolid = rolusuario.id;
      const data = await usuario.update(req.body, {
        where: { email: email }
      });
      if (data[0] === 0) {
        return res.status(404).send();
      } else {
        return res.status(204).send();
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }
  

// DELETE: api/usuarios/email
self.delete = async function (req, res) {
    try {
      const email = req.params.email;
      let data = await usuario.findOne({ where: { email: email } });
      // No se pueden eliminar categorias protegidas
      if (data.protegido) {
        return res.status(403).send();
      }
      data = await usuario.destroy({ where: { email: email } });
      if (data === 1) {
        return res.status(204).send(); // Elemento eliminado
      }
      return res.status(400).send();
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
}
  
module.exports = self;
