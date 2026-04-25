import { StrictMode } from 'react'
import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";
import './index.css'
import App from './App.tsx'
import { Provider } from "jotai";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <Provider>
        <BrowserRouter>
            <StrictMode>
                <App />
            </StrictMode>
        </BrowserRouter>
    </Provider>
)
