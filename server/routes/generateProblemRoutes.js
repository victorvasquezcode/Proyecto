const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid"); // Para generar códigos únicos
const Exercise = require("../models/Exercise"); // Modelo de la base de datos

function generatePrompt(topic, level) {
  return `
    Genera un problema de codificación en formato JSON con el tema "${topic}" y nivel "${level}". Formato esperado:
    {
        "title": "Título del problema",
        "description": "Descripción detallada",
        "exampleInput": "Ejemplo de entrada",
        "exampleOutput": "Ejemplo de salida",
        "solution": {
            "language": "Lenguaje (Python, Java, etc.)",
            "code": "Código solución",
            "explanation": "Explicación breve"
        }
    }
    `;
}

router.post("/generate-problem", async (req, res) => {
  const { topic, level } = req.body;

  if (!topic || !level) {
    return res.status(400).json({
      success: false,
      error: "Faltan campos requeridos: topic o level.",
    });
  }
  // Ruta para listar todos los ejercicios creados
  router.get("/list", async (req, res) => {
    try {
      const exercises = await Exercise.find(
        {},
        "code title topic level createdAt"
      ).sort({ createdAt: -1 });

      if (!exercises.length) {
        return res.status(404).json({
          success: false,
          message: "No se encontraron ejercicios.",
        });
      }

      res.json({ success: true, exercises });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al obtener la lista de ejercicios.",
        error: error.message,
      });
    }
  });

  try {
    const fetch = (await import("node-fetch")).default;

    const response = await fetch("http://127.0.0.1:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3.2",
        prompt: generatePrompt(topic, level),
        format: "json",
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error en Ollama: ${response.statusText}`);
    }

    const { response: problemJson } = await response.json();

    let problemData;
    try {
      problemData = JSON.parse(problemJson);
    } catch (parseError) {
      throw new Error("La respuesta generada no contiene un JSON válido.");
    }

    // Validar campos requeridos en la respuesta generada
    const requiredFields = [
      "title",
      "description",
      "exampleInput",
      "exampleOutput",
      "solution",
    ];

    for (const field of requiredFields) {
      if (!problemData[field]) {
        throw new Error(
          `Falta el campo obligatorio "${field}" en el problema generado.`
        );
      }
    }

    // Validar estructura de la solución
    if (
      !problemData.solution.language ||
      !problemData.solution.code ||
      !problemData.solution.explanation
    ) {
      throw new Error(
        'El campo "solution" debe contener "language", "code" y "explanation".'
      );
    }

    // Generar código único y guardar el problema
    const uniqueCode = uuidv4();
    const newExercise = new Exercise({
      code: uniqueCode,
      topic,
      level,
      title: problemData.title,
      description: problemData.description,
      prompt: generatePrompt(topic, level),
      exampleInput: problemData.exampleInput,
      exampleOutput: problemData.exampleOutput,
      solution: problemData.solution.code.replace(/\n/g, ""), // Elimina saltos de línea
    });

    await newExercise.save();

    res.json({ success: true, problem: newExercise });
  } catch (error) {
    console.error("Error al generar el problema:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});
// Obtener ejercicios por tema
router.get("/:topicId", async (req, res) => {
  const { topicId } = req.params;

  try {
    const exercises = await Exercise.find({ topic: topicId });

    if (!exercises || exercises.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No se encontraron ejercicios para este tema.",
      });
    }

    res.json({ success: true, exercises });
  } catch (error) {
    console.error("Error al obtener ejercicios:", error);
    res
      .status(500)
      .json({ success: false, error: "Error al obtener ejercicios." });
  }
});

// Obtener detalles de un ejercicio por su código único
router.get("/details/:exerciseCode", async (req, res) => {
  const { exerciseCode } = req.params;

  try {
    const exercise = await Exercise.findOne({ code: exerciseCode });

    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: "No se encontró el ejercicio solicitado.",
      });
    }

    res.json({ success: true, exercise });
  } catch (error) {
    console.error("Error al obtener detalles del ejercicio:", error);
    res.status(500).json({
      success: false,
      error: "Error al obtener detalles del ejercicio.",
    });
  }
});
router.delete("/clear-exercises", async (req, res) => {
  try {
    await Exercise.deleteMany({});
    res.json({
      success: true,
      message: "Todos los ejercicios han sido eliminados.",
    });
  } catch (error) {
    console.error("Error al eliminar los ejercicios:", error.message);
    res
      .status(500)
      .json({ success: false, error: "Error al eliminar los ejercicios." });
  }
});
module.exports = router;
