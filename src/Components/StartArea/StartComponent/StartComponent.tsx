import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    TextField,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import './StartComponent.css';
import GameService from '../../../Services/GameService';

const StartComponent: React.FC = () => {
    // States
    const [username, setUsername] = useState(''); // Prevent empty names
    const [loading, setLoading] = useState(false); // Loading states

    const navigate = useNavigate();

    // Handle game start
    const handleStart = async () => {
        if (!username.trim()) return;
        setLoading(true);

        try {
            // Fetch user from service
            const { userId } = await GameService.createUser(username);

            // Save to Storage
            localStorage.setItem('userId', userId);
            localStorage.setItem('username', username);

            navigate('/game');

        } catch (err) {
            console.error('Error getting userId:', err);
            alert('Could not start game. Please try again.');

        } finally {
            // Reset loading state
            setLoading(false);
        }
    };

    // Return
    return (
        <div className="start-page">
            <h1 className="start-title">Welcome to mavens Game</h1>

            <Box className="start-container">
                {/* User input */}
                <div className="input-wrapper">
                    <label className="start-label">Enter player name</label>

                    <TextField
                        variant="outlined"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="start-input"
                        placeholder="Input"
                    />
                </div>
                {/* Start button */}
                <Button
                    variant="contained"
                    className="material-button"
                    onClick={handleStart}
                    disabled={loading || !username.trim()}
                >
                    <SendIcon sx={{ marginRight: 1 }} />
                    Start game
                </Button>

            </Box>
        </div>
    );
};

export default StartComponent;