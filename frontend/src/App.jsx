import React, { useEffect, useState } from 'react';

function App() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://localhost/gulit/api.php')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => setData(data))
            .catch(error => setError(error));
    }, []);

    return (
        <div>
            <h1>React and PHP Integration</h1>
            {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
            {data ? <p>{data.message}</p> : <p>Loading...</p>}
        </div>
    );
}

export default App;