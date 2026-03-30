import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import axios from 'axios'
import App from './App.jsx'
import './index.css'

const params = new URLSearchParams(window.location.search);
const urlToken = params.get('token');
if (urlToken) {
    localStorage.setItem('bitstream_token', urlToken);
    window.history.replaceState({}, '', '/');
}

axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('bitstream_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>,
)