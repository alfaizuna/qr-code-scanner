import React, { useRef, useEffect } from "react";
import Swal from "sweetalert2";
import BarcodeScannerComponent from "react-qr-barcode-scanner";

function App() {
    const [data, setData] = React.useState("Not Found");
    const [torchOn, setTorchOn] = React.useState(false);
    const [showModal, setShowModal] = React.useState(false);
    const [name, setName] = React.useState("");
    const [jumlahOrang, setJumlahOrang] = React.useState("");

    // Ref for the "Jumlah Orang" input
    const jumlahOrangRef = useRef(null);

    // Focus on the "Jumlah Orang" input when the modal is shown
    useEffect(() => {
        if (showModal && jumlahOrangRef.current) {
            jumlahOrangRef.current.focus();
        }
    }, [showModal]);


    const handleConfirm = () => {
        Swal.fire({
            title: "Confirmation Successful!",
            icon: "success",
            confirmButtonText: "OK",
        }).then(() => {
            // Reset fields after confirmation
            setShowModal(false);
            setData("Not Found");
            setName("");
            setJumlahOrang("");
        });
    };

    const handleCancel = () => {
        setShowModal(false);
        setName("");
        setJumlahOrang("");
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Undangan</h1>
            <div style={styles.scannerWrapper}>
                <BarcodeScannerComponent
                    width="100%"
                    height="auto"
                    torch={torchOn}
                    onUpdate={(err, result) => {
                        if (result && result.text !== data) {
                            setData(result.text);
                            setName(result.text);
                            setShowModal(true); // Show modal when a barcode is successfully scanned
                        }
                    }}
                />
            </div>
            <h3>Scan QR Code</h3>
            <p>Pastikan <strong>QR Code</strong> tidak ketukar dan jelas kebaca.</p>
            <div style={styles.controls}>
                <button style={styles.button} onClick={() => setTorchOn(!torchOn)}>
                    Switch Torch {torchOn ? "Off" : "On"}
                </button>
            </div>

            {/* Modal */}
            {showModal && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modal}>
                        <h2 style={styles.modalTitle}>Check In</h2>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Nama:</label>
                            <input
                                style={styles.input}
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter name"
                            />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Jumlah Orang:</label>
                            <input
                                style={styles.input}
                                type="tel"
                                value={jumlahOrang}
                                onChange={(e) => setJumlahOrang(e.target.value)}
                                placeholder="Enter number of people"
                                ref={jumlahOrangRef}
                            />
                        </div>
                        <div style={styles.modalActions}>
                            <button style={styles.button} onClick={handleConfirm}>
                                Confirm
                            </button>
                            <button
                                style={styles.cancelButton}
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "10px",
        maxWidth: "600px",
        margin: "0 auto",
    },
    title: {
        fontSize: "24px",
        fontWeight: "bold",
        marginBottom: "20px",
        textAlign: "center",
        color: "#333",
    },
    scannerWrapper: {
        width: "100%",
        maxWidth: "250px",
        aspectRatio: "1 / 1",
        overflow: "hidden",
        borderRadius: "10px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
    controls: {
        marginTop: "20px",
        textAlign: "center",
    },
    button: {
        padding: "10px 20px",
        fontSize: "16px",
        borderRadius: "5px",
        backgroundColor: "#007BFF",
        color: "#fff",
        border: "none",
        cursor: "pointer",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    cancelButton: {
        padding: "10px 20px",
        fontSize: "16px",
        borderRadius: "5px",
        backgroundColor: "#DC3545",
        color: "#fff",
        border: "none",
        cursor: "pointer",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        marginLeft: "10px",
    },
    modalOverlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    modal: {
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "10px",
        width: "90%",
        maxWidth: "400px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
    modalTitle: {
        fontSize: "20px",
        fontWeight: "bold",
        marginBottom: "15px",
    },
    inputGroup: {
        marginBottom: "15px",
    },
    label: {
        display: "block",
        marginBottom: "5px",
        fontWeight: "bold",
    },
    input: {
        width: "100%",
        padding: "8px",
        fontSize: "16px",
        borderRadius: "5px",
        border: "1px solid #ccc",
    },
    modalActions: {
        display: "flex",
        justifyContent: "flex-end",
    },
};

export default App;