import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Problems.css';
import { FaTools, FaCode, FaCogs } from 'react-icons/fa';

const Problems = () => {
  const navigate = useNavigate();

  const topics = [
    {
      title: 'Procedimientos',
      description: 'Ejercicios de procedimientos paso a paso.',
      icon: <FaTools size={40} />,
      backgroundColor: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
      id: 'procedimientos'
    },
    {
      title: 'Funciones',
      description: 'Aprende a trabajar con funciones.',
      icon: <FaCode size={40} />,
      backgroundColor: 'linear-gradient(135deg, #ee9ca7 0%, #ffdde1 100%)',
      id: 'funciones'
    },
    {
      title: 'Estructuras',
      description: 'Domina las estructuras de control secuencial.',
      icon: <FaCogs size={40} />,
      backgroundColor: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
      id: 'estructuras'
    }
  ];

  return (
    <div className="problems-container">
      <h2>Temas de Ejercicios</h2>
      <div className="topics-grid">
        {topics.map((topic, index) => (
          <div
            key={index}
            className="card"
            style={{
              background: topic.backgroundColor,
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              borderRadius: '15px',
              transition: 'transform 0.2s'
            }}
            onClick={() => navigate(`/exercises/${topic.id}`)}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <div className="card-icon" style={{ color: 'white', marginBottom: '10px' }}>
              {topic.icon}
            </div>
            <h3 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '5px' }}>{topic.title}</h3>
            <p style={{ color: 'white', opacity: 0.8 }}>{topic.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Problems;
