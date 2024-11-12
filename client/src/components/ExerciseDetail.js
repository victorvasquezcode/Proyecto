import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import "./ExerciseDetail.css";

const ExerciseDetail = () => {
  const { exerciseId } = useParams();
  const navigate = useNavigate();
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userCode, setUserCode] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    fetchExerciseDetail();
  }, [exerciseId]);

  const fetchExerciseDetail = async () => {
    setLoading(true);
    setUserCode(""); // Limpiar editor
    setFeedback(""); // Limpiar feedback
    setIsCorrect(false); // Resetear estado

    try {
      const response = await fetch(
        `http://localhost:5000/api/problems/details/${exerciseId}`,
        {
          headers: { "auth-token": localStorage.getItem("auth-token") },
        }
      );

      if (!response.ok) {
        throw new Error("Error al obtener el detalle del ejercicio.");
      }

      const data = await response.json();
      setExercise(data.exercise);

      const progressResponse = await fetch(
        `http://localhost:5000/api/user-progress/progress`,
        {
          headers: { "auth-token": localStorage.getItem("auth-token") },
        }
      );

      const progressData = await progressResponse.json();
      if (progressData.success) {
        const solvedProblem = progressData.progress.solvedProblems.find(
          (p) => p.problemCode === exerciseId
        );

        if (solvedProblem && solvedProblem.status === "correcto") {
          setIsCorrect(true);
          setUserCode(solvedProblem.userCode); // Mostrar el código
        }
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/validate/validate-answer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("auth-token"),
          },
          body: JSON.stringify({
            code: exercise.code,
            userCode,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al validar la respuesta.");
      }

      const data = await response.json();
      setFeedback(data.validation.feedback);
      setIsCorrect(data.validation.isCorrect);

      if (data.validation.isCorrect) {
        await fetch(`http://localhost:5000/api/user-progress/update-progress`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("auth-token"),
          },
          body: JSON.stringify({
            problemCode: exercise.code,
            status: "correcto",
            userCode,
          }),
        });
      }
    } catch (error) {
      setFeedback("Hubo un error al validar tu código. Inténtalo nuevamente.");
      console.error(error.message);
    }
  };

  const handleNextExercise = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/problems/generate-problem`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("auth-token"),
          },
          body: JSON.stringify({
            topic: exercise.topic,
            level: exercise.level,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al generar el siguiente ejercicio.");
      }

      const data = await response.json();
      navigate(`/exercise/${data.problem.code}`);
    } catch (error) {
      console.error("Error al generar el siguiente ejercicio:", error.message);
      setFeedback("Hubo un problema al generar el siguiente ejercicio.");
    }
  };

  return (
    <div className="exercise-detail-container">
      {loading && <p className="loading">Cargando detalles del ejercicio...</p>}
      
      {exercise && (
        <>
          <div className="exercise-header">
            <h2>{exercise.title}</h2>
            <p className="exercise-level">Nivel: {exercise.level}</p>
          </div>
          <div className="exercise-description">
            <p>{exercise.description}</p>
          </div>
          <div className="exercise-example">
            <h3>Ejemplo de Entrada:</h3>
            <pre>{exercise.exampleInput}</pre>
          </div>
          <div className="exercise-example">
            <h3>Ejemplo de Salida:</h3>
            <pre>{exercise.exampleOutput}</pre>
          </div>
          <div className="code-editor">
            <h3>Escribe tu solución:</h3>
            <CodeMirror
              value={userCode}
              height="200px"
              extensions={[javascript()]}
              onChange={(value) => setUserCode(value)}
              editable={!isCorrect} // Bloquear si está resuelto
            />
            {!isCorrect && (
              <button onClick={handleSubmit} className="submit-button">
                Enviar Solución
              </button>
            )}
          </div>
          {feedback && (
            <div className={`feedback-box ${isCorrect ? "success" : "error"}`}>
              <p>{feedback}</p>
            </div>
          )}
          {isCorrect && (
            <button onClick={handleNextExercise} className="next-button">
              Siguiente Ejercicio
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default ExerciseDetail;
