import React from 'react';

export default function Loader({ fullScreen = false }) {
  const containerClass = fullScreen 
    ? "min-h-screen flex items-center justify-center bg-dark"
    : "flex items-center justify-center p-8 bg-dark";

  return (
    <div className={containerClass}>
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 bg-tesseract-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 bg-tesseract-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 bg-tesseract-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        <span className="text-sm text-tesseract-300 font-mono ml-2">Cargando...</span>
      </div>
    </div>
  );
}
