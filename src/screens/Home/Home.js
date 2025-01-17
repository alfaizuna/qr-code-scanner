import React, { useEffect, useState } from "react";
import styles from "./styles";

const Home = () => {
    const [totalJumlahOrang, setTotalJumlahOrang] = useState(0);
    const [usercode, setUsercode] = useState("");

    useEffect(() => {
        const storedUsercode = localStorage.getItem("usercode");
        if (storedUsercode) {
            setUsercode(storedUsercode);
        }

        const fetchTotalJumlahOrang = async () => {
            try {
                const token = localStorage.getItem("token"); // Retrieve token for authentication
                const response = await fetch(`${process.env.REACT_APP_API_URL}/get-total-jumlah-orang`, {
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
            <div style={{marginBottom:"20px"}}>
                <span style={{ fontFamily: "'Playball', cursive", textAlign: 'center', marginTop: '20px', fontSize: 'xx-large' }}>{usercode || "Not available"}</span>
            </div>
            <div style={styles.card}>
                <h2>Jumlah Tamu yang Hadir</h2>
                <p style={styles.number}>{totalJumlahOrang}</p>
            </div>
        </div>
    );
};

export default Home;