import { useEffect, useState, useRef } from "react"

export default function Register() {
    const [message, setMessage] = useState({ type: "", message: ""});


    const [availability, setAvailability] = useState({
        username: null,
        email: null
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
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        })
        .then(async (respond) => {
            const data = await respond.json();
            if (!respond.ok) {
                throw new Error(data.message);
            }

            const { type, message } = data
            setMessage({ type, message })
            setFormData({ username: "", password: "", email: "", displayName: "" })
        })
        .catch((err) => {
            setMessage({ type: "danger", message: err.message })
        })

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
                [name]: null
            }));
        }
    }

    const preAvailability =  useRef({ username: '', email: '' })

    useEffect(() => {
            // make sure they are not empty
            if (!formData.username && !formData.email) return

            const debounce = setTimeout(() => {
                // preAvailability = { current: {username: ..., email: ... }}
            const hasChangedInput = 
            formData.username !== preAvailability.current.username ? "username" :
            formData.email !== preAvailability.current.email ? "email" : null;

            if(!hasChangedInput) return;

            preAvailability.current = { username: formData.username, email: formData.email };


            fetch("/api/check-availability", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ field: hasChangedInput, value: (formData[hasChangedInput]).trim() })

            }).then(async (respond) => {
                const { taken, field} = await respond.json();

                if(taken) {
                    setAvailability((prev) => ({
                        ...prev,
                        [field]: taken
                    }))
                }
            });

            return () => clearTimeout(debounce)
        }, 500);

    }, [formData.username, formData.email])
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
                    <label className="form-label" htmlFor="1" >Username</label>
                    <input id="1" className={`form-control ${availability.username ? "is-invalid": ""}`} type="text" name="username"  value={formData.username} onChange={handleChange}></input>
                    {availability.username && (
                        <p className="invalid-feedback" >Username Taken. Try a diffrent username</p>
                    )}
                </div>
                <div className="mb-3">
                    <label className="form-label"  htmlFor="2">password</label>
                    <input id="2" className="form-control" type="password" name="password" value={formData.password} onChange={handleChange}></input>
                </div>
                <div className="mb-3">
                    <label className="form-label"  htmlFor="3">Email</label>
                    <input id="3" className={`form-control ${availability.email ? "is-invalid": ""}`} type="email" name="email" value={formData.email} onChange={handleChange}></input>
                    {availability.email && (
                        <p className="invalid-feedback">Email already used. Try a diffrent email</p>
                    )}
                </div>
                <div className="mb-3">
                    <label className="form-label" htmlFor="4">Display Name</label>
                    <input id="4" className="form-control" type="text" name="displayName" value={formData.displayName} onChange={handleChange}></input>
                </div>
                <div className="text-center">
                    <button type="submit" className="btn btn-primary" disabled={availability.username || availability.email}>
                        <i className="fa-solid fa-user-plus me-2"></i>
                        Create Account
                    </button>
                </div>
            </form>
        </div>
    )
}