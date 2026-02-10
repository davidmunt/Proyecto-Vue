const asyncHandler = require("express-async-handler");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const Token = require("../models/token.model");

const registerUser = asyncHandler(async (req, res) => {
  const { user } = req.body;

  if (!user || !user.username || !user.password || !user.dni || !user.nombre || !user.apellidos || !user.email || !user.telefono) {
    return res.status(400).json({ message: "Todos los campos (DNI, Nombre, Email, etc.) son requeridos" });
  }

  const userExists = await User.findOne({
    $or: [{ username: user.username }, { dni: user.dni }],
  }).exec();

  if (userExists) {
    return res.status(409).json({
      message: userExists.dni === user.dni ? "El DNI ya está registrado" : "El nombre de usuario ya existe",
    });
  }

  if (user.password.length < 6) {
    return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres" });
  }

  const hashedPwd = await argon2.hash(user.password);

  const newUser = {
    username: user.username,
    password: hashedPwd,
    dni: user.dni,
    nombre: user.nombre,
    apellidos: user.apellidos,
    email: user.email,
    telefono: user.telefono,
    user_type: "cliente",
  };

  const createdUser = await User.create(newUser);

  if (createdUser) {
    const tokenString = jwt.sign({ id: createdUser._id, user_type: createdUser.user_type }, process.env.JWT_SECRET || "secreto_temporal", {
      expiresIn: "1d",
    });

    await Token.create({
      user_id: createdUser._id,
      token: tokenString,
      user_type: createdUser.user_type,
    });

    const userResponse = await createdUser.toUserResponse();
    res.status(201).json({
      user: {
        ...userResponse,
        token: tokenString,
      },
    });
  } else {
    res.status(422).json({
      errors: { body: "No se pudo registrar el usuario" },
    });
  }
});

const userLogin = asyncHandler(async (req, res) => {
  const { user } = req.body;

  if (!user || !user.email || !user.password) {
    return res.status(400).json({ message: "Email y contraseña son requeridos" });
  }

  const userFound = await User.findOne({ email: user.email }).exec();

  if (!userFound) {
    return res.status(401).json({ message: "Credenciales incorrectas (Email no encontrado)" });
  }

  const isPasswordValid = await argon2.verify(userFound.password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ message: "Credenciales incorrectas (Contraseña falsa)" });
  }

  const tokenString = jwt.sign({ id: userFound._id, user_type: userFound.user_type }, process.env.JWT_SECRET || "secreto_temporal", {
    expiresIn: "1d",
  });

  await Token.create({
    user_id: userFound._id,
    token: tokenString,
    user_type: userFound.user_type,
  });

  const userResponse = await userFound.toUserResponse();

  res.status(200).json({
    user: {
      ...userResponse,
      token: tokenString,
    },
  });
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId).populate("vehiculos").exec();

  if (!user) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }

  const userResponse = await user.toUserResponse();

  res.status(200).json({
    user: {
      ...userResponse,
      token: req.token,
      telefono: user.telefono,
      fecha_registro: user.fecha_registro,
    },
  });
});

const getAllClientes = asyncHandler(async (req, res) => {
  let clientes = await User.find({ user_type: "cliente" }).exec();

  const ordenPrioridad = {
    "en trámite": 1,
    pendiente: 2,
    resuelto: 3,
    rechazado: 4,
  };

  clientes.sort((a, b) => {
    return (ordenPrioridad[a.estado_resolucion] || 5) - (ordenPrioridad[b.estado_resolucion] || 5);
  });

  const clientesResponse = await Promise.all(clientes.map(async (c) => await c.toUserResponse()));

  res.status(200).json({
    total: clientesResponse.length,
    clientes: clientesResponse,
  });
});

const updateClienteEstado = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { nuevoEstado } = req.body;

  const estadosValidos = ["pendiente", "en trámite", "resuelto", "rechazado"];
  if (!estadosValidos.includes(nuevoEstado)) {
    return res.status(400).json({ message: "Estado de resolución no válido" });
  }

  const cliente = await User.findById(id);

  if (!cliente) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }

  if (cliente.user_type !== "cliente") {
    return res.status(403).json({ message: "No se puede modificar el estado de un administrador" });
  }

  cliente.estado_resolucion = nuevoEstado;
  await cliente.save();

  res.status(200).json({
    message: `Estado actualizado a ${nuevoEstado} con éxito`,
    user: await cliente.toUserResponse(),
  });
});

module.exports = {
  registerUser,
  userLogin,
  getCurrentUser,
  getAllClientes,
  updateClienteEstado,
};
