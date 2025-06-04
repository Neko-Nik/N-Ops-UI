import React, { useState } from "react";
import SQLChatInterface from "../utils/SQLChatInterface";

// TODO: Move to API later
const tileData = {
    "Test DB - 1": {
        id: "test-db-1",
        host: "nekonik.com",
        database: "testdb",
        port: 5432,
        username: "testuser",
    },
    "Test DB - 2": {
        id: "test-db-2",
        host: "example.com",
        database: "sampledb",
        port: 5432,
        username: "sampleuser",
    },
    "Test DB - 3": {
        id: "test-db-3",
        host: "db.example.com",
        database: "mydatabase",
        port: 5432,
        username: "dbuser",
    },
    "Test DB - 4": {
        id: "test-db-4",
        host: "db.test.com",
        database: "testdb",
        port: 5432,
        username: "testuser",
    },
    "Test DB - 5": {
        id: "test-db-5",
        host: "db.sample.com",
        database: "sampledb",
        port: 5432,
        username: "sampleuser",
    },
    "Test DB - 6": {
        id: "test-db-6",
        host: "db.example.org",
        database: "exampledb",
        port: 5432,
        username: "exampleuser",
    },
    "Test DB - 7": {
        id: "test-db-7",
        host: "db.test.org",
        database: "testorgdb",
        port: 5432,
        username: "testorguser",
    },
};

const ExecSQL = () => {
  const [activeDB, setActiveDB] = useState(null);

  if (activeDB) {
    return <SQLChatInterface dbInfo={activeDB} onClose={() => setActiveDB(null)} />;
  }

  return (
    <div style={{
      padding: "2rem",
      minHeight: "92vh",
    }}>
      <h1 style={{ textAlign: "center", color: "#e8e8f5", marginBottom: "4rem" }}>🛠️ SQL Runner</h1>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
        gap: "2rem"
      }}>
        {Object.entries(tileData).map(([name, db]) => (
          <div key={db.id} onClick={() => setActiveDB({ name, ...db })} style={{
            backdropFilter: "blur(10px)",
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "12px",
            padding: "1.5rem",
            cursor: "pointer",
            transition: "transform 0.2s, box-shadow 0.2s",
            fontFamily: "sans-serif",
            fontSize: "1rem",
            fontWeight: "500",
            color: "#e2e8f0",
            boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          }}>
            <div>
              <h2 style={{ marginBottom: "0.5rem", fontSize: "1.3rem" }}>{name}</h2>
              <div style={{ fontSize: "1rem", lineHeight: "1.6" }}>
                <div><strong>Host:</strong> {db.host}</div>
                <div><strong>Database:</strong> {db.database}</div>
                <div><strong>User Name:</strong> {db.username}</div>
                <div><strong>Port:</strong> {db.port}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExecSQL;
