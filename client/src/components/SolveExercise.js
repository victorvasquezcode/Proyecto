import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./SolveExercise.css";

const SolveExercise = () => {
  const { exerciseCode } = useParams();
  const [exercise, setExercise] = useState(null);
  const [userCode, setUserCode] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/exercises/details/${exerciseCode}`,
          {
            headers: {
              "auth-token": localStorage.getItem("auth-token"),
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error al obtener el ejercicio.");
        }

        const data = await response.json();
        setExercise(data.exercise);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchExercise();
  }, [exerciseCode]);

  const handleSubmit = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/validate-answer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("auth-token"),
          },
          body: JSON.stringify({
            code: exercise.code,
            userCode: userCode,
          }),
        }
      );

      const data = await response.json();
      setFeedback(data.validation.feedback);
    } catch (error) {
      console.error("Error al validar la respuesta:", error);
      setFeedback("Hubo un error al validar tu respuesta. Inténtalo de nuevo.");
    }
  };

  return (
    <div className="solve-exercise-container">
      {loading ? (
        <p>Cargando ejercicio...</p>
      ) : (
        <>
          <h2>{exercise.title}</h2>
          <p>{exercise.description}</p>
          <textarea
            value={userCode}
            onChange={(e) => setUserCode(e.target.value)}
            placeholder="Escribe tu solución aquí..."
          ></textarea>
          <button onClick={handleSubmit}>Enviar Solución</button>
          {feedback && <p className="feedback">{feedback}</p>}
        </>
      )}
    </div>
  );
};

export default SolveExercise;
