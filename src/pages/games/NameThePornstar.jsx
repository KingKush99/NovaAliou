import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../../components/Header';
import './Game.css';

export default function NameThePornstar() {
    const navigate = useNavigate();
    const [score, setScore] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(0);

    // Placeholder data - in real app would fetch from API
    const questions = [
        {
            image: 'https://via.placeholder.com/300?text=Star+1',
            options: ['Mia Khalifa', 'Riley Reid', 'Lana Rhoades', 'Abella Danger'],
            correct: 0
        },
        {
            image: 'https://via.placeholder.com/300?text=Star+2',
            options: ['Angela White', 'Sasha Grey', 'Adriana Chechik', 'Violet Myers'],
            correct: 2
        },
        {
            image: 'https://via.placeholder.com/300?text=Star+3',
            options: ['Emily Willis', 'Lena Paul', 'Brandit Love', 'Kendra Lust'],
            correct: 1
        }
    ];

    const handleAnswer = (index) => {
        if (index === questions[currentQuestion].correct) {
            setScore(score + 1);
        }

        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            alert(`Game Over! Score: ${score + (index === questions[currentQuestion].correct ? 1 : 0)}/${questions.length}`);
            navigate('/games');
        }
    };

    return (
        <div className="game-page">
            <Header title="Name The Star" showBack />

            <div className="game-content">
                <div className="game-image-container blur-reveal">
                    <img
                        src={questions[currentQuestion].image}
                        alt="Star"
                        className="game-image"
                    />
                </div>

                <div className="options-grid">
                    {questions[currentQuestion].options.map((option, index) => (
                        <motion.button
                            key={index}
                            className="option-btn"
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleAnswer(index)}
                        >
                            {option}
                        </motion.button>
                    ))}
                </div>

                <div className="score-display">
                    Score: {score}
                </div>
            </div>
        </div>
    );
}
