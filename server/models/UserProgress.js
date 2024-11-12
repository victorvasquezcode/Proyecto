const mongoose = require("mongoose");

const UserProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  solvedProblems: [
    {
      problemCode: { type: String, required: true },
      status: { type: String, enum: ["correcto", "incorrecto"], required: true },
      attempts: { type: Number, default: 1 },
      score: { type: Number, required: true },
      userCode: { type: String, required: true }, // Código del usuario es obligatorio
    },
  ],
  totalScore: { type: Number, default: 0 },
});

// Índice único para evitar problemas duplicados en la lista de progreso de un usuario
UserProgressSchema.index({ userId: 1, "solvedProblems.problemCode": 1 }, { unique: true });

module.exports = mongoose.model("UserProgress", UserProgressSchema);
