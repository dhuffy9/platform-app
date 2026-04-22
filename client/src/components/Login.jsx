import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ setUser }) {
    const [message, setMessage] = useState({ type: "", message: "" });

    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });

    const navigate = useNavigate();

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setMessage({ type: "", message: "" });

        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to login");
            }

            const userResponse = await fetch("/api/user", {
                method: "GET",
                credentials: "include"
            });

            const userData = await userResponse.json();

            if (!userResponse.ok) {
                throw new Error(userData.message || "Failed to get user");
            }

            setUser(userData.user);

            setMessage({
                type: data.type || "success",
                message: data.message || "Login successful"
            });

            setFormData({
                username: "",
                password: ""
            });

            navigate("/user");
        } catch (err) {
            setMessage({
                type: "danger",
                message: err.message
            });
        }
    }

    return (
        <div style={{ maxWidth: "700px" }} className="container py-5 min-vh-100">
            <p className="h2 mb-3 text-center">
                <i className="fa-solid fa-right-to-bracket me-2"></i>
                Login
            </p>

            {message.message && (
                <div className={`alert alert-${message.type} py-2`}>
                    {message.message}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label" htmlFor="loginUsername">
                        Username
                    </label>
                    <input
                        id="loginUsername"
                        className="form-control"
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label" htmlFor="loginPassword">
                        Password
                    </label>
                    <input
                        id="loginPassword"
                        className="form-control"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>

                <div className="text-center">
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={!formData.username.trim() || !formData.password.trim()}
                    >
                        <i className="fa-solid fa-right-to-bracket me-2"></i>
                        Login
                    </button>
                </div>
            </form>
        </div>
    );
}