// components/FormInput.js
import React from 'react';

const FormInput = ({ name, type, placeholder, value, onChange, options }) => {
  if (type === 'select') {
    return (
      <div className="form-input-container">
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="form-select"
          required
        >
          <option value="">Seleccione {placeholder}</option>
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className="form-input-container">
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="form-input"
        required
      />
    </div>
  );
};

export default FormInput;
