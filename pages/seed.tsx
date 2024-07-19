import { useState } from 'react';

export default function SeedPage() {
  const [result, setResult] = useState('');

  const runSeeder = async () => {
    try {
      const response = await fetch('/api/seed', { method: 'POST' });
      const data = await response.json();
      setResult(data.message || 'Seeding completed');
    } catch (error) {
      setResult('Error: ' + error.message);
    }
  };

  return (
    <div>
      <h1>Database Seeder</h1>
      <button onClick={runSeeder}>Run Seeder</button>
      {result && <p>{result}</p>}
    </div>
  );
}