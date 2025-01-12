import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import styles from "./styles";

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
                `https://app-1.alfaizuna.my.id/get-users?page=${page}&limit=${limit}`,
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
                ? `${process.env.REACT_APP_API_URL}/update-user/${editUser.id}`
                : `${process.env.REACT_APP_API_URL}/register`;
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
                const response = await fetch(`${process.env.REACT_APP_API_URL}/users/${id}`, {
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

export default UsersTable;