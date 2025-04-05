import React, { useEffect, useRef, useState } from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './GamePage.css';
import LoadingBar from '../../SharedArea/LoadingBar/LoadingBar';
import { Side } from '../../../Models/GameModel';
import GameService from '../../../Services/GameService';
import GameHeader from '../../SharedArea/HeaderArea/HeaderComponent';

const GamePage: React.FC = () => {
    const [score, setScore] = useState(0);
    const [side, setSide] = useState<Side | null>(null);
    const [feedback, setFeedback] = useState('');
    const [gameOver, setGameOver] = useState(false);
    const [, setResponseTime] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const { username } = GameService.getStoredUser();

    const navigate = useNavigate();
    const scoreRef = useRef(0);
    const sideRef = useRef<Side | null>(null);
    const isReadyRef = useRef(false);
    const isGameActiveRef = useRef(true);
    const targetDisplayedTimeRef = useRef<number>(0);
    const keypressRegisteredRef = useRef(false);
    const timeoutRefs = useRef<{ [key: string]: NodeJS.Timeout | null }>({
        display: null,
        timeout: null,
        nextRound: null
    });

    const clearAllTimeouts = () => {
        Object.values(timeoutRefs.current).forEach(timeout => {
            if (timeout) clearTimeout(timeout);
        });
        timeoutRefs.current = { display: null, timeout: null, nextRound: null };
    };

    const sendScoreAndRedirect = async (score: number) => {
        const { userId, username } = GameService.getStoredUser();
        if (!userId) {
            console.error('No userId found in localStorage');
            return;
        }

        setLoading(true);
        try {
            const res = await GameService.saveScore(userId, score);
            if (res.success) {
                await GameService.delay(2000);
                navigate('/gameover', {
                    state: { score, username },
                });
            } else {
                console.error('Score not saved:', res);
            }
        } catch (err) {
            console.error('Error sending score:', err);
        } finally {
            setLoading(false);
        }
    };


    const startNextRound = () => {
        clearAllTimeouts();
        setSide(null);
        isReadyRef.current = false;
        keypressRegisteredRef.current = false;
        setFeedback('');

        if (!isGameActiveRef.current) return;
        const waitTime = Math.random() * 3000 + 2000;

        timeoutRefs.current.display = setTimeout(() => {
            const randomSide = GameService.getRandomSide();
            setSide(randomSide);
            sideRef.current = randomSide;

            targetDisplayedTimeRef.current = Date.now();
            isReadyRef.current = true;
            keypressRegisteredRef.current = false;

            timeoutRefs.current.timeout = setTimeout(() => {
                if (isReadyRef.current && isGameActiveRef.current && !keypressRegisteredRef.current) {
                    isReadyRef.current = false;
                    setFeedback('tooLate');
                    setGameOver(true);
                    isGameActiveRef.current = false;
                    sendScoreAndRedirect(scoreRef.current);
                }
            }, 1000);
        }, waitTime);
    };


    const handleKeyPress = (e: KeyboardEvent) => {
        const key = e.key.toLowerCase();
        const now = Date.now();
        const currentSide = sideRef.current;

        keypressRegisteredRef.current = true;
        if (!isGameActiveRef.current) return;

        if (!isReadyRef.current) {
            isGameActiveRef.current = false;
            clearAllTimeouts();
            setFeedback((key === 'a' || key === 'd') ? 'tooSoon' : 'wrongKey');
            setGameOver(true);
            sendScoreAndRedirect(scoreRef.current);
            return;
        }

        if (!isReadyRef.current || !currentSide) {
            isGameActiveRef.current = false;
            setFeedback('wrongKey');
            setGameOver(true);
            sendScoreAndRedirect(scoreRef.current);
            return;
        }

        isReadyRef.current = false;
        keypressRegisteredRef.current = true;
        const reactionTime = now - targetDisplayedTimeRef.current;
        setResponseTime(reactionTime);

        if ((key === 'a' && currentSide === 'left') || (key === 'd' && currentSide === 'right')) {
            setScore(prev => {
                const newScore = prev + 1;
                scoreRef.current = newScore;
                return newScore;
            });
            setFeedback('success');
            timeoutRefs.current.nextRound = setTimeout(() => startNextRound(), 2000);
        } else {
            isGameActiveRef.current = false;
            setFeedback('wrongKey');
            setGameOver(true);
            sendScoreAndRedirect(scoreRef.current);
        }
    };

    useEffect(() => {
        const handleKeyPressWrapper = (e: KeyboardEvent) => handleKeyPress(e);
        window.addEventListener('keydown', handleKeyPressWrapper);

        isGameActiveRef.current = true;
        startNextRound();

        return () => {
            window.removeEventListener('keydown', handleKeyPressWrapper);
            clearAllTimeouts();
            isGameActiveRef.current = false;
        };
    }, []);

    return (

        <div className="outer-wrapper">
            <div className="game-container">
                <LoadingBar loading={loading} />
                <GameHeader username={username} score={score} />
                <Snackbar
                    open={feedback !== ''}
                    autoHideDuration={feedback === 'success' ? 1000 : 3000}
                    onClose={() => {
                        if (!gameOver || feedback === 'success') {
                            setFeedback('');
                        }
                    }}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert
                        severity={
                            feedback === 'success'
                                ? 'success'
                                : feedback === 'tooSoon' || feedback === 'tooLate'
                                    ? 'warning'
                                    : 'error'
                        }
                    >
                        {
                            feedback === 'success' ? 'Nice!' :
                                feedback === 'tooSoon' ? 'Too soon!' :
                                    feedback === 'tooLate' ? 'Too late!' :
                                        feedback === 'wrongKey' ? 'Wrong key!' : ''
                        }
                    </Alert>
                </Snackbar>
                {!loading && (
                    <>
                        <div className="game-box">
                            <div className="shape-zone">
                                {side === 'left' && !gameOver && <div className="shape" />}
                            </div>
                            <div className="shape-zone">
                                {side === 'right' && !gameOver && <div className="shape" />}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>


    )
};

export default GamePage;
