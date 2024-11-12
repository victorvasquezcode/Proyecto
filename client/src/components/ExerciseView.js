import React, { useState } from 'react';

const ExerciseView = () => {
    const [userAnswer, setUserAnswer] = useState('');
    const [feedback, setFeedback] = useState('');

    const handleSubmit = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/validate-answer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ problemId: selectedProblemId, userAnswer }),
            });

            const data = await response.json();
            setFeedback(data.feedback);
        } catch (error) {
            console.error('Error al enviar la respuesta:', error);
        }
    };

    return (
        <div>
            {/* UI existente */}
            <textarea 
                value={userAnswer} 
                onChange={(e) => setUserAnswer(e.target.value)} 
                placeholder="Escribe tu respuesta aquí..." 
            />
            <button onClick={handleSubmit}>Enviar Respuesta</button>
            <p>{feedback}</p>
        </div>
    );
};
