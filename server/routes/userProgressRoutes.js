const express = require("express");
const router = express.Router();
const UserProgress = require("../models/UserProgress");
const verifyToken = require("../middlewares/verifyToken");
const Exercise = require("../models/Exercise");

// Ruta para registrar el progreso del usuario
router.post("/update-progress", verifyToken, async (req, res) => {
  const { problemCode, status, userCode } = req.body;

  if (!problemCode || !status || !userCode) {
    return res.status(400).json({
      message: "Faltan campos requeridos: problemCode, status o userCode.",
    });
  }

  try {
    const problem = await Exercise.findOne({ code: problemCode });
    if (!problem) {
      return res.status(404).json({ message: "Problema no encontrado." });
    }

    let score = 0;
    switch (problem.level) {
      case "fácil":
        score = 10;
        break;
      case "medio":
        score = 20;
        break;
      case "difícil":
        score = 30;
        break;
      default:
        score = 10;
    }

    let userProgress = await UserProgress.findOne({ userId: req.user._id });

    if (!userProgress) {
      userProgress = new UserProgress({
        userId: req.user._id,
        solvedProblems: [{ problemCode, status, score, userCode }],
        totalScore: status === "correcto" ? score : 0,
      });
    } else {
      const existingProblem = userProgress.solvedProblems.find(
        (p) => p.problemCode === problemCode
      );

      if (existingProblem) {
        existingProblem.status = status;
        existingProblem.attempts += 1;
        existingProblem.userCode = userCode; // Actualizar el código del usuario
        if (existingProblem.status !== "correcto" && status === "correcto") {
          userProgress.totalScore += score;
        }
      } else {
        userProgress.solvedProblems.push({
          problemCode,
          status,
          score,
          userCode,
        });
        if (status === "correcto") {
          userProgress.totalScore += score;
        }
      }
    }

    await userProgress.save();
    res.json({
      message: "Progreso actualizado con éxito",
      progress: userProgress,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "El problema ya fue registrado para este usuario.",
      });
    }
    res.status(500).json({
      message: "Error al actualizar el progreso",
      error: error.message,
    });
  }
});

// Ruta para obtener el progreso del usuario
router.get("/progress", verifyToken, async (req, res) => {
  try {
    const userProgress = await UserProgress.findOne({
      userId: req.user._id,
    }).populate("userId", "username");

    if (!userProgress) {
      return res.json({
        success: true,
        message: "Aún no hay progreso registrado para este usuario.",
        progress: null,
      });
    }

    // Filtrar campos relevantes para la respuesta
    const progress = {
      userId: userProgress.userId._id,
      username: userProgress.userId.username,
      totalScore: userProgress.totalScore,
      solvedProblems: userProgress.solvedProblems.map((problem) => ({
        problemCode: problem.problemCode,
        status: problem.status,
        attempts: problem.attempts,
        score: problem.score,
        userCode: problem.userCode, // Mostrar el código del usuario
      })),
    };

    res.json({ success: true, progress });
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener el progreso",
      error: error.message,
    });
  }
});

// Eliminar el progreso de un usuario
router.delete("/delete-progress", verifyToken, async (req, res) => {
  try {
    const userId = req.user._id;

    const result = await UserProgress.deleteOne({ userId });
    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "No se encontró progreso para este usuario.",
      });
    }

    res.json({ success: true, message: "Progreso eliminado con éxito." });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al eliminar el progreso.",
      error: error.message,
    });
  }
});

module.exports = router;
