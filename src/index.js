import './locales/i18n'  
import { createRoot } from "react-dom/client";
import App from './pages/app/app-view'    

const root = document.getElementById("root");
createRoot(root).render(<App/>);

