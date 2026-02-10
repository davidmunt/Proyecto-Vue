const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const verifyJWT = (allowedRoles = []) => {
  return async (req, res, next) => {
    // 1. Obtener el token del header (Soporta "Token <token>" o "Bearer <token>")
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader || (!authHeader.startsWith("Token ") && !authHeader.startsWith("Bearer "))) {
      return res.status(401).json({ message: "No autorizado: Formato de token inválido" });
    }

    const token = authHeader.split(" ")[1];

    try {
      // 2. Verificar el token con la clave secreta
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "secreto_temporal");

      // Buscamos al usuario en la base de datos para asegurar que existe y está actualizado
      const loginUser = await User.findById(decoded.id).exec();

      if (!loginUser) {
        return res.status(401).json({ message: "Usuario no encontrado en la base de datos" });
      }

      // 3. Control de Roles (RBAC)
      // Si se pasan roles (ej: ["admin"]), verificamos que el user_type coincida
      if (allowedRoles.length > 0 && !allowedRoles.includes(loginUser.user_type)) {
        return res.status(403).json({
          message: `Acceso prohibido: Se requiere rol [${allowedRoles.join(", ")}]`,
        });
      }

      // 4. Inyectar datos en la request (req) para que el controlador los use
      req.userId = loginUser._id;
      req.userEmail = loginUser.email;
      req.userRole = loginUser.user_type;
      req.token = token;

      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Sesión expirada, vuelve a loguearte" });
      }
      return res.status(403).json({ message: "Token inválido o manipulado" });
    }
  };
};

module.exports = verifyJWT;
