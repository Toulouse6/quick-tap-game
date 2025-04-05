import React, { useEffect, useState } from 'react';
import crownImg from '../../../Assets/crown.png';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useNavigate } from 'react-router-dom';
import './LeaderboardComponent.css';
import GameService from '../../../Services/GameService';
import LoadingBar from '../../SharedArea/LoadingComponent/LoadingComponent';

// Entry structure
type LeaderboardEntry = {
    userId: string;
    username: string;
    score: number;
};

const LeaderboardPage: React.FC = () => {

    // Leaderboard data and loading State
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Fetch leaderboard from service
    useEffect(() => {
        GameService.getLeaderboard()
            .then(setLeaderboard)
            .catch(err => console.error('Error fetching leaderboard:', err))
            .finally(() => setLoading(false));
    }, []);

    // Return
    return (
        <div className="leaderboard-container">

            <LoadingBar loading={loading} />

            {/* Show data after loading */}
            {!loading && (
                <>
                    <h2 className="leaderboard-title">HIGHSCORES TABLE</h2>

                    {/* Table */}
                    <TableContainer component={Paper} className="leaderboard-table">
                        <Table>
                            {/* Table header */}
                            <TableHead>
                                <TableRow className="leaderboard-header">
                                    <TableCell align="center">POS</TableCell>
                                    <TableCell align="center">Player name</TableCell>
                                    <TableCell align="center">Score</TableCell>
                                </TableRow>
                            </TableHead>

                            {/* Table body */}
                            <TableBody>
                                {leaderboard.slice(0, 5).map((entry, idx) => {
                                    const isFirst = idx === 0;
                                    const position = `${idx + 1}${['st', 'nd', 'rd'][idx] || 'th'}`;

                                    return (
                                        <TableRow key={entry.userId + idx} className={isFirst ? 'first-place-row' : ''}>
                                            {/* 1st place */}
                                            <TableCell align="center">
                                                {isFirst ? (
                                                    <span className="crown-cell">
                                                        <img src={crownImg} alt="crown" className="crown-icon" />
                                                        1st
                                                    </span>
                                                ) : (
                                                    position
                                                )}
                                            </TableCell>
                                            {/* 1st place styling */}
                                            <TableCell align="center" className={isFirst ? 'highlight-name' : ''}>
                                                {entry.username}
                                            </TableCell>

                                            <TableCell align="center" className={isFirst ? 'highlight-score' : ''}>
                                                {entry.score}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Restart btn */}
                    <Button
                        onClick={() => navigate('/game')}
                        variant="contained"
                        className="material-button"
                    >
                        <SendIcon sx={{ marginRight: 1 }} />Restart game
                    </Button>
                </>
            )}
        </div>
    );
}

export default LeaderboardPage;
