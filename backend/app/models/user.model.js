const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    dni: {
      type: String,
      required: true,
      unique: true,
      match: [/^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/i, "DNI no válido"],
    },
    nombre: { type: String, required: true },
    apellidos: { type: String, required: true },
    telefono: { type: String, required: true },
    email: {
      type: String,
      required: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Email no válido"],
    },
    fecha_registro: {
      type: Date,
      default: Date.now,
    },
    estado_resolucion: {
      type: String,
      enum: ["pendiente", "en trámite", "resuelto", "rechazado"],
      default: "pendiente",
    },
    user_type: {
      type: String,
      enum: ["admin", "cliente"],
      default: "cliente",
    },
    image: {
      type: String,
      default: "https://static.productionready.io/images/smiley-cyrus.jpg",
    },
    vehiculos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vehiculo",
      },
    ],
  },
  {
    timestamps: true,
  },
);

userSchema.plugin(uniqueValidator);

userSchema.methods.toUserResponse = function () {
  return {
    id: this._id,
    username: this.username,
    dni: this.dni,
    nombre: this.nombre,
    apellidos: this.apellidos,
    email: this.email,
    estado: this.estado_resolucion,
    user_type: this.user_type,
    image: this.image,
    vehiculos: this.vehiculos,
  };
};

module.exports = mongoose.model("User", userSchema);
