import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

const UsersTable = () => {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [modalVisible, setModalVisible] = useState(false);
    const [editUser, setEditUser] = useState(null);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [usercode, setUsercode] = useState(""); // New state for usercode
    const limit = 5;

    const fetchUsers = async (page) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                `http://localhost:4000/get-users?page=${page}&limit=${limit}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.ok) {
                const { data, totalPages } = await response.json();
                setUsers(data);
                setTotalPages(totalPages - 1);
            } else {
                console.error("Failed to fetch users");
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    useEffect(() => {
        fetchUsers(page);
    }, [page]);

    const handleNext = () => {
        if (page < totalPages) setPage(page + 1);
    };

    const handlePrev = () => {
        if (page > 1) setPage(page - 1);
    };

    const openModal = (user = null) => {
        setEditUser(user);
        setUsername(user ? user.username : "");
        setPassword("");
        setUsercode(user ? user.usercode : ""); // Populate usercode for editing
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setEditUser(null);
        setUsername("");
        setPassword("");
        setUsercode(""); // Clear usercode
    };

    const handleSaveUser = async () => {
        try {
            const token = localStorage.getItem("token");
            const url = editUser
                ? `http://localhost:4000/update-user/${editUser.id}`
                : `http://localhost:4000/register`;
            const method = editUser ? "PUT" : "POST";

            const body = {
                username,
                role: "customer", // Role is fixed to "customer" based on your UI logic
                usercode, // Use the input value for usercode
            };

            if (!editUser || password.trim() !== "") {
                body.password = password; // Include password only if provided
            }

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            });

            if (response.ok) {
                fetchUsers(page);
                closeModal();
            } else {
                const errorData = await response.json();
                console.error("Error saving user:", errorData.error);
                alert(`Failed to save user: ${errorData.error}`);
            }
        } catch (error) {
            console.error("Error saving user:", error);
        }
    };

    const handleDeleteUser = async (id) => {
        try {
            const result = await Swal.fire({
                title: "Are you sure?",
                text: "Do you want to delete this user? This action cannot be undone!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "Cancel",
            });

            if (result.isConfirmed) {
                const token = localStorage.getItem("token");
                const response = await fetch(`http://localhost:4000/users/${id}`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    await Swal.fire(
                        "Deleted!",
                        "The user has been deleted successfully.",
                        "success"
                    );
                    fetchUsers(page); // Refresh the user list
                } else {
                    Swal.fire("Error!", "Failed to delete user.", "error");
                }
            }
        } catch (error) {
            Swal.fire("Error!", "An error occurred while deleting the user.", "error");
            console.error("Error deleting user:", error);
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Customers</h1>
            <button onClick={() => openModal()} style={styles.addButton}>
                Add Customer
            </button>
            <table style={styles.table}>
                <thead>
                <tr>
                    <th style={styles.th}>No</th>
                    <th style={styles.th}>Username</th>
                    <th style={styles.th}>Actions</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user, index) => (
                    <tr key={user.id}>
                        <td style={styles.td}>{(page - 1) * limit + index + 1}</td>
                        <td style={styles.td}>{user.username}</td>
                        <td style={styles.td}>
                            <button
                                onClick={() => handleDeleteUser(user.id)}
                                style={styles.deleteButton}
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div style={styles.pagination}>
                <button
                    style={{ borderRadius: "5px" }}
                    onClick={handlePrev}
                    disabled={page === 1}
                >
                    Previous
                </button>
                <span>
                    Page {page} of {totalPages}
                </span>
                <button
                    style={{ borderRadius: "5px" }}
                    onClick={handleNext}
                    disabled={page === totalPages}
                >
                    Next
                </button>
            </div>

            {modalVisible && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modal}>
                        <h2>{editUser ? "Edit User" : "Add Customer"}</h2>
                        <input
                            type="text"
                            placeholder="Nama undangan"
                            value={usercode}
                            onChange={(e) => setUsercode(e.target.value)}
                            style={styles.input}
                        />
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={styles.input}
                        />
                        <input
                            type="text"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={styles.input}
                        />
                        <div style={styles.modalActions}>
                            <button onClick={handleSaveUser} style={styles.saveButton}>
                                Save
                            </button>
                            <button onClick={closeModal} style={styles.cancelButton}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: { padding: "20px" },
    title: { fontSize: "24px", marginBottom: "20px" },
    addButton: { padding: "10px", backgroundColor: "green", color: "#fff", border: "none", cursor: "pointer", borderRadius: "5px", marginBottom:"20px"},
    table: { width: "100%", borderCollapse: "collapse" },
    actions: { display: "flex", gap: "10px", border: "1px solid #ddd", padding: "12px", textAlign: "center" },
    editButton: { backgroundColor: "blue", color: "#fff", padding: "5px", cursor: "pointer" },
    deleteButton: { backgroundColor: "red", color: "#fff", padding: "5px", cursor: "pointer" },
    pagination: { marginTop: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" },
    modalOverlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
    },
    modal: {
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        width: "100%",
        maxWidth: "400px",
        textAlign: "center", // Center the text and inputs
    },
    input: {
        width: "90%", // Center-align with padding
        margin: "10px auto", // Add spacing between inputs
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "4px",
        display: "block", // Ensures proper spacing
        fontSize: "16px",
    },
    modalActions: {
        display: "flex",
        justifyContent: "space-between",
        marginTop: "20px",
    },
    saveButton: {
        backgroundColor: "green",
        color: "white",
        padding: "10px 20px",
        borderRadius: "5px",
        border: "none",
        cursor: "pointer",
    },
    cancelButton: {
        backgroundColor: "gray",
        color: "white",
        padding: "10px 20px",
        borderRadius: "5px",
        border: "none",
        cursor: "pointer",
    },
    th: {
        backgroundColor: "#f8f9fa",
        fontWeight: "bold",
        border: "1px solid #ddd",
        padding: "8px",
    },
    td: {
        border: "1px solid #ddd",
        padding: "8px",
        textAlign: "center",
    },
};

export default UsersTable;