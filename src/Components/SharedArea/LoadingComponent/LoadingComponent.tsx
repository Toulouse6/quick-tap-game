import React from 'react';
import { LinearProgress } from '@mui/material';
import './LoadingComponent.css';

// Props 
type Props = {
    loading: boolean;
};

const LoadingBar: React.FC<Props> = ({ loading }) => {

    // Render if loading is true
    return loading ? (

        <div className="loading-bar">
            <LinearProgress color="secondary" />
        </div>

    ) : null;
};

export default LoadingBar;
