import React from "react";

const Home = () => {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                height: "100vh",
                width: "100%",
                padding: "2rem",
                boxSizing: "border-box",
            }}
        >
            <div
                style={{
                maxWidth: "800px",
                textAlign: "center",
                backdropFilter: "blur(8px)",
                backgroundColor: "rgba(0, 0, 0, 0.3)",
                padding: "3rem 4rem",
                borderRadius: "16px",
                }}
            >
                <h1
                    style={{
                        fontSize: "3.5rem",
                        fontWeight: "700",
                        color: "#ffffff",
                        marginBottom: "1.5rem",
                    }}
                >
                    Welcome Back
                    <br />
                    <span
                        style={{
                            whiteSpace: "nowrap",
                            fontSize: "4.5rem",  // Make Neko Nik larger
                            fontWeight: "800",   // Optional: you can also make Neko Nik bolder
                        }}
                    >
                        Neko Nik
                    </span>
                </h1>

                <p
                    style={{
                        fontSize: "1.4rem",
                        color: "#ffffff",
                        marginBottom: "2.5rem",
                        lineHeight: "1.8",
                        textAlign: "center",            
                    }}
                >
                    In the realm of code, your command is the law <br />
                    Where every task is a spell cast at your command
                </p>

                <button
                    onClick={() => (window.location.href = "/login")}
                    style={{
                        background: "linear-gradient(to right, #6366f1, #8b5cf6)",
                        padding: "1rem 2.5rem",
                        border: "none",
                        borderRadius: "12px",
                        color: "#fff",
                        fontWeight: "600",
                        fontSize: "1.1rem",
                        cursor: "pointer",
                        transition: "transform 0.2s ease, background 0.3s ease",
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.06)")}
                    onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                    Enter Command Center
                </button>
            </div>
        </div>
    );
};

export default Home;
