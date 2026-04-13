export default function Home() {
    return (
        <div className="container py-5">
            <div className="text-center mb-5">
                <h1 className="fw-bold mb-3" style={{ fontSize: "2.75rem" }}>
                    Platform App
                </h1>

                <p
                    className="text-muted mx-auto mb-4"
                    style={{ maxWidth: "700px", fontSize: "1.1rem" }}
                >
                    A full-stack forum application built with React, Node.js, Express, and MySQL.
                    Users can create accounts, log in securely, manage content, and interact with
                    posts in a clean modern interface.
                </p>

                <div className="d-flex justify-content-center gap-3 flex-wrap">
                    <a className="btn btn-primary px-4 py-2 fw-semibold" href="#">
                        Sign Up
                    </a>

                    <a className="btn btn-outline-dark px-4 py-2 fw-semibold" href="#">
                        Login
                    </a>
                </div>
            </div>

            <div className="row g-4 mb-5">
                <div className="col-md-4">
                    <div className="p-4 border rounded h-100 text-center bg-white shadow-sm feature-card">
                        <div className="mb-3">
                            <i className="fa-solid fa-user-plus fs-2 text-primary"></i>
                        </div>
                        <h5 className="fw-semibold mb-3">Authentication</h5>
                        <p className="text-muted mb-0">
                            Secure user registration, login, and session handling using hashed
                            passwords and protected backend logic.
                        </p>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="p-4 border rounded h-100 text-center bg-white shadow-sm feature-card">
                        <div className="mb-3">
                            <i className="fa-solid fa-comments fs-2 text-primary"></i>
                        </div>
                        <h5 className="fw-semibold mb-3">Forum System</h5>
                        <p className="text-muted mb-0">
                            Create, view, edit, and manage posts through a simple CRUD-based forum
                            experience backed by a real database.
                        </p>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="p-4 border rounded h-100 text-center bg-white shadow-sm feature-card">
                        <div className="mb-3">
                            <i className="fa-solid fa-magnifying-glass fs-2 text-primary"></i>
                        </div>
                        <h5 className="fw-semibold mb-3">Search</h5>
                        <p className="text-muted mb-0">
                            Find posts quickly using built-in search functionality powered by SQL
                            queries and backend filtering.
                        </p>
                    </div>
                </div>
            </div>

            <div className="row g-4">
                <div className="col-md-6">
                    <div className="p-4 h-100 b">
                        <h4 className="fw-semibold mb-3">
                            <i className="fa-solid fa-layer-group me-2 text-primary"></i>
                            Tech Stack
                        </h4>

                        <p className="text-muted mb-3">
                            This project combines frontend, backend, API, and database development
                            into one full-stack application.
                        </p>

                        <div className="d-flex flex-wrap gap-2">
                            <span className="badge bg-light text-dark border px-3 py-2">React</span>
                            <span className="badge bg-light text-dark border px-3 py-2">Vite</span>
                            <span className="badge bg-light text-dark border px-3 py-2">Node.js</span>
                            <span className="badge bg-light text-dark border px-3 py-2">Express</span>
                            <span className="badge bg-light text-dark border px-3 py-2">MySQL</span>
                            <span className="badge bg-light text-dark border px-3 py-2">Bootstrap</span>
                            <span className="badge bg-light text-dark border px-3 py-2">FontAwesome</span>
                            <span className="badge bg-light text-dark border px-3 py-2">REST API</span>
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="p-4 h-100">
                        <h4 className="fw-semibold mb-3">
                            <i className="fa-solid fa-lightbulb me-2 text-primary"></i>
                            Why This Project
                        </h4>

                        <p className="text-muted mb-3">
                            This project was built to demonstrate a complete full-stack workflow
                            and serve as a portfolio piece that shows real-world web development skills.
                        </p>

                        <ul className="text-muted mb-0 ps-3">
                            <li className="mb-1">Frontend UI built with reusable React components</li>
                            <li className="mb-1">Backend API handling validation and business logic</li>
                            <li className="mb-1">Database integration for users, authentication, and posts</li>
                            <li className="mb-1">Security-focused structure with hashed passwords and HTTPS support</li>
                            <li className="mb-0">Designed to feel like a real product, not just a class demo</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
