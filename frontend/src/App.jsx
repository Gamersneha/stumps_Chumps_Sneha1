import CareerPage from "./pages/CareerPage";
import GamePage from "./pages/GamePage";
import History from "./pages/History.jsx";
import HomePage from "./pages/HomePage";
import Records from "./pages/Records.jsx";
import Rules from "./pages/Rules.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/career" element={<CareerPage />} />
        <Route path="/history" element={<History />} />
        <Route path="/records" element={<Records />} />
        <Route path="/rules" element={<Rules/>}/>
      </Routes>
    </BrowserRouter>
  );
}
