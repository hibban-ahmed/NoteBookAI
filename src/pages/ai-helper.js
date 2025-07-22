// pages/ai-helper.js
// This is the AI Homework Helper page with three scrollable sections and API selector.
// It sends requests to the FastAPI backend.

import React, { useState, useRef, useEffect } from 'react';

// IMPORTANT: This URL will be loaded from a Vercel environment variable (NEXT_PUBLIC_BACKEND_URL)
// For local development, set NEXT_PUBLIC_BACKEND_URL=http://localhost:8000 in a .env.local file
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const AiHelperPage = ({ showModal }) => {
  const [studyContent, setStudyContent] = useState('');
  const [promptInput, setPromptInput] = useState('');
  const [output, setOutput] = useState('');
  const [selectedApi, setSelectedApi] = useState('gemini'); // 'gemini' or 'llama'
  const [isApiSelectorOpen, setIsApiSelectorOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state for API calls

  const apiSelectorRef = useRef(null);

  // Close API selector when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (apiSelectorRef.current && !apiSelectorRef.current.contains(event.target)) {
        setIsApiSelectorOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [apiSelectorRef]);

  const handleProcess = async () => {
    if (!studyContent.trim() || !promptInput.trim()) {
      showModal("Please provide both study content and a prompt.");
      return;
    }

    if (!BACKEND_URL) {
      showModal("Backend URL is not configured. Please set NEXT_PUBLIC_BACKEND_URL environment variable.");
      return;
    }

    setIsLoading(true);
    setOutput('Processing your request...'); // Show loading message

    try {
      const response = await fetch(`${BACKEND_URL}/process_homework`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          study_content: studyContent,
          prompt: promptInput,
          api_choice: selectedApi,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setOutput(data.output);
      } else {
        const errorData = await response.json();
        setOutput(`Error: ${errorData.detail || 'Failed to get a response from the AI backend.'}`);
        showModal(`Error from AI backend: ${errorData.detail || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error processing request:", error);
      setOutput(`Network error: Failed to connect to the AI backend. Please check your internet connection and the backend server. Error: ${error.message}`);
      showModal(`Network error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-6 flex flex-col">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">AI Homework Helper</h1>

      <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Section 1: Study Content */}
        <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col border-b-4 border-indigo-400">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Study Content</h2>
          <textarea
            className="flex-grow w-full p-4 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-lg resize-none custom-scrollbar"
            placeholder="Paste or type your study material here (e.g., textbook chapters, notes, articles)..."
            value={studyContent}
            onChange={(e) => setStudyContent(e.target.value)}
          ></textarea>
        </div>

        {/* Section 2: Prompt */}
        <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col border-b-4 border-purple-400">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Your Prompt</h2>
          <textarea
            className="flex-grow w-full p-4 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-lg resize-none custom-scrollbar"
            placeholder="What do you want the AI to do with the content? (e.g., 'Summarize this', 'Explain the key concepts', 'Generate 5 multiple-choice questions')..."
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
          ></textarea>
          <button
            onClick={handleProcess}
            disabled={isLoading}
            className={`mt-6 py-3 px-6 rounded-full text-xl font-bold shadow-lg transform transition-all duration-300 ease-in-out ${
              isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white hover:scale-105'
            }`}
          >
            {isLoading ? 'Processing...' : 'Process with AI'}
          </button>
        </div>

        {/* Section 3: Output */}
        <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col border-b-4 border-pink-400">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">3. AI Output</h2>
          <textarea
            className="flex-grow w-full p-4 border border-gray-300 rounded-lg bg-gray-50 text-lg resize-none custom-scrollbar"
            readOnly
            value={output}
            placeholder={isLoading ? "Generating response..." : "Your AI-generated output will appear here."}
          ></textarea>
        </div>
      </div>

      {/* API Selector */}
      <div className="fixed bottom-6 left-6 z-20" ref={apiSelectorRef}>
        <button
          onClick={() => setIsApiSelectorOpen(!isApiSelectorOpen)}
          className="bg-gray-800 text-white p-4 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-700 transition duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-gray-300"
          title="Select AI Model"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M11.49 3.17c-.325-.324-.81-.079-1.01-.42C9.69 2.22 9.16 2 8.5 2A5.5 5.5 0 003 7.5c0 1.07.25 2.07.7 2.94l-.7.7c-.325.324-.079.81-.42 1.01C2.22 10.31 2 10.84 2 11.5a5.5 5.5 0 005.5 5.5c1.07 0 2.07-.25 2.94-.7l.7.7c.324.325.81.079 1.01.42C10.31 17.78 10.84 18 11.5 18a5.5 5.5 0 005.5-5.5c0-1.07-.25-2.07-.7-2.94l.7-.7c.325-.324.079-.81.42-1.01C17.78 9.69 18 9.16 18 8.5A5.5 5.5 0 0012.5 3c-1.07 0-2.07.25-2.94.7l-.7-.7zM10 11a1 1 0 11-2 0 1 1 0 012 0zm-2 2a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"></path></svg>
        </button>
        {isApiSelectorOpen && (
          <div className="absolute bottom-full mb-2 bg-white p-4 rounded-lg shadow-xl w-48 border border-gray-200 transform transition-all duration-300 ease-in-out origin-bottom-left">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Select AI Model</h3>
            <label className="flex items-center mb-2 cursor-pointer">
              <input
                type="radio"
                name="api_choice"
                value="gemini"
                checked={selectedApi === 'gemini'}
                onChange={() => { setSelectedApi('gemini'); setIsApiSelectorOpen(false); }}
                className="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
              />
              <span className="ml-2 text-gray-700">Gemini AI</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="api_choice"
                value="llama"
                checked={selectedApi === 'llama'}
                onChange={() => { setSelectedApi('llama'); setIsApiSelectorOpen(false); }}
                className="form-radio h-4 w-4 text-purple-600 transition duration-150 ease-in-out"
              />
              <span className="ml-2 text-gray-700">Llama AI</span>
            </label>
            <p className="text-xs text-gray-500 mt-3">Current: <span className="font-semibold text-gray-700 capitalize">{selectedApi}</span></p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiHelperPage;