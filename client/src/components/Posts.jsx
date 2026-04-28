import { useEffect, useState } from "react";

export default function Posts() {
    const [posts, setPosts] = useState([]);

    useEffect(() =>{
        fetch("/api/posts")
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

    }, [])

    return (
        <div className="p-4 border rounded bg-white shadow-sm min-vh-100">
                <h2 className="fw-bold mb-4 text-center">
                    <i className="fa-solid fa-file-lines me-2 text-primary"></i>
                    Posts
                </h2>

                {posts.length === 0 ? (
                    <p className="text-muted mb-0">No posts yet.</p>
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
     )
}