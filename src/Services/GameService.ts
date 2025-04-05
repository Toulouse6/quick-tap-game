import axios from 'axios';
import { Side } from '../Models/GameModel';

// Backend endpoits
const API_BASE = 'https://quicktap-backend-219181450324.us-central1.run.app/api';

const GameService = {

    // Get User
    async createUser(username: string): Promise<{ userId: string }> {
        const res = await axios.post(`${API_BASE}/user`, { username });
        return res.data;
    },

    // Save Score
    async saveScore(userId: string, score: number): Promise<{ success: boolean }> {
        const res = await axios.post(`${API_BASE}/saveScore`, { userId, score });
        return res.data;
    },

    // Get Leaderboard
    async getLeaderboard() {
        const res = await axios.get(`${API_BASE}/leaderboard`);
        return res.data.leaderboards;
    },


    // Get Side
    getRandomSide(): Side {
        return Math.random() < 0.5 ? 'left' : 'right';
    },

    // Load user
    getStoredUser(): { userId: string | null; username: string } {
        return {
            userId: localStorage.getItem('userId'),
            username: localStorage.getItem('username') || '',
        };
    },

    // Delay helper
    delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};

export default GameService;
