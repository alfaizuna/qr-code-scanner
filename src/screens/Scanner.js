import React, { useRef, useEffect, useState } from "react";
import Swal from "sweetalert2";
import QrScanner from "react-qr-scanner";
import axios from "axios";
import {useNavigate} from "react-router-dom";

function Scanner() {
    const [data, setData] = useState("Not Found");
    const [showModal, setShowModal] = useState(false);
    const [name, setName] = useState("");
    const [jumlahOrang, setJumlahOrang] = useState("");
    const [useFrontCamera, setUseFrontCamera] = useState(false); // State to toggle camera
    const jumlahOrangRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Initialize camera state from localStorage
        const savedCameraState = localStorage.getItem("useFrontCamera");
        if (savedCameraState !== null) {
            setUseFrontCamera(JSON.parse(savedCameraState));
        }
    }, []);

    useEffect(() => {
        if (showModal && jumlahOrangRef.current) {
            jumlahOrangRef.current.focus();
        }
    }, [showModal]);

    const saveScannerData = async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                Swal.fire("Error", "You are not authenticated. Please log in.", "error");
                return;
            }

            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/save-scanner-data`,
                { nama: name, jumlah_orang: jumlahOrang },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            Swal.fire("Success", response.data.message, "success").then(() => {
                setShowModal(false);
                navigate("/list");
            });
        } catch (error) {
            console.error("Galat menyimpan data:", error);
            Swal.fire(
                "Error",
                error.response?.data?.error || "Gagal menyimpan data. coba lagi.",
                "error"
            ).then(() => {
                // Reload the page after the user clicks OK
                window.location.reload();
            });

            setShowModal(false);
        }
    };

    const handleConfirm = () => {
        if (!name || !jumlahOrang) {
            Swal.fire("Warning", "Tolong isi semua kolom.", "warning");
            return;
        }
        if (jumlahOrang === 0) {
            Swal.fire("Warning", "Jumlah orang tidak boleh 0", "warning");
            return;
        }
        saveScannerData().then(resetScannerState);
    };

    const resetScannerState = () => {
        setData("Not Found");
        setName("");
        setJumlahOrang("");
    };

    const handleCancel = () => {
        Swal.fire({
            title: "Apakah Anda yakin?",
            text: "Perubahan yang belum disimpan akan hilang.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Ya, batalkan!",
            cancelButtonText: "Tidak, kembali",
        }).then((result) => {
            if (result.isConfirmed) {
                setShowModal(false);
                setData("Not Found");
                setName("");
                setJumlahOrang("");
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }
        });
    };

    const handleScan = (result) => {
        if (result && result.text !== data) {
            setData(result.text);
            setName(result.text);
            setShowModal(true);
        }
    };

    const handleError = (error) => {
        console.error("QR Scanner Error:", error);
    };

    const toggleCamera = () => {
        setUseFrontCamera((prev) => {
            const newCameraState = !prev;
            localStorage.setItem("useFrontCamera", JSON.stringify(newCameraState)); // Save to localStorage
            return newCameraState;
        });

        // Reload the page after toggling the camera
        setTimeout(() => {
            window.location.reload();
        }, 1000); // Optional: Add a slight delay if needed for smoother user experience
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Undangan</h1>
            <div style={styles.scannerWrapper}>
                <QrScanner
                    delay={50}
                    style={styles.previewStyle}
                    onError={handleError}
                    onScan={handleScan}
                    constraints={{
                        video: { facingMode: useFrontCamera ? "user" : "environment" },
                    }}
                />
            </div>
            <h3 style={{paddingTop: '20px'}}>Scan QR Code</h3>
            <p>Pastikan <strong>QR Code</strong> tidak ketukar dan jelas kebaca.</p>
            <button style={styles.toggleButton} onClick={toggleCamera}>
                Ubah Kamera {useFrontCamera ? "Belakang" : "Depan"}
            </button>
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
                                placeholder="Masukkan nama"
                                disabled
                            />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Jumlah Orang:</label>
                            <input
                                style={styles.input}
                                type="tel"
                                value={jumlahOrang}
                                onChange={(e) => setJumlahOrang(e.target.value)}
                                placeholder="Masukkan jumlah orang"
                                ref={jumlahOrangRef}
                            />
                        </div>
                        <div style={styles.modalActions}>
                            <button style={styles.button} onClick={handleConfirm}>
                                Confirm
                            </button>
                            <button style={styles.cancelButton} onClick={handleCancel}>
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
    toggleButton: {
        padding: "10px 20px",
        marginBottom: "20px",
        fontSize: "16px",
        borderRadius: "5px",
        backgroundColor: "#007BFF",
        color: "#fff",
        border: "none",
        cursor: "pointer",
    },
    scannerWrapper: {
        width: "100%",
        maxWidth: "250px",
        aspectRatio: "1 / 1",
        overflow: "hidden",
        borderRadius: "10px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
    previewStyle: {
        width: "100%",
        height: "100%",
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
};

export default Scanner;