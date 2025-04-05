import React from 'react';
import './HeaderComponent.css';

// Props 
interface GameHeaderProps {
    username?: string;
    score?: number;
    showScore?: boolean;
}

const HeaderComponent: React.FC<GameHeaderProps> = ({ username = 'Player Name', score, showScore = true }) => {
    // Center when only username shown
    const isCentered = !showScore || typeof score !== 'number';

    // Return
    return (
        <div className={`game-header ${isCentered ? 'center-content' : ''}`}>
            {/* Username */}
            <span className="header-username">{username}</span>
            {/* Score */}
            {showScore && typeof score === 'number' && <span className="header-score">Score {score}</span>}
        </div>
    );
};

export default HeaderComponent;
