import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Components/Home';

function App() {
  return (
    <Router>
      <Routes>
        {/* Correct way to define the route */}
        <Route path="/" element={<Home/>}/>
      </Routes>
    </Router>
  );
}

export default App;
