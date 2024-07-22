import { useState } from 'react';

export default function SeedPage() {
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const runSeeder = async () => {
    setIsLoading(true);
    setResult('');
    try {
      console.log("Sending request to /api/seed");
      const response = await fetch('/api/seed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log("Response received", response);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Data parsed", data);
      setResult(data.message || 'Seeding completed');
    } catch (error) {
      console.error("Error occurred", error);
      setResult(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>Database Seeder</h1>
      <button onClick={runSeeder} disabled={isLoading}>
        {isLoading ? 'Running...' : 'Run Seeder'}
      </button>
      {result && <p>{result}</p>}
    </div>
  );
}