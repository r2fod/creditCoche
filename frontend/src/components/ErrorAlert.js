import React from 'react';

const ErrorAlert = ({ message }) => {
  if (!message) return null;

  return (
    <div className="form-error" role="alert" aria-live="assertive">
      <span className="error-icon">❌</span> {/* Ícono visual del error */}
      {message}
    </div>
  );
};

export default ErrorAlert;
