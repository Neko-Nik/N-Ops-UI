import React, { useState, useRef, useEffect } from "react";


const API_WS_BASE_URL = "NekoNik.com"; // TODO: Make this as an environment variable


const SQLChatInterface = ({ dbInfo, onClose }) => {
    const [messages, setMessages] = useState([]);
    const [query, setQuery] = useState("");
    const [nekoPass, setNekoPass] = useState("");
    const [tempPass, setTempPass] = useState("");
    const logRef = useRef(null);
    const socket = useRef(null);

    const handleSend = () => {
        if (!query.trim()) return;
      
        const newUserMessage = { from: "user", text: query };
        setMessages((prev) => [...prev, newUserMessage]);
      
        // Send SQL via WebSocket
        if (socket.current?.readyState === WebSocket.OPEN) {
            socket.current.send(JSON.stringify({
                "neko_pass": nekoPass,
                "db_name": dbInfo.id,
                "sql_command": query
            }));
        } else {
            setMessages((prev) => [
                ...prev,
                { from: "bot", response: { type: "message", data: "❌ WebSocket not connected." } }
            ]);
        }

        setQuery("");
    };

    useEffect(() => {
        logRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        // Open WebSocket on component mount
        socket.current = new WebSocket(`wss://${API_WS_BASE_URL}/commander/sql-query`);

        socket.current.onopen = () => {
            console.log("WebSocket connected ✅");
        };

        socket.current.onmessage = (event) => {
            const response = JSON.parse(event.data);
            if (response.error) {
                setMessages((prev) => [
                    ...prev,
                    { from: "bot", response: { type: "message", data: `❌ ${response.error}` } }
                ]);
                return;
            }
            setMessages((prev) => [...prev, { from: "bot", response }]);
        };

        socket.current.onclose = () => {
          console.log("WebSocket disconnected ❌");
        };

        return () => {
            socket.current?.close();
        };
    }, []);
      

    const renderResponse = (msg, i) => {
        if (msg.from === "user") {
            return <div key={i} style={{ margin: "1rem 0", color: "#38bdf8" }}>{">"} {msg.text}</div>;
        }

        const { response } = msg;
        if (response.type === "message") {
            return <div key={i} style={{ color: "#a7f3d0", marginBottom: "1rem" }}>{response.data}</div>;
        }

        const rows = response.rows;
        const headers = Object.keys(rows[0] || {});
        
        return (
            <table key={i} style={{ width: "100%", borderCollapse: "collapse", marginBottom: "1rem" }}>
                <thead>
                    <tr>
                        { headers.map((h) => (
                            <th key={h} style={{ borderBottom: "1px solid #444", textAlign: "left", padding: "0.5rem" }}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    { rows.map((row, idx) => (
                        <tr key={idx}>
                            { headers.map((h) => (
                                <td key={h} style={{ padding: "0.5rem", borderBottom: "1px solid #333" }}>{row[h]}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    const handlePasswordSubmit = () => {
        if (tempPass.trim()) {
            setNekoPass(tempPass.trim());
            setTempPass("");
        }
    };

    return (
        <div style={{
            height: "100vh",
            background: "#0f172a",
            display: "flex",
            flexDirection: "column",
            fontFamily: "sans-serif",
            color: "#e2e8f0",
        }}>
            {/* PASSKEY MODAL */}
            { !nekoPass && (
                <div style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(15, 23, 42, 0.7)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1000
                }}>
                    <div style={{
                        background: "#1e293b",
                        padding: "2rem",
                        borderRadius: "12px",
                        boxShadow: "0 0 30px rgba(0,0,0,0.5)",
                        width: "90%",
                        maxWidth: "400px",
                        textAlign: "center"
                    }}>
                        <h2 style={{ marginBottom: "1rem", fontSize: "1.2rem" }}>🔐 Enter Password</h2>
                        <input
                            type="password"
                            value={tempPass}
                            onChange={(e) => setTempPass(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handlePasswordSubmit()}
                            style={{
                                width: "90%",
                                padding: "0.75rem",
                                borderRadius: "8px",
                                border: "1px solid #475569",
                                backgroundColor: "#0f172a",
                                color: "#fff",
                                fontSize: "1rem",
                                marginBottom: "1rem"
                            }}
                            placeholder="Password"
                        />
                        <button
                            onClick={handlePasswordSubmit}
                            style={{
                                background: "#4f46e5",
                                border: "none",
                                padding: "0.75rem 1.25rem",
                                borderRadius: "8px",
                                color: "#fff",
                                fontWeight: "600",
                                cursor: "pointer",
                                width: "100%"
                            }}
                        >
                            Submit
                        </button>
                    </div>
                </div>
            )}

            {/* HEADER */}
            <div style={{ background: "#1e293b", padding: "1rem", borderBottom: "1px solid #334155" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    <strong>{dbInfo.name}</strong><br />
                    <small>Host: {dbInfo.host}</small> &nbsp;|&nbsp;
                    <small>DB: {dbInfo.database}</small> &nbsp;|&nbsp;
                    <small>Port: {dbInfo.port}</small> &nbsp;|&nbsp;
                    <small>User: {dbInfo.username}</small>
                </div>
                <button
                    onClick={onClose}
                    style={{
                        color: "#f87171",
                        fontSize: "1.6rem",
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        padding: "0rem",
                        paddingRight: "1rem",
                    }}
                >×</button>
                </div>
                
                { dbInfo.parameters && (
                    <div style={{ marginTop: "0.75rem", fontSize: "0.9rem", color: "#cbd5e1" }}>
                        Params:{" "}
                        {Object.entries(dbInfo.parameters).map(([k, v], idx) => (
                            <span key={idx}>{k}={v}{idx < Object.entries(dbInfo.parameters).length - 1 ? ", " : ""}</span>
                        ))}
                    </div>
                )}
            </div>

            {/* CHAT OUTPUT */}
            <div className="log-stream" style={{ flex: 1, padding: "1rem", overflowY: "auto" }}>
                {messages.map((msg, i) => renderResponse(msg, i))}
                <div ref={logRef} />
            </div>

            {/* INPUT */}
            <div style={{
                padding: "1rem",
                borderTop: "1px solid #334155",
                background: "#1e293b",
                display: "flex",
                gap: "0.75rem"
            }}>
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Type SQL here..."
                    style={{
                        flex: 1,
                        padding: "0.75rem 1rem",
                        borderRadius: "8px",
                        border: "1px solid #475569",
                        backgroundColor: "#0f172a",
                        color: "#fff",
                        fontSize: "1rem",
                    }}
                />
                <button
                    onClick={handleSend}
                    style={{
                        background: "#4f46e5",
                        border: "none",
                        padding: "0.75rem 1.25rem",
                        borderRadius: "8px",
                        color: "#fff",
                        fontWeight: "600",
                        cursor: "pointer"
                    }}
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default SQLChatInterface;
