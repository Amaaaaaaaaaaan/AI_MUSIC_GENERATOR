import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // Include CSS file

function App() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);

  // Function to handle form submission
  const generateMusic = async () => {
    if (!prompt) {
      alert("Please enter a music description.");
      alert("hello")
      return;
    }

    setLoading(true); // Show loading indicator

    try {
      const response = await axios.post('http://localhost/generate-music', {
        inputs: prompt,
      }, {
        responseType: 'blob', // Expect blob response for audio
      });

      const audioBlob = new Blob([response.data], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url); // Set the generated audio URL
    } catch (error) {
      console.error('Error generating music:', error);
      alert('Failed to generate music. Please try again.');
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  return (
    <div className="App">
      <h1>METALLICA AI BASED MUSIC GENERATOR</h1>
      <h3>No musical experience? No problem! We've got everything you need to create amazing tunes!</h3>

      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter music description"
      />
      <button onClick={generateMusic}>Generate Music</button>

      {loading && <div className="loading">Generating music, please wait...</div>}

      <div className="audio-container">
        {audioUrl && (
          <audio controls autoPlay>
            <source src={audioUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        )}
      </div>
    </div>
  );
}

export default App;
