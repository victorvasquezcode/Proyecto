import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ExerciseList.css";

const ExerciseList = () => {
  const { topicId } = useParams();
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/problems/${topicId}`,
          {
            headers: {
              "auth-token": localStorage.getItem("auth-token"),
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error al obtener los ejercicios.");
        }

        const data = await response.json();
        setExercises(data.exercises);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, [topicId]);

  return (
    <div className="exercise-list-container">
      <h2>Ejercicios de {topicId}</h2>
      {loading && <p>Cargando ejercicios...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && (
        <ul>
          {exercises.length > 0 ? (
            exercises.map((exercise) => (
              <li
                key={exercise.code}
                className="exercise-item"
                onClick={() => navigate(`/exercise/${exercise.code}`)}
              >
                <h3>{exercise.title}</h3>
                <p>{exercise.description}</p>
              </li>
            ))
          ) : (
            <p>No hay ejercicios disponibles para este tema.</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default ExerciseList;
