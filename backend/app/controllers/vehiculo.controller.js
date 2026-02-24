const asyncHandler = require("express-async-handler");
const Vehiculo = require("../models/vehiculo.model");
const User = require("../models/user.model");

const MARCAS_AFECTADAS = {
  Seat: ["Ibiza", "Leon", "Altea", "Alhambra"],
  Volkswagen: ["Golf", "Passat", "Polo", "Tiguan"],
  Renault: ["Megane", "Clio", "Laguna", "Scenic"],
  Opel: ["Corsa", "Astra", "Insignia", "Zafira"],
  Ford: ["Focus", "Fiesta", "Mondeo", "Kuga"],
  Peugeot: ["207", "208", "307", "308", "508"],
  Citroen: ["C3", "C4", "C5", "Berlingo"],
  Audi: ["A1", "A3", "A4", "A6"],
};

const RANGO_ANYO = { min: 2006, max: 2013 };

const esVehiculoAfectado = (marca, modelo, anyo) => {
  if (!MARCAS_AFECTADAS[marca]) return false;
  if (!MARCAS_AFECTADAS[marca].includes(modelo)) return false;
  if (anyo < RANGO_ANYO.min || anyo > RANGO_ANYO.max) return false;
  return true;
};

const validarMatricula = (mat) => {
  const nueva = /^[0-9]{4}[BCDFGHJKLMNPQRSTVWXYZ]{3}$/i;
  const vieja = /^[A-Z]{1,2}[0-9]{4}[A-Z]{1,2}$/i;
  return nueva.test(mat) || vieja.test(mat);
};

const registerVehiculo = asyncHandler(async (req, res) => {
  const { vehiculo } = req.body;

  if (!validarMatricula(vehiculo.matricula)) {
    return res.status(400).json({ message: "Formato de matrícula no válido (Ej: 1234BBB o MA1234AB)" });
  }

  if (!esVehiculoAfectado(vehiculo.marca, vehiculo.modelo, vehiculo.anyo_matriculacion)) {
    return res.status(400).json({
      message: "El vehículo no cumple los criterios del Cártel (Marca/Modelo/Año no afectados entre 2006-2013)",
    });
  }

  const matriculaExists = await Vehiculo.findOne({ matricula: vehiculo.matricula.toUpperCase() }).exec();
  if (matriculaExists) {
    return res.status(409).json({ message: "Esta matrícula ya está registrada" });
  }

  const newVehiculo = await Vehiculo.create({
    ...vehiculo,
    matricula: vehiculo.matricula.toUpperCase(),
    propietario: req.userId,
  });

  await User.findByIdAndUpdate(req.userId, {
    $push: { vehiculos: newVehiculo._id },
    $set: { estado_resolucion: "pendiente" },
  });

  res.status(201).json({ message: "Vehículo afectado registrado", vehiculo: newVehiculo });
});

const updateVehiculo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { vehiculo } = req.body;

  if (!validarMatricula(vehiculo.matricula)) {
    return res.status(400).json({ message: "Formato de matrícula no válido" });
  }

  if (!esVehiculoAfectado(vehiculo.marca, vehiculo.modelo, vehiculo.anyo_matriculacion)) {
    return res.status(400).json({ message: "Los nuevos datos no corresponden a un vehículo afectado por el cártel" });
  }

  const existingVehiculo = await Vehiculo.findById(id);
  if (!existingVehiculo || existingVehiculo.propietario.toString() !== req.userId.toString()) {
    return res.status(403).json({ message: "No autorizado o vehículo inexistente" });
  }

  const updatedVehiculo = await Vehiculo.findByIdAndUpdate(
    id,
    { ...vehiculo, matricula: vehiculo.matricula.toUpperCase() },
    { new: true, runValidators: true },
  );

  await User.findByIdAndUpdate(req.userId, { estado_resolucion: "pendiente" });

  res.status(200).json({ message: "Registro actualizado", vehiculo: updatedVehiculo });
});

const deleteVehiculo = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const vehiculo = await Vehiculo.findById(id);

  if (!vehiculo) {
    return res.status(404).json({ message: "El vehículo no existe" });
  }

  if (vehiculo.propietario.toString() !== req.userId.toString()) {
    return res.status(403).json({ message: "No tienes permiso para eliminar este vehículo" });
  }

  await Vehiculo.findByIdAndDelete(id);

  await User.findByIdAndUpdate(req.userId, {
    $pull: { vehiculos: id },
  });

  res.status(200).json({
    message: "Vehículo eliminado correctamente y perfil actualizado",
  });
});

const getVehiculosByUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (req.userRole === "cliente" && req.userId.toString() !== userId) {
    return res.status(403).json({
      message: "No tienes permiso para ver los vehículos de otro usuario.",
    });
  }

  const userExists = await User.findById(userId);
  if (!userExists) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }

  const vehiculos = await Vehiculo.find({ propietario: userId }).exec();

  res.status(200).json({
    count: vehiculos.length,
    vehiculos: vehiculos,
  });
});

module.exports = {
  registerVehiculo,
  updateVehiculo,
  deleteVehiculo,
  getVehiculosByUser,
};
