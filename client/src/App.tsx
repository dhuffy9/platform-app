import  Header from "./components/Header";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Register from  "./components/Register";
import Login from  "./components/Login";

function App() {
  
    return (
      <>
        <Header />
        <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
        </Routes>
      </>
    );
}

export default App;