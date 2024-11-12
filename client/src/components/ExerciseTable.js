import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ExerciseTable.css';

const ExerciseTable = ({ exercises }) => {
    const navigate = useNavigate();

    // Manejar clic en un ejercicio para navegar al detalle
    const handleExerciseClick = (exerciseId) => {
        navigate(`/exercise/${exerciseId}`);
    };

    return (
        <div className="exercise-table-container">
            <h2>Lista de Ejercicios</h2>
            <table>
                <thead>
                    <tr>
                        <th>Título</th>
                        <th>Estado</th>
                        <th>Solución</th>
                        <th>Aceptación</th>
                        <th>Dificultad</th>
                    </tr>
                </thead>
                <tbody>
                    {exercises.map((exercise, index) => (
                        <tr key={index} onClick={() => handleExerciseClick(exercise.id)} className="exercise-row">
                            <td>{exercise.title}</td>
                            <td>{exercise.status}</td>
                            <td>{exercise.solution ? 'Sí' : 'No'}</td>
                            <td>{exercise.acceptance}%</td>
                            <td>{exercise.difficulty}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ExerciseTable;
