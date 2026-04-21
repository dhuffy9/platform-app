export default function User() {

    fetch("api/user", {method: "GET"})
    .then(async (response) =>{
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to login");
        }

        

    })
    return (
        <div>
            <h1>User</h1>
        </div>
     )
}