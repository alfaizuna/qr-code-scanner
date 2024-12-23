import React, { useEffect, useState } from "react";

const Home = () => {
    const [totalJumlahOrang, setTotalJumlahOrang] = useState(0);

    useEffect(() => {
        const fetchTotalJumlahOrang = async () => {
            try {
                const token = localStorage.getItem("token"); // Retrieve token for authentication
                const response = await fetch("http://localhost:4000/get-total-jumlah-orang", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setTotalJumlahOrang(data.total);
                } else {
                    console.error("Failed to fetch total jumlah_orang");
                }
            } catch (error) {
                console.error("Error fetching total jumlah_orang:", error);
            }
        };

        fetchTotalJumlahOrang();
    }, []);

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Welcome</h1>
            <div style={styles.card}>
                <h2>Jumlah Tamu yang Hadir</h2>
                <p style={styles.number}>{totalJumlahOrang}</p>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        minHeight: "100vh",
        backgroundColor: "#f9f9f9",
    },
    title: {
        fontSize: "24px",
        fontWeight: "bold",
        marginBottom: "20px",
    },
    card: {
        padding: "20px",
        borderRadius: "10px",
        backgroundColor: "#fff",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
    },
    number: {
        fontSize: "32px",
        fontWeight: "bold",
        color: "#007BFF",
    },
};

export default Home;