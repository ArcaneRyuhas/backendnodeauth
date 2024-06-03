const { rol } = require('../models');
let self = {};

// GET: api/roles
self.getAll = async function (req, res, next) {
  try {
    let data = await rol.findAll({ attributes: ['id', 'nombre'] });
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
}

module.exports = self;
