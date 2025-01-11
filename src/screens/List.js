import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import Dropdown from "react-bootstrap/Dropdown";

function List() {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchTerm, setSearchTerm] = useState(""); // Search term
    const [newGuest, setNewGuest] = useState({ nama: "", jumlah_orang: "" }); // New guest form
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGuest, setEditingGuest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [page, setPage] = useState(1); // Current page
    const [totalPages, setTotalPages] = useState(1); // Total pages
    const limit = 5; // Items per page

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchData(1);
        }, 500); // Delay of 500ms

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const fetchData = async (page = 1) => {
        setLoading(true);
        setError("");
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/search-by-name?page=${page}&limit=${limit}&name=${searchTerm}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setData(response.data.data);
            setFilteredData(response.data.data); // Initialize filtered data
            setPage(response.data.page);
            setTotalPages(response.data.totalPages);
        } catch (err) {
            setError("Failed to fetch data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(page);
    }, [page]);

    // Search handler
    const handleSearch = async (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        try {
            await fetchData(1); // Fetch data with the new search term
        } catch (err) {
            console.error("Failed to search", err);
        }
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.delete(
                `${process.env.REACT_APP_API_URL}/delete-scanner-data/${id}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.status === 200) {
                await Swal.fire({
                    icon: "success",
                    title: "Deleted",
                    text: "Data deleted successfully!",
                    timer: 2000,
                    showConfirmButton: false,
                });
                fetchData(page); // Refresh the data to reflect the deletion
            }
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: err.response?.data?.error || "Failed to delete data.",
            });
        }
    };

    const handleEditGuest = async (e) => {
        e.preventDefault();
        if (!editingGuest.nama || !editingGuest.jumlah_orang) {
            alert("Please fill in all fields");
            return;
        }
        try {
            const token = localStorage.getItem("token");
            const response = await axios.put(
                `${process.env.REACT_APP_API_URL}/update-scanner-data/${editingGuest.id}`,
                editingGuest,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            if (response.status === 200) {
                await Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "Guest updated successfully!",
                    timer: 2000,
                    showConfirmButton: false,
                });
                setEditingGuest(null);
                fetchData(page);
            }
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: err.response?.data?.error || "Failed to update guest.",
            });
        }
    };

    const handleEditClick = (guest) => {
        setEditingGuest(guest);
    };

    // Add new guest handler
    const handleAddGuest = async (e) => {
        e.preventDefault();
        if (!newGuest.nama || !newGuest.jumlah_orang) {
            alert("Please fill in all fields");
            return;
        }

        try {
            const token = localStorage.getItem("token"); // Retrieve the token for authorization
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/save-scanner-data`,
                newGuest,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.status === 201) {
                await Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "Guest added successfully!",
                    timer: 2000,
                    showConfirmButton: false,
                });
                setNewGuest({ nama: "", jumlah_orang: "" });
                setIsModalOpen(false); // Close the modal
                fetchData(page); // Refresh the data to reflect the new entry
            }
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: err.response?.data?.error || "Failed to add guest.",
            });
        }
    };

    // Download data as Excel
    const downloadExcel = () => {
        if (data.length === 0) {
            alert("No data available to download");
            return;
        }

        // Adjust timezone and format date
        const adjustTimezone = (dateString, offset) => {
            const date = new Date(dateString); // Parse the input date
            const utc = date.getTime() + date.getTimezoneOffset() * 60000; // Convert to UTC
            const localTime = new Date(utc + offset * 3600000); // Adjust for timezone offset
            return localTime.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit"});
        };

        // Map the data to include the new 'jam kehadiran' field
        const adjustedData = data.map((item, index) => {
            const timezoneOffset = 7; // Default GMT+7, adjust as needed
            const adjustedTime = adjustTimezone(item.created_date, timezoneOffset);
            return {
                No: index + 1,
                ...item,
                "jam kehadiran": adjustedTime, // Add the 'jam kehadiran' field
            };
        });

        // Remove 'created_date' and keep the modified 'jam kehadiran'
        const finalData = adjustedData.map(({ id, created_date, ...rest }) => rest);
        const worksheet = XLSX.utils.json_to_sheet(finalData);

        // Apply header styles
        const range = XLSX.utils.decode_range(worksheet['!ref']);
        for (let C = range.s.c; C <= range.e.c; ++C) {
            const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
            if (!worksheet[cellAddress]) continue;

            // Make header bold
            worksheet[cellAddress].s = {
                font: { bold: true }, // Set bold font
                border: {
                    top: { style: "thin" },
                    bottom: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                },
            };
        }

        // Apply borders to all cells
        for (let R = range.s.r; R <= range.e.r; ++R) {
            for (let C = range.s.c; C <= range.e.c; ++C) {
                const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
                if (!worksheet[cellAddress]) continue;

                worksheet[cellAddress].s = {
                    ...worksheet[cellAddress].s,
                    border: {
                        top: { style: "thin" },
                        bottom: { style: "thin" },
                        left: { style: "thin" },
                        right: { style: "thin" },
                    },
                };
            }
        }

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Daftar Tamu");
        XLSX.writeFile(workbook, "daftar_tamu.xlsx");
    };


    // Handle page navigation
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    if (filteredData.length === 0 && !loading) {
        return <p style={{ textAlign: "center" }}>No results found.</p>;
    }
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Daftar Tamu</h1>
            {/* Search and Download Controls */}
            <div style={styles.controls}>
                <button
                    style={styles.addButton}
                    onClick={() => setIsModalOpen(true)}
                >
                    Add Guest
                </button>
                <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={handleSearch}
                    style={styles.searchInput}
                />
            </div>

            <button style={styles.downloadButton} onClick={downloadExcel}>
                Download Excel
            </button>

            {/* Table */}
            <table style={styles.table}>
                <thead>
                <tr>
                    <th style={styles.th}>No</th>
                    <th style={styles.th}>Nama</th>
                    <th style={styles.th}>Jumlah Orang</th>
                    <th style={styles.th}>Jam Kedatangan</th>
                    <th style={styles.th}>Actions</th>
                </tr>
                </thead>
                <tbody>
                {filteredData.map((item, index) => (
                    <tr key={item.id}>
                        <td style={styles.td}>{(page - 1) * limit + index + 1}</td>
                        <td style={styles.td}>{item.nama}</td>
                        <td style={styles.td}>{item.jumlah_orang}</td>
                        <td style={styles.td}>
                            {new Date(item.created_date).toLocaleTimeString(
                                "en-US",
                                {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: false,
                                }
                            )}
                        </td>
                        <td style={styles.td}>
                            <Dropdown>
                                <Dropdown.Toggle style={styles.dropdownToggle} size="sm">
                                    Actions
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => handleEditClick(item)}>
                                        Edit
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        onClick={() =>
                                            Swal.fire({
                                                title: "Are you sure?",
                                                text: "You won't be able to revert this!",
                                                icon: "warning",
                                                showCancelButton: true,
                                                confirmButtonColor: "#d33",
                                                cancelButtonColor: "#3085d6",
                                                confirmButtonText: "Yes, delete it!",
                                            }).then((result) => {
                                                if (result.isConfirmed) {
                                                    handleDelete(item.id);
                                                }
                                            })
                                        }
                                    >
                                        Delete
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Pagination Controls */}
            <div style={styles.pagination}>
                <button
                    style={styles.paginationButton}
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                >
                    Previous
                </button>
                <span style={styles.pageInfo}>
                    Page {page} of {totalPages}
                </span>
                <button
                    style={styles.paginationButton}
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                >
                    Next
                </button>
            </div>

            {/* Modal for Add Guest */}
            {isModalOpen && (
                <div style={styles.modal}>
                    <div style={styles.modalContent}>
                        <h2 style={styles.modalTitle}>Add Guest</h2>
                        <form onSubmit={handleAddGuest}>
                            <input
                                type="text"
                                placeholder="Nama"
                                value={newGuest.nama}
                                onChange={(e) =>
                                    setNewGuest({
                                        ...newGuest,
                                        nama: e.target.value,
                                    })
                                }
                                style={styles.modalInput}
                            />
                            <input
                                type="number"
                                placeholder="Jumlah Orang"
                                value={newGuest.jumlah_orang}
                                onChange={(e) =>
                                    setNewGuest({
                                        ...newGuest,
                                        jumlah_orang: e.target.value,
                                    })
                                }
                                style={styles.modalInput}
                            />
                            <div style={styles.modalActions}>
                                <button type="submit" style={styles.modalButton}>
                                    Add
                                </button>
                                <button
                                    type="button"
                                    style={styles.modalButtonCancel}
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {editingGuest && (
                <div style={styles.modal}>
                    <div style={styles.modalContent}>
                        <h2 style={styles.modalTitle}>Edit Guest</h2>
                        <form onSubmit={handleEditGuest}>
                            <input
                                type="text"
                                placeholder="Nama"
                                value={editingGuest.nama}
                                onChange={(e) =>
                                    setEditingGuest({
                                        ...editingGuest,
                                        nama: e.target.value,
                                    })
                                }
                                style={styles.modalInput}
                            />
                            <input
                                type="number"
                                placeholder="Jumlah Orang"
                                value={editingGuest.jumlah_orang}
                                onChange={(e) =>
                                    setEditingGuest({
                                        ...editingGuest,
                                        jumlah_orang: e.target.value,
                                    })
                                }
                                style={styles.modalInput}
                            />
                            <div style={styles.modalActions}>
                                <button type="submit" style={styles.modalButton}>
                                    Save
                                </button>
                                <button
                                    type="button"
                                    style={styles.modalButtonCancel}
                                    onClick={() => setEditingGuest(null)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

const styles = {
    container: {padding: "20px"},
    title: {fontSize: "24px", marginBottom: "20px"},
    controls: { display: "flex", gap: "10px", marginBottom: "20px", width: "100%" },
    searchInput: {
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        flex: "1",
    },
    downloadButton: {
        padding: "10px 20px",
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        height: "40px", // Match height with the search input
        marginTop: "-30px",
        marginBottom: "10px",
    },
    addButton: {
        padding: "10px 20px",
        backgroundColor: "#28a745",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        height: "40px", // Match height with the search input
    },
    table: { width: "100%", borderCollapse: "collapse" },
    th: { border: "1px solid #ddd", padding: "8px", backgroundColor: "#f8f9fa", textAlign: "center" },
    td: { border: "1px solid #ddd", padding: "8px", textAlign: "center" },
    pagination: { display: "flex", justifyContent: "center", marginTop: "20px" },
    paginationButton: { padding: "10px 20px", margin: "0 5px", borderRadius: "5px" },
    pageInfo: { margin: "0 10px" },
    modal: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "5px",
        width: "400px",
        textAlign: "center",
    },
    modalTitle: { marginBottom: "20px" },
    modalInput: {
        display: "block",
        width: "100%",
        padding: "10px",
        marginBottom: "10px",
        border: "1px solid #ccc",
        borderRadius: "5px",
    },
    modalActions: { display: "flex", justifyContent: "space-between" },
    modalButton: { padding: "10px 20px", backgroundColor: "#28a745", color: "#fff" },
    modalButtonCancel: {
        padding: "10px 20px",
        backgroundColor: "#dc3545",
        color: "#fff",
    },
    editButton: {
        padding: "5px 10px",
        backgroundColor: "#ffc107",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
    },
    dropdownToggle: {
        padding: "5px 10px",
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
};

export default List;