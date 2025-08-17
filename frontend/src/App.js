import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./component/pages/Home.jsx";
import Game from "./component/pages/Game.jsx";
import History from "./component/pages/History.jsx";
import Records from "./component/pages/Records.jsx";
import Rules from "./component/pages/Rules.jsx";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/game" element={<Game />} />
        <Route path="/history" element={<History />} />
        <Route path="/records" element={<Records />} />
        <Route path="/rules" element={<Rules/>}/>
      </Routes>

    </Router>
  );
}

export default App;
