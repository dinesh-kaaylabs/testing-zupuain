import React from 'react';
import { useNavigate } from 'react-router-dom';

interface PlaceholderPageProps {
  message: string;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ message }) => {
  const navigate = useNavigate();
  const containerClass = "min-h-screen bg-[var(--color-background)] pt-20";
  const contentClass = "w-full mx-auto px-4 sm:px-6 lg:px-8 py-8";
  const centerClass = "flex flex-col items-center justify-center min-h-[60vh] space-y-6";
  const buttonClass = "px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors duration-200 font-medium";

  return (
    <div className={containerClass}>
      <div className={contentClass}>
        <div className={centerClass}>
          <p className="text-[var(--color-text)] text-2xl font-medium">{message}</p>
          <button onClick={() => navigate(-1)} className={buttonClass}>Go Back</button>
        </div>
      </div>
    </div>
  );
};

export default PlaceholderPage;
