const express = require("express");
const router = express.Router();
const Exercise = require("../models/Exercise"); // Modelo de la base de datos

function generateValidationPrompt(
  problemDescription,
  userCode,
  expectedSolution
) {
  return `
    Eres un evaluador de código. Evalúa si el siguiente código del usuario resuelve correctamente el problema planteado.

    Problema:
    ${problemDescription}

    Código del Usuario:
    ${userCode}

    Solución Esperada:
    ${expectedSolution}

    Compara los siguientes aspectos:
    - ¿El código del usuario sigue el mismo flujo lógico que la solución esperada?
    - ¿Se están manejando correctamente las operaciones necesarias, como la conexión a la API y el guardado en la base de datos?
    - ¿Faltan elementos clave en la implementación?

    Devuelve un JSON con el formato:
    {
        "isCorrect": true/false,
        "feedback": "Texto explicando qué falta o qué se ha hecho incorrectamente, y sugerencias para mejorar."
    }
  `;
}

router.post("/validate-answer", async (req, res) => {
  const { code, userCode } = req.body;

  try {
    const exercise = await Exercise.findOne({ code });
    if (!exercise) {
      return res
        .status(404)
        .json({ success: false, error: "Ejercicio no encontrado." });
    }

    const cleanUserCode = userCode.replace(/\n/g, ""); // Limpia saltos de línea
    const cleanExpectedCode = exercise.solution.replace(/\n/g, ""); // Limpia solución esperada

    const response = await fetch("http://127.0.0.1:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3.2",
        prompt: generateValidationPrompt(
          exercise.description,
          cleanUserCode,
          cleanExpectedCode
        ),
        format: "json",
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error en Ollama: ${response.statusText}`);
    }

    const { response: validationJson } = await response.json();
    const validationResult = JSON.parse(validationJson);

    res.json({ success: true, validation: validationResult });
  } catch (error) {
    console.error("Error al validar la respuesta:", error.message);
    res
      .status(500)
      .json({ success: false, error: "Error al validar la respuesta." });
  }
});

module.exports = router;
