import React, { useState } from 'react';
import { Sparkles, Send, Loader2, Eraser } from 'lucide-react';

interface Shape {
  type: 'circle' | 'rectangle';
  id: string;
  color: string;
  // Dynamic properties based on type
  cx?: number; cy?: number; r?: number;
  x?: number; y?: number; width?: number; height?: number;
}

interface CanvasData {
  width: number;
  height: number;
  shapes: Shape[];
}

function App() {
  const [prompt, setPrompt] = useState('');
  const [canvas, setCanvas] = useState<CanvasData | null>(null);
  const [loading, setLoading] = useState(false);

  const generateDesign = async () => {
    setLoading(true);
    try {
      // In 2026, we use the stable backend port 8000
      const response = await fetch(`http://localhost:8000/generate?prompt=${encodeURIComponent(prompt)}`, {
        method: 'POST',
      });
      const data = await response.json();
      setCanvas(data);
    } catch (error) {
      console.error("AI Generation failed:", error);
      alert("Check if your FastAPI server is running on port 8000!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 font-sans">
      {/* Sidebar: Controls */}
      <aside className="w-96 bg-slate-800 border-r border-slate-700 p-8 flex flex-col gap-8 shadow-2xl">
        <header className="flex items-center gap-3">
          <div className="bg-indigo-500 p-2 rounded-xl shadow-lg shadow-indigo-500/20">
            <Sparkles size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Canvas Pilot
          </h1>
        </header>

        <div className="flex-1 flex flex-col gap-4">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Natural Language Prompt</label>
          <textarea
            className="w-full h-48 p-4 rounded-2xl bg-slate-900/50 border border-slate-700 text-slate-200 placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none shadow-inner"
            placeholder="Describe your vision... (e.g., 'A sunset with 3 blue mountains and a yellow sun')"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          
          <button
            onClick={generateDesign}
            disabled={loading || !prompt}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-xl shadow-indigo-900/20"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
            {loading ? 'Thinking...' : 'Generate Canvas'}
          </button>
        </div>

        <button 
          onClick={() => {setCanvas(null); setPrompt('');}}
          className="flex items-center justify-center gap-2 text-slate-500 hover:text-slate-300 text-sm transition-colors"
        >
          <Eraser size={16} /> Reset Workspace
        </button>
      </aside>

      {/* Main Area: The Render Engine */}
      <main className="flex-1 relative flex items-center justify-center p-12 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px]">
        {canvas ? (
          <div className="relative animate-in fade-in zoom-in duration-500">
            {/* The SVG Shadow/Glow */}
            <div className="absolute -inset-8 bg-indigo-500/10 blur-3xl rounded-full" />
            
            <div className="relative bg-white p-4 rounded-[2rem] shadow-[0_0_100px_-20px_rgba(0,0,0,0.5)] border-8 border-slate-800">
              <svg 
                width={canvas.width} 
                height={canvas.height} 
                viewBox={`0 0 ${canvas.width} ${canvas.height}`}
                className="rounded-xl bg-white"
              >
                {canvas.shapes.map((shape) => {
                  if (shape.type === 'circle') {
                    return (
                      <circle 
                        key={shape.id} 
                        cx={shape.cx} cy={shape.cy} r={shape.r} 
                        fill={shape.color} 
                        className="transition-all duration-700 ease-out"
                      />
                    );
                  }
                  if (shape.type === 'rectangle') {
                    return (
                      <rect 
                        key={shape.id} 
                        x={shape.x} y={shape.y} width={shape.width} height={shape.height} 
                        fill={shape.color}
                        className="transition-all duration-700 ease-out"
                      />
                    );
                  }
                  return null;
                })}
              </svg>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-slate-800 rounded-3xl flex items-center justify-center mx-auto border border-slate-700">
              <Sparkles size={40} className="text-slate-600" />
            </div>
            <p className="text-slate-500 font-medium tracking-wide">Enter a prompt to initialize the canvas</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;