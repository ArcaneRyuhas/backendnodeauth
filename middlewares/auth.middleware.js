const jwt = require('jsonwebtoken');
const jwtsecret = process.env.JWT_SECRET;
const ClaimTypes = require('../config/claimtypes');
const { GeneraToken } = require('../services/jwttoken.service');

const Authorize = (rol) => {
  return async (req, res, next) => {
    try {
      const authHeader = req.header('Authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json();
      }

      // Obtiene el token de la solicitud
      const token = authHeader.split(' ')[1];

      // Verifica el token, si no es válido envía error y salta al catch
      const decodedToken = jwt.verify(token, jwtsecret);

      // Verifica si el rol está autorizado
      if (!rol.split(',').includes(decodedToken[ClaimTypes.Role])) {
        return res.status(401).json();
      }

      // Si tiene acceso, se permite continuar con el método y se obtienen los datos del usuario
      req.decodedToken = decodedToken;

      // Código para enviar un nuevo token
      const minutosRestantes = (decodedToken.exp - (new Date().getTime() / 1000)) / 60;
      // Si quedan 5 minutos, le mandamos un nuevo token
      if (minutosRestantes < 5) {
        const nuevoToken = GeneraToken(decodedToken[ClaimTypes.Name], decodedToken[ClaimTypes.GivenName], decodedToken[ClaimTypes.Role]);
        res.header('Set-Authorization', nuevoToken);
      }

      // Continúa con el método
      next();
    } catch (error) {
      return res.status(401).json();
    }
  };
};

module.exports = Authorize;
