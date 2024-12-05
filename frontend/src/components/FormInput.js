import React from 'react';

const FormInput = ({ name, type, placeholder, value, onChange, options, errorMessage }) => {
  // Renderizado para el selector (select)
  if (type === 'select') {
    return (
      <div className="form-input-container">
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="form-select"
          required
          aria-describedby={errorMessage ? `${name}-error` : undefined} // Asociamos con el error si existe
        >
          <option value="">Seleccione {placeholder}</option>
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
        {errorMessage && <div id={`${name}-error`} className="form-error">{errorMessage}</div>} {/* Mostrar error si existe */}
      </div>
    );
  }

  // Renderizado para los inputs de tipo 'text', 'email', 'password', etc.
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
        aria-describedby={errorMessage ? `${name}-error` : undefined} // Asociamos con el error si existe
      />
      {errorMessage && <div id={`${name}-error`} className="form-error">{errorMessage}</div>} {/* Mostrar error si existe */}
    </div>
  );
};

export default FormInput;
