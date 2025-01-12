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
export default styles;