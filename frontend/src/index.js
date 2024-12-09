// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ToastContainer } from 'react-toastify';
import { Provider } from 'react-redux'; // Importamos el Provider de react-redux
import store from './store'; // Importamos el store

const root = ReactDOM.createRoot(document.getElementById('root'));

const renderApp = () => (
  <Provider store={store}>  {/* Aquí envolvemos la aplicación con el Provider */}
    <App />
  </Provider>
);

if (process.env.NODE_ENV === 'development') {
  root.render(
    <React.StrictMode>
      {renderApp()}
      <ToastContainer />
    </React.StrictMode>
  );
} else {
  root.render(
    <>
      {renderApp()}
      <ToastContainer />
    </>
  );
}