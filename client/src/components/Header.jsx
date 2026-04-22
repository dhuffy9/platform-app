import { Link, useNavigate } from "react-router-dom";

export default function Header({ user, setUser}) {
    const navigate = useNavigate();


    const handleLogout = () =>{
        fetch("/api/logout", {
            method: "POST"
        })
        .then(async (response) => {
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to logout");
            }

            setUser(null);
            navigate("/login");
        })
        .catch((err) => {
            console.error(err);
        });
    }

    return (
        <header className="shadow-sm">
            <nav className="navbar bg-white py-3">
                <div className="container d-flex justify-content-between align-items-center">

                    <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold fs-4 text-dark m-0" to="/">
                        <i className="fa-solid fa-layer-group text-primary"></i>
                        Platform App
                    </Link>

                    <ul className="navbar-nav d-flex flex-row align-items-center gap-4 m-0">

                        <Link className="nav-link text-dark fw-semibold" to="/">
                            Home
                        </Link>

                        <Link className="nav-link text-dark fw-semibold" to="/about">
                            About
                        </Link>

                        {!user && (
                            <>
                                <Link className="nav-link text-dark fw-semibold" to="/register">
                                    Sign Up
                                </Link>

                                <Link className="btn btn-primary px-4 fw-semibold" to="/login">
                                    Login
                                </Link>
                            </>
                        )}

                        {user && (
                            <>
                                <Link className="nav-link text-dark fw-semibold" to="/user">
                                    <i className="fa-solid fa-user me-2 text-primary"></i>
                                    {user.display_name || user.username}
                                </Link>

                                <button
                                    type="button"
                                    className="btn btn-outline-danger px-4 fw-semibold"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </>
                        )}

                    </ul>

                </div>
            </nav>
        </header>
    );
}