import  Header from "./components/Header";
import { Routes, Route } from "react-router-dom";
import About from "./components/About";
import Register from  "./components/Register";
import Login from  "./components/Login";
import Posts from "./components/Posts";
import User from "./components/User"
import { useEffect, useState } from "react";

function App() {

  const [user, setUser] = useState(null);

  useEffect(() =>{
    fetch("/api/user", {credentials: "include"})
    .then(async (response)=>{
      const data = await response.json();

      if(!response.ok){
        return;
      }

      setUser(data.user)
    })
    .catch(() =>{
      setUser(null);
    })
  }, [])
  
    return (
      <>
        <Header user={user} setUser={setUser} />
        <Routes>
                <Route path="/" element={<Posts />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login  setUser={setUser} />} />
                <Route path="/register" element={<Register />} />
                <Route path="/user" element={<User user={user} setUser={setUser} />} />
        </Routes>
      </>
    );
}

export default App;