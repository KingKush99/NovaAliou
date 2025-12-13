import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../../components/Header';
import './Game.css';

export default function NameThatMeme() {
    const navigate = useNavigate();
    const [score, setScore] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(0);

    const questions = [
        {
            image: 'https://i.imgflip.com/1g8my4.jpg', // Two Buttons
            options: ['Two Buttons', 'Hard Choice', 'Sweating Hero', 'Daily Struggle'],
            correct: 0
        },
        {
            image: 'https://i.imgflip.com/26am.jpg', // Distracted Boyfriend
            options: ['Cheating Guy', 'Distracted Boyfriend', 'Jealous Girlfriend', 'Looking Back'],
            correct: 1
        },
        {
            image: 'https://i.imgflip.com/1otk96.jpg', // Change My Mind
            options: ['Coffee Talk', 'Prove Me Wrong', 'Change My Mind', 'Debate Me'],
            correct: 2
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
            <Header title="Name That Meme" showBack />

            <div className="game-content">
                <div className="game-image-container">
                    <img
                        src={questions[currentQuestion].image}
                        alt="Meme"
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
