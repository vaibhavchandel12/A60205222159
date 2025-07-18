import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [longUrl, setLongUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [validity, setValidity] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setShortUrl('');
    setCopied(false);
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/shorten', {
        longUrl,
        customCode,
        validity: Number(validity),
      });
      setShortUrl(res.data.shortUrl);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to shorten URL');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <h2 style={{ color: '#333', marginBottom: '1rem' }}>🔗 URL Shortener</h2>

      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        maxWidth: '450px',
        background: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)'
      }}>
        <label>
          Long URL:
          <input
            type="text"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            placeholder="Enter full URL"
            required
            style={{ padding: '10px', width: '100%', marginTop: '4px' }}
          />
        </label>

        <label>
          Custom Shortcode (optional):
          <input
            type="text"
            value={customCode}
            onChange={(e) => setCustomCode(e.target.value)}
            placeholder="e.g. mylink123"
            style={{ padding: '10px', width: '100%', marginTop: '4px' }}
          />
        </label>

        <label>
          Validity (minutes):
          <input
            type="number"
            value={validity}
            onChange={(e) => setValidity(e.target.value)}
            placeholder="Optional - 1 to 10080"
            min="1"
            style={{ padding: '10px', width: '100%', marginTop: '4px' }}
          />
        </label>

        <button type="submit" style={{
          padding: '10px',
          fontWeight: 'bold',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}>
          {loading ? 'Shortening...' : 'Shorten URL'}
        </button>
      </form>

      {shortUrl && (
        <div style={{
          marginTop: '20px',
          padding: '10px',
          backgroundColor: '#e8f0fe',
          border: '1px solid #c3dafe',
          borderRadius: '5px'
        }}>
          <p><strong>Short URL:</strong> <a href={shortUrl} target="_blank" rel="noopener noreferrer">{shortUrl}</a></p>
          <button onClick={handleCopy} style={{
            marginTop: '5px',
            padding: '6px 12px',
            backgroundColor: '#28a745',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            {copied ? 'Copied!' : 'Copy to Clipboard'}
          </button>
        </div>
      )}

      {error && (
        <div style={{ marginTop: '20px', color: 'red', fontWeight: 'bold' }}>
          ❌ {error}
        </div>
      )}
    </div>
  );
}

export default App;
