const styles = {
    container: {
        padding: "20px",
    },
    tableContainer: {
        overflowX: "auto", // Enable horizontal scrolling
        // whiteSpace: "nowrap", // Prevent table wrapping
    },
    table: {
        width: "100%", // Ensure table takes full width
        borderCollapse: "collapse",
    },
    th: {
        border: "1px solid #ddd",
        padding: "8px",
        textAlign: "left",
        backgroundColor: "#f2f2f2",
    },
    td: {
        border: "1px solid #ddd",
        padding: "8px",
        textAlign: "center"
    },
    title: {fontSize: "24px", marginBottom: "20px"},
    controls: {display: "flex", gap: "10px", marginBottom: "20px", width: "100%"},
    searchInput: {
        padding: "8px",
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
        padding: "5px 20px",
        backgroundColor: "#28a745",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        height: "40px", // Match height with the search input
    },
    pagination: {display: "flex", justifyContent: "center", marginTop: "20px"},
    paginationButton: {padding: "10px 20px", margin: "0 5px", borderRadius: "5px"},
    pageInfo: {margin: "0 10px"},
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
    modalTitle: {marginBottom: "20px"},
    modalInput: {
        display: "block",
        width: "100%",
        padding: "10px",
        marginBottom: "10px",
        border: "1px solid #ccc",
        borderRadius: "5px",
    },
    modalActions: {display: "flex", justifyContent: "space-between"},
    modalButton: {padding: "10px 20px", backgroundColor: "#28a745", color: "#fff", borderRadius: "5px"},
    modalButtonCancel: {
        padding: "10px 20px",
        backgroundColor: "#dc3545",
        color: "#fff",
        borderRadius: "5px"
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
    cardDownload: {
        maxWidth: "400px",
        margin: "50px auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
        backgroundColor: "#f9f9f9",
    },
    titleDownload: {
        fontSize: "20px",
        marginBottom: "20px",
        color: "#333",
    },
    buttonDownload: {
        padding: "10px 20px",
        fontSize: "16px",
        color: "white",
        backgroundColor: "#4285F4",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        transition: "background-color 0.3s ease",
    },
    buttonHover: {
        backgroundColor: "#357ae8",
    },
};

export default styles;