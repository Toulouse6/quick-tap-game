import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StartPage from './Components/StartArea/StartPage/StartPage';
import GamePage from './Components/GameArea/GamePage/GamePage';
import LeaderboardPage from './Components/LeaderboardArea/LeaderboardPage/LeaderboardPage';
import GameOverPage from './Components/GameArea/GameOver/GameOverPage';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<StartPage />} />
                <Route path="/game" element={<GamePage />} />
                <Route path="/gameover" element={<GameOverPage />} />
                <Route path="/leaderboard" element={<LeaderboardPage />} />
            </Routes>
        </Router>
    );
};

export default App;
