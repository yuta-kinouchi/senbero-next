import { useState } from 'react';

export default function SeedPage() {
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [csvUrl, setCsvUrl] = useState('');

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
      setResult(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const exportCsv = async () => {
    setIsLoading(true);
    setCsvUrl('');
    try {
      console.log("Sending request to /api/export-csv");
      const response = await fetch('/api/export-csv', {
        method: 'GET',
      });
      console.log("Response received", response);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setCsvUrl(url);
      setResult('CSV file generated successfully');
    } catch (error) {
      console.error("Error occurred", error);
      setResult(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>Database Management</h1>
      <div>
        <h2>Database Seeder</h2>
        <button onClick={runSeeder} disabled={isLoading}>
          {isLoading ? 'Running...' : 'Run Seeder'}
        </button>
      </div>
      <div>
        <h2>CSV Export</h2>
        <button onClick={exportCsv} disabled={isLoading}>
          {isLoading ? 'Exporting...' : 'Export CSV'}
        </button>
        {csvUrl && (
          <p>
            <a href={csvUrl} download="database_export.csv">
              Download CSV
            </a>
          </p>
        )}
      </div>
      {result && <p>{result}</p>}
    </div>
  );
}