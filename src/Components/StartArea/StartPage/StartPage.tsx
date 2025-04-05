import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    TextField,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import './StartPage.css';
import GameService from '../../../Services/GameService';

const StartPage: React.FC = () => {

    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Handle Start
    const handleStart = async () => {
        if (!username.trim()) return;
        setLoading(true);

        // Create User
        try {
            const { userId } = await GameService.createUser(username);
            localStorage.setItem('userId', userId);
            localStorage.setItem('username', username);
            navigate('/game');

        } catch (err) {
            console.error('Error getting userId:', err);
            alert('Could not start game. Please try again.');

        } finally {
            setLoading(false);
        }
    };

    // Return
    return (
        <div className="start-page">
            <h1 className="start-title">Welcome to mavens Game</h1>

            <Box className="start-container">
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

export default StartPage;