import { useState } from "react"

export default function Register() {
    const [message, setMessage] = useState({ type: "", message: ""});

    const [availability, setAvailability] = useState({
        username: "",
        email: ""
    });

    const [formData, setFormData] = useState({
        username: "",
        password: "",
        email: "",
        displayName: ""
    });

    function handleSubmit(event){
        event.preventDefault();

        console.log(formData)

        setMessage("");

        fetch("/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        }).then(async (respond)=>{
            const data = await respond.json();

            if(!respond.ok){
                throw new Error(data.message || "Failed to register");
            }
            
            return data;
        }).then((data) => {
            const { type , message } = data;
            setMessage({ type, message});

            setFormData({
                username: "",
                password: "",
                email: "",
                displayName: ""
            });
        }).catch((err) => {
            console.error(err);
            setMessage(err.message);
        });

    }

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (name === "username" || name === "email"){
            console.log(value)
            setAvailability((prev) => ({
                ...prev,
                [name]: ""
            }));
        }
    }
    return (
        <div style={{ maxWidth: "700px"}} className="container py-5 min-vh-100">
            <p className="h2 mb-3 text-center">
                <i className="fa-solid fa-user-plus me-2"></i>
                Sign Up
            </p>

            {message.message && (
                <div className={`alert alert-${message.type} py-2`}>
                    {message.message}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Username</label>
                    <input className="form-control" type="text" name="username"  value={formData.username} onChange={handleChange}></input>
                </div>
                <div className="mb-3">
                    <label className="form-label">password</label>
                    <input className="form-control" type="password" name="password" value={formData.password} onChange={handleChange}></input>
                </div>
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input className="form-control" type="email" name="email" value={formData.email} onChange={handleChange}></input>
                </div>
                <div className="mb-3">
                    <label className="form-label">Display Name</label>
                    <input className="form-control" type="text" name="displayName" value={formData.displayName} onChange={handleChange}></input>
                </div>
                <div className="text-center">
                    <button type="submit" className="btn btn-primary">
                        <i className="fa-solid fa-user-plus me-2"></i>
                        Create Account
                    </button>
                </div>
            </form>
        </div>
    )
}