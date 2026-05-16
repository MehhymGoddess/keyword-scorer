'use client';

import { useState } from 'react';
import { parseCSV, ScoredKeyword } from './lib/scoring';

export default function Home() {
  const [results, setResults] = useState<ScoredKeyword[]>([]);
  const [filtered, setFiltered] = useState<ScoredKeyword[]>([]);
  const [message, setMessage] = useState('');
  const [minScore, setMinScore] = useState(0);
  const [clientName, setClientName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setMessage('');

    try {
      const text = await file.text();
      const scored = parseCSV(text, clientName || 'N/A');

      if (scored.length === 0) {
        setMessage('No keywords found in the file');
        setLoading(false);
        return;
      }

      setResults(scored);
      setFiltered(scored);
      setMessage(`Successfully scored ${scored.length} keywords`);
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleMinScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const min = parseInt(e.target.value) || 0;
    setMinScore(min);
    setFiltered(results.filter(r => r.totalScore >= min));
  };

  const downloadCSV = () => {
    const headers = ['Keyword', 'Avg Monthly Searches', 'Competition', 'Top of Page Bid (High)', 'Volume Score', 'Competition Score', 'Price Score', 'Total Score', 'Client Name'];
    const rows = filtered.map(r => [
      r.keyword,
      r.volume,
      r.competition,
      r.bid.toFixed(2),
      r.volumeScore,
      r.competitionScore,
      r.priceScore,
      r.totalScore,
      r.clientName,
    ]);

    let csv = headers.join('\t') + '\n';
    csv += rows.map(row => row.join('\t')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'scored-keywords.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const avgScore = filtered.length
    ? Math.round(filtered.reduce((a, b) => a + b.totalScore, 0) / filtered.length)
    : 0;

  const highScore = filtered.length ? filtered[0].totalScore : 0;
  const lowScore = filtered.length ? filtered[filtered.length - 1].totalScore : 0;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Keyword Opportunity Scorer</h1>
          <p className="text-gray-600">Upload your Google Keyword Planner CSV to score keywords based on volume, competition, and bid price.</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CSV File</label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  disabled={loading}
                  className="w-full max-w-xs"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Client Name (optional)</label>
                <input
                  type="text"
                  placeholder="Client name"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full max-w-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {message && (
          <div className={message.includes('Error') ? 'error' : 'success'}>
            {message}
          </div>
        )}

        {results.length > 0 && (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="metric-card">
                <div className="metric-label">Total keywords</div>
                <div className="metric-value">{filtered.length}</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Average score</div>
                <div className="metric-value">{avgScore}</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Highest score</div>
                <div className="metric-value">{highScore}</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Lowest score</div>
                <div className="metric-value">{lowScore}</div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-gray-700">Min score:</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={minScore}
                    onChange={handleMinScoreChange}
                    className="w-20"
                  />
                </div>
                <button onClick={downloadCSV} className="bg-blue-600 text-white hover:bg-blue-700">
                  Download CSV
                </button>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Keyword</th>
                      <th>Avg Monthly Searches</th>
                      <th>Competition</th>
                      <th>Top of Page Bid (High)</th>
                      <th>Volume Score</th>
                      <th>Competition Score</th>
                      <th>Price Score</th>
                      <th>Total Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((row, idx) => (
                      <tr key={idx}>
                        <td>{row.keyword}</td>
                        <td>{row.volume.toLocaleString()}</td>
                        <td>{row.competition}</td>
                        <td>${row.bid.toFixed(2)}</td>
                        <td>{row.volumeScore}</td>
                        <td>{row.competitionScore}</td>
                        <td>{row.priceScore}</td>
                        <td>
                          <span
                            className={
                              row.totalScore >= 70
                                ? 'score-high'
                                : row.totalScore >= 50
                                ? 'score-mid'
                                : 'score-low'
                            }
                          >
                            {row.totalScore}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
