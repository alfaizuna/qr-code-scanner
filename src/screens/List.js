import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

function List() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [page, setPage] = useState(1); // Current page
    const [totalPages, setTotalPages] = useState(1); // Total pages
    const limit = 10; // Items per page

    // Fetch paginated data
    const fetchData = async (page = 1) => {
        setLoading(true);
        setError("");
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `http://localhost:4000/get-scanner-data?page=${page}&limit=${limit}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setData(response.data.data);
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

    // Download data as Excel
    const downloadExcel = () => {
        if (data.length === 0) {
            alert("No data available to download");
            return;
        }
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Scanner Data");
        XLSX.writeFile(workbook, "Scanner_Data.xlsx");
    };

    // Handle page navigation
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Daftar Tamu</h1>
            <button style={styles.downloadButton} onClick={downloadExcel}>
                Download Excel
            </button>
            <table style={styles.table}>
                <thead>
                <tr>
                    <th style={styles.th}>No</th>
                    <th style={styles.th}>Nama</th>
                    <th style={styles.th}>Jumlah Orang</th>
                    <th style={styles.th}>Jam Kedatangan</th>
                </tr>
                </thead>
                <tbody>
                {data.map((item, index) => (
                    <tr key={item.id}>
                        <td style={styles.td}>{index+1}</td>
                        <td style={styles.td}>{item.nama}</td>
                        <td style={styles.td}>{item.jumlah_orang}</td>
                        <td style={styles.td}>
                            {new Date(item.created_date).toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                            })}
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
        </div>
    );
}

const styles = {
    container: {
        padding: "20px",
    },
    title: {
        fontSize: "24px",
        marginBottom: "20px",
    },
    downloadButton: {
        marginBottom: "20px",
        padding: "10px 20px",
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
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
    pagination: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "20px",
    },
    paginationButton: {
        padding: "10px 20px",
        margin: "0 5px",
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        disabled: {
            backgroundColor: "#ccc",
            cursor: "not-allowed",
        },
    },
    pageInfo: {
        margin: "0 10px",
    },
};

export default List;