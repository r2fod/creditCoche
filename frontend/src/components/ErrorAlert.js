// components/ErrorAlert.js
import React from 'react';

const ErrorAlert = ({ message }) => {
  if (!message) return null;

  return (
    <div className="form-error">
      {message}
    </div>
  );
};

export default ErrorAlert;
