import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function User({ user, setUser }) {
    const [posts, setPosts] = useState([]);
    const [message, setMessage] = useState({ type: "", message: "" });

    const [postFormData, setPostFormData] = useState({
        title: "",
        body: ""
    });

    const [accountFormData, setAccountFormData] = useState({
        email: "",
        displayName: ""
    });

    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            setAccountFormData({
                email: user.email || "",
                displayName: user.display_name || ""
            });
        }
    }, [user]);

    useEffect(() => {
        if (!user) {
            fetch("/api/user")
                .then(async (response) => {
                    const data = await response.json();

                    if (!response.ok) {
                        throw new Error(data.message || "Please log in first");
                    }

                    setUser(data.user);
                })
                .catch((err) => {
                    setMessage({
                        type: "danger",
                        message: err.message
                    });

                    setTimeout(() => {
                        navigate("/login");
                    }, 2000);
                });
        }

        
        fetch("/api/my-posts")
            .then(async (response) => {
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Failed to get posts");
                }

                setPosts(data.posts);
            })
            .catch((err) => {
                setMessage({
                    type: "danger",
                    message: err.message
                });
            });

    }, [user, setUser, navigate]);

    function handlePostChange(event) {
        const { name, value } = event.target;

        setPostFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    function handleAccountChange(event) {
        const { name, value } = event.target;

        setAccountFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    async function handlePostSubmit(event) {
        event.preventDefault();

        setMessage({ type: "", message: "" });

    

        try {
            const response = await fetch("/api/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(postFormData)
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    setMessage({
                        type: "danger",
                        message: data.message || "Please log in first"
                    });

                    setTimeout(() => {
                        navigate("/login");
                    }, 2000);

                    return;
                }

                throw new Error(data.message || "Failed to create post");
            }
             
            setPosts((prev) => [data.post, ...prev]);

            setPostFormData({
                title: "",
                body: ""
            });

            setMessage({
                type: data.type || "success",
                message: data.message || "Post created successfully"
            });
        } catch (err) {
            setMessage({
                type: "danger",
                message: err.message
            });
        }
    }

    async function handleAccountSubmit(event) {
        event.preventDefault();

        setMessage({ type: "", message: "" });

        try {
            const response = await fetch("/api/user", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(accountFormData)
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    setMessage({
                        type: "danger",
                        message: data.message || "Please log in first"
                    });

                    setTimeout(() => {
                        navigate("/login");
                    }, 2000);

                    return;
                }

                throw new Error(data.message || "Failed to update account");
            }

            setUser(data.user);

            setAccountFormData({
                email: data.user.email || "",
                displayName: data.user.display_name || ""
            });

            setMessage({
                type: data.type || "success",
                message: data.message || "Account updated successfully"
            });
        } catch (err) {
            setMessage({
                type: "danger",
                message: err.message
            });
        }
    }

    return (
        <div className="container py-5 min-vh-100" style={{ maxWidth: "1100px" }}>
            <div className="text-center mb-5">
                <h1 className="fw-bold mb-3" style={{ fontSize: "2.75rem" }}>
                    <i className="fa-solid fa-user me-2 text-primary"></i>
                    User Profile
                </h1>

                <p
                    className="text-muted mx-auto mb-0"
                    style={{ maxWidth: "700px", fontSize: "1.1rem" }}
                >
                    Manage your account and publish forum posts from one place.
                </p>
            </div>

            {message.message && (
                <div className={`alert alert-${message.type} py-2`}>
                    {message.message}
                </div>
            )}

            <div className="row g-4 mb-4">
                <div className="col-lg-5">
                    <div className="p-4 border rounded bg-white shadow-sm h-100">
                        <h4 className="fw-semibold mb-4">
                            <i className="fa-solid fa-id-badge me-2 text-primary"></i>
                            Account Details
                        </h4>


                        <div className="mb-3">
                            <label className="form-label text-muted mb-1">User ID</label>
                            <div className="form-control bg-light opacity-50">{user?.uid}</div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label text-muted mb-1">Username</label>
                            <div className="form-control bg-light opacity-50">{user?.username}</div>
                        </div>

                        <form onSubmit={handleAccountSubmit}>
                            <div className="mb-3">
                                <label className="form-label" htmlFor="accountEmail">
                                    Email
                                </label>
                                <input
                                    id="accountEmail"
                                    className="form-control"
                                    type="email"
                                    name="email"
                                    value={accountFormData.email}
                                    onChange={handleAccountChange}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label" htmlFor="accountDisplayName">
                                    Display Name
                                </label>
                                <input
                                    id="accountDisplayName"
                                    className="form-control"
                                    type="text"
                                    name="displayName"
                                    value={accountFormData.displayName}
                                    onChange={handleAccountChange}
                                />
                            </div>

                            <div className="text-end">
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={!accountFormData.email.trim()}
                                >
                                    <i className="fa-solid fa-floppy-disk me-2"></i>
                                    Update
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="col-lg-7">
                    <div className="p-4 border rounded bg-white shadow-sm h-100">
                        <h4 className="fw-semibold mb-4">
                            <i className="fa-solid fa-pen-to-square me-2 text-primary"></i>
                            Create Post
                        </h4>

                        <form onSubmit={handlePostSubmit}>
                            <div className="mb-3">
                                <label className="form-label" htmlFor="postTitle">
                                    Title
                                </label>
                                <input
                                    id="postTitle"
                                    className="form-control"
                                    type="text"
                                    name="title"
                                    value={postFormData.title}
                                    onChange={handlePostChange}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label" htmlFor="postBody">
                                    Body
                                </label>
                                <textarea
                                    id="postBody"
                                    className="form-control"
                                    name="body"
                                    rows="7"
                                    value={postFormData.body}
                                    onChange={handlePostChange}
                                ></textarea>
                            </div>

                            <div className="text-end">
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={!postFormData.title.trim() || !postFormData.body.trim()}
                                >
                                    <i className="fa-solid fa-paper-plane me-2"></i>
                                    Publish Post
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <div className="p-4 border rounded bg-white shadow-sm">
                <h4 className="fw-semibold mb-4">
                    <i className="fa-solid fa-file-lines me-2 text-primary"></i>
                    Your Posts
                </h4>

                {posts.length === 0 ? (
                    <p className="text-muted mb-0">You have not posted anything yet.</p>
                ) : (
                    <div className="d-flex flex-column gap-3">
                        {posts.map((post) => (
                            <div key={post.pid} className="border rounded p-3 bg-light">
                                <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-2">
                                    <h5 className="fw-semibold mb-0">{post.title}</h5>
                                    <small className="text-muted">
                                        {new Date(post.timestamp).toLocaleString()}
                                    </small>
                                </div>

                                <p className="text-muted mb-2">
                                    by {post.display_name || post.username}
                                </p>

                                <p className="mb-0">{post.body}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}