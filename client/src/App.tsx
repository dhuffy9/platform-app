import  Header from "./components/Header";
import { Routes, Route } from "react-router-dom";
import About from "./components/About";
import Register from  "./components/Register";
import Login from  "./components/Login";
import Posts from "./components/Posts";

function App() {
  
    return (
      <>
        <Header />
        <Routes>
                <Route path="/" element={<Posts />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
        </Routes>
      </>
    );
}

export default App;