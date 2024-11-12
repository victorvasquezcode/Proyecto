import React from "react";
import { useNavigate } from "react-router-dom";
import "./ExerciseTopics.css";
import { FaTools, FaCode, FaCogs } from "react-icons/fa";

const ExerciseTopics = () => {
  const navigate = useNavigate(); // Usamos useNavigate para redirigir

  const topics = [
    {
      title: "Procedimientos",
      description: "Ejercicios de procedimientos paso a paso.",
      icon: <FaTools size={40} color="white" />,
      backgroundColor: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
      id: "procedimientos",
    },
    {
      title: "Funciones",
      description: "Aprende a trabajar con funciones.",
      icon: <FaCode size={40} color="white" />,
      backgroundColor: "linear-gradient(135deg, #ee9ca7 0%, #ffdde1 100%)",
      id: "funciones",
    },
    {
      title: "Estructuras de Bloque Secuencial",
      description: "Domina las estructuras de control secuencial.",
      icon: <FaCogs size={40} color="white" />,
      backgroundColor: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
      id: "estructuras",
    },
  ];

  return (
    <div className="exercise-topics-container">
      <h2>Temas de Ejercicios</h2>
      <div className="topics-grid">
        {topics.map((topic, index) => (
          <div
            key={index}
            className="card"
            style={{ background: topic.backgroundColor }}
          >
            <div className="card-icon">{topic.icon}</div>
            <h3>{topic.title}</h3>
            <p>{topic.description}</p>
            <button
              className="btn"
              onClick={() => navigate(`/exercises/${topic.id}`)}
            >
              Ver Ejercicios
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExerciseTopics;
