const asyncHandler = require("express-async-handler");
const Vehiculo = require("../models/vehiculo.model");
const User = require("../models/user.model");

const registerVehiculo = asyncHandler(async (req, res) => {
  const { vehiculo } = req.body;

  if (!vehiculo || !vehiculo.matricula || !vehiculo.marca || !vehiculo.modelo || !vehiculo.anyo_matriculacion) {
    return res.status(400).json({ message: "Matrícula, marca, modelo y año son obligatorios" });
  }

  const matriculaExists = await Vehiculo.findOne({ matricula: vehiculo.matricula.toUpperCase() }).exec();
  if (matriculaExists) {
    return res.status(409).json({ message: "Esta matrícula ya está registrada en el sistema" });
  }

  const newVehiculo = await Vehiculo.create({
    matricula: vehiculo.matricula.toUpperCase(),
    marca: vehiculo.marca,
    modelo: vehiculo.modelo,
    anyo_matriculacion: vehiculo.anyo_matriculacion,
    color: vehiculo.color,
    puertas: vehiculo.puertas,
    observaciones: vehiculo.observaciones,
    propietario: req.userId,
  });

  if (newVehiculo) {
    await User.findByIdAndUpdate(req.userId, {
      $push: { vehiculos: newVehiculo._id },
      $set: { estado_resolucion: "pendiente" },
    });

    res.status(201).json({
      message: "Vehículo registrado correctamente",
      vehiculo: newVehiculo,
    });
  } else {
    res.status(422).json({ message: "No se pudo registrar el vehículo" });
  }
});

const updateVehiculo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { vehiculo } = req.body;

  if (!vehiculo || !vehiculo.matricula || !vehiculo.marca || !vehiculo.modelo) {
    return res.status(400).json({ message: "Faltan datos obligatorios para la actualización" });
  }

  const existingVehiculo = await Vehiculo.findById(id);

  if (!existingVehiculo) {
    return res.status(404).json({ message: "Vehículo no encontrado" });
  }

  if (existingVehiculo.propietario.toString() !== req.userId.toString()) {
    return res.status(403).json({ message: "No tienes permiso para modificar este vehículo" });
  }

  if (vehiculo.matricula.toUpperCase() !== existingVehiculo.matricula) {
    const duplicateMatricula = await Vehiculo.findOne({
      matricula: vehiculo.matricula.toUpperCase(),
      _id: { $ne: id },
    });
    if (duplicateMatricula) {
      return res.status(409).json({ message: "La nueva matrícula ya está registrada por otro usuario" });
    }
  }

  const updatedVehiculo = await Vehiculo.findByIdAndUpdate(
    id,
    {
      matricula: vehiculo.matricula.toUpperCase(),
      marca: vehiculo.marca,
      modelo: vehiculo.modelo,
      anyo_matriculacion: vehiculo.anyo_matriculacion,
      color: vehiculo.color,
      puertas: vehiculo.puertas,
      observaciones: vehiculo.observaciones,
    },
    { new: true, runValidators: true },
  );

  await User.findByIdAndUpdate(req.userId, { estado_resolucion: "pendiente" });

  res.status(200).json({
    message: "Vehículo actualizado correctamente",
    vehiculo: updatedVehiculo,
  });
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
    usuario: userExists.nombre + " " + userExists.apellidos,
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
