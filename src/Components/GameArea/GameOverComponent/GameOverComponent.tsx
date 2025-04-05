import React, { useState } from 'react';
import { Button } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import LoadingBar from '../../SharedArea/LoadingComponent/LoadingComponent';
import SendIcon from '@mui/icons-material/Send';
import './GameOverComponent.css';
import GameHeader from '../../SharedArea/HeaderComponent/HeaderComponent';

const GameOverPage: React.FC = () => {
    // Loading state
    const [loading, setLoading] = useState(false);

    // Router hooks
    const navigate = useNavigate();
    const location = useLocation();

    // Extract score and username
    const { score, username } = location.state || {};

    // Navigate with 1 sec loading delay
    const handleNavigate = async (path: string) => {
        setLoading(true);

        setTimeout(() => {
            navigate(path);
            setLoading(false);
        }, 1000);
    };

    // Return
    return (
        <div className="outer-wrapper">
            <div className="gameover-container">

                <LoadingBar loading={loading} />
                {/* Header with username only */}
                <GameHeader username={username} />

                {!loading && (
                    <>
                        <h1 className="gameover-title">GAME OVER!</h1>

                        {/* Score */}
                        <div className="score">
                            <span>Score {score}</span>
                        </div>

                        <div className="gameover-buttons">
                            {/* Highscore btn */}
                            <Button
                                variant="outlined"
                                onClick={() => handleNavigate('/leaderboard')}
                                className="highscore-button"
                            >
                                Highscore
                            </Button>
                            {/* Restart btn */}
                            <Button
                                variant="contained"
                                onClick={() => handleNavigate('/game')}
                                className="material-button"
                            >
                                <SendIcon sx={{ marginRight: 1 }} />Restart game
                            </Button>

                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default GameOverPage;
