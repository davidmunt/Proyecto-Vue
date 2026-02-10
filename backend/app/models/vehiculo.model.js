const mongoose = require("mongoose");

const vehiculoSchema = new mongoose.Schema(
  {
    matricula: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      match: [/^[0-9]{4}[A-Z]{3}$/, "Matrícula no válida (Ej: 1234ABC)"],
    },
    marca: { type: String, required: true },
    modelo: { type: String, required: true },
    anyo_matriculacion: { type: Number, required: true },
    color: String,
    puertas: Number,
    observaciones: String,
    propietario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Vehiculo", vehiculoSchema);
