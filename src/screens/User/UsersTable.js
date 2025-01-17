import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import styles from "./styles";
import Dropdown from "react-bootstrap/Dropdown";
import axios from "axios";

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
    const [searchTerm, setSearchTerm] = useState(""); // Search term


    const fetchUsers = async (page = 1) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                `${process.env.REACT_APP_API_URL}/get-users?page=${page}&limit=${limit}&name=${encodeURIComponent(searchTerm)}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.ok) {
                const { data, totalPages } = await response.json();
                setUsers(data); // Set the fetched users in the state
                setTotalPages(totalPages); // Update totalPages without subtraction
            } else {
                console.error("Failed to fetch users:", await response.text());
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const handleSearch = async (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        try {
            await fetchUsers(1);
        } catch (err) {
            console.error("Failed to search", err);
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
            // Validate required fields
            if (!username || username.trim() === "") {
                await Swal.fire({
                    icon: "error",
                    title: "Validation Error",
                    text: "Username is required.",
                });
                return; // Exit the function if validation fails
            }

            if (!usercode || usercode.trim() === "") {
                await Swal.fire({
                    icon: "error",
                    title: "Validation Error",
                    text: "Nama undangan is required.",
                });
                return; // Exit the function if validation fails
            }

            if (!editUser && (!password || password.trim() === "")) {
                await Swal.fire({
                    icon: "error",
                    title: "Validation Error",
                    text: "Password is required for new customer.",
                });
                return; // Exit the function if validation fails
            }

            const token = localStorage.getItem("token");
            const url = editUser
                ? `${process.env.REACT_APP_API_URL}/update-user/${editUser.id}` // For update
                : `${process.env.REACT_APP_API_URL}/register`; // For creating a new user
            const method = editUser ? "PUT" : "POST";

            const body = {
                username,
                role: "customer",
                usercode, // Include usercode in the request
            };

            if (!editUser || password.trim() !== "") {
                body.password = password; // Include password if provided
            }

            const response = await axios({
                url,
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                data: body,
            });

            if (response.status === 200 || response.status === 201) {
                fetchUsers(page); // Refresh the user list
                closeModal(); // Close the modal
                await Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: editUser ? "User updated successfully!" : "User added successfully!",
                    timer: 2000,
                    showConfirmButton: false,
                });
            } else {
                console.error("Failed to save user:", response.data);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: response.data?.error || "An error occurred while saving the user.",
                });
            }
        } catch (error) {
            console.error("Error saving user:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.response?.data?.error || "An unexpected error occurred.",
            });
        }
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.delete(
                `${process.env.REACT_APP_API_URL}/users/${id}`,
                {
                    headers: {Authorization: `Bearer ${token}`},
                }
            );

            if (response.status === 200) {
                await Swal.fire({
                    icon: "success",
                    title: "Terhapus",
                    text: "Data sukses terhapus!",
                    timer: 2000,
                    showConfirmButton: false,
                });
                fetchUsers(page); // Refresh the data to reflect the deletion
            }
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: err.response?.data?.error || "Failed to delete data.",
            });
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Customers</h1>
            <div style={styles.controls}>

            <button onClick={() => openModal()} style={styles.addButton}>
                +
            </button>
            <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={handleSearch}
                style={styles.searchInput}
            />

            </div>
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
                            <Dropdown drop="down">
                                <Dropdown.Toggle style={styles.dropdownToggle} size="sm" className="dropdown-toggle">
                                    Actions
                                </Dropdown.Toggle>

                                <Dropdown.Menu style={{zIndex: 1050}} container="body">
                                    <Dropdown.Item
                                        onClick={() => openModal(user)}
                                    >
                                        Ubah
                                    </Dropdown.Item>
                                    <Dropdown.Divider/>
                                    <Dropdown.Item
                                        onClick={() =>
                                            Swal.fire({
                                                title: "Apakah kamu yakin?",
                                                text: "Kamu tidak akan bisa mengembalikan aksi ini!",
                                                icon: "warning",
                                                showCancelButton: true,
                                                confirmButtonColor: "#d33",
                                                cancelButtonColor: "#3085d6",
                                                confirmButtonText: "Ya, Hapus ini!",
                                            }).then((result) => {
                                                if (result.isConfirmed) {
                                                    handleDelete(user.id);
                                                }
                                            })
                                        }
                                    >
                                        Hapus
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div style={styles.pagination}>
                <button
                    style={{borderRadius: "5px"}}
                    onClick={handlePrev}
                    disabled={page === 1}
                >
                    &lt;&lt;
                </button>
                <span>
                    Page {page} of {totalPages}
                </span>
                <button
                    style={{borderRadius: "5px"}}
                    onClick={handleNext}
                    disabled={page === totalPages}
                >
                    &gt;&gt;
                </button>
            </div>

            {modalVisible && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modal}>
                        <h2>{editUser ? "Edit Customer" : "Add Customer"}</h2>
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