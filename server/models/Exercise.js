const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  topic: { type: String, required: true },
  level: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  prompt: { type: String, required: true }, // Asegúrate de que está definido
  exampleInput: { type: String, required: true },
  exampleOutput: { type: String, required: true },
  solution: { type: String, required: true },
});

module.exports = mongoose.model("Exercise", exerciseSchema);