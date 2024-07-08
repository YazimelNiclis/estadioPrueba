import React from 'react';

const Spinner = () => {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="h-32 w-32 animate-spin rounded-full border-b-4 border-t-4 border-green-500"></div>
        </div>
    );
};

export default Spinner;
