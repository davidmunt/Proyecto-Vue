const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema(
  {
    // Referencia al usuario (dueño del token)
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Guardamos el string del token
    token: {
      type: String,
      required: true,
      index: true,
    },
    // Guardamos el tipo de usuario para agilizar filtros en el backend
    user_type: {
      type: String,
      enum: ["admin", "client"],
      required: true,
    },
    // Fecha de expiración (opcional, para limpieza automática)
    expiresAt: {
      type: Date,
      default: () => new Date(+new Date() + 24 * 60 * 60 * 1000), // Expira en 24h por defecto
    },
  },
  {
    timestamps: true,
  },
);

// Índice para que los tokens expiren solos en MongoDB (TTL Index)
tokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("Token", tokenSchema);
