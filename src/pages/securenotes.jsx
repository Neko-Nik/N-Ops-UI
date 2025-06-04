import React, { useEffect, useState } from "react";
import { addSecureNote, deleteSecureNote, fetchAllSecureNotes, updateSecureNote } from "../utils/SecureNotes";


const SecureNotes = () => {
    const [notes, setNotes] = useState([]);
    const [selectedNote, setSelectedNote] = useState(null);
    const [editedTitle, setEditedTitle] = useState("");
    const [editedContent, setEditedContent] = useState("");

    const closeEditor = () => {
        setSelectedNote(null);
        setEditedTitle("");
        setEditedContent("");
    };

    const openEditor = (note) => {
        if (note) {
            setSelectedNote(note);
            setEditedTitle(note.title);
            setEditedContent(JSON.stringify(note.content, null, 2));
        } else {
            setSelectedNote({ id: null }); // indicate it's new
            setEditedTitle("");
            setEditedContent("{\n  \n}"); // nice starting point
        }
    };

    const fetchNotes = async () => {
        try {
            const response = await fetchAllSecureNotes();
            setNotes(response.notes);
        } catch (error) {
            console.error("Error fetching notes:", error);
        }
    };

    const handleSave = async () => {
        try {
            const parsedContent = JSON.parse(editedContent);
            
            if (selectedNote.id === null) {
                // Create new note
                await addSecureNote({
                    title: editedTitle,
                    content: parsedContent
                });

            } else {
                // Update existing note
                await updateSecureNote({
                    ...selectedNote,
                    title: editedTitle,
                    content: parsedContent,
                });
            }

            await fetchNotes();
            closeEditor();
        
        } catch (err) {
            alert("Invalid JSON content!");
        }
    };

    const handleDelete = async () => {
        await deleteSecureNote(selectedNote.id);
        await fetchNotes();

        closeEditor();
    };

    useEffect(() => {
        const fetchNotesInt = async () => {
            try {
                const response = await fetchAllSecureNotes();
                setNotes(response.notes);
            } catch (error) {
                console.error("Error fetching notes:", error);
            }
        };
        fetchNotesInt();
    }, []);


  return (
    <div style={{ padding: "2rem", minHeight: "92vh", color: "#e0f2fe", fontFamily: "monospace" }}>
      <h1 style={{
        textAlign: "center",
        marginBottom: "2rem",
        fontSize: "3rem",
      }}>
        My Notes
      </h1>

      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
        <button
            onClick={() => openEditor(null)}
            style={{
            background: "none",
            color: "#fff",
            borderRadius: "0px",
            fontWeight: "bold",
            fontSize: "1.3rem",
            cursor: "pointer",
            fontFamily: "monospace",
            }}
        >
            +
        </button>
    </div>

  
      {/* Notes Table */}
      <table style={{
        width: "100%",
        borderCollapse: "separate",
        borderSpacing: 0,
        marginBottom: "3rem",
        background: "rgba(0,0,0,0.3)",
        borderRadius: "8px",
        overflow: "hidden",
        backdropFilter: "blur(4px)"
      }}>
        <thead>
          <tr style={{ background: "rgba(0, 0, 0, 0.003)", backdropFilter: "blur(4px)" }}>
            <th style={{ textAlign: "left", padding: "1rem", fontSize: "1rem", textShadow: "0 0 4px #0ff" }}>Title</th>
            <th style={{ textAlign: "left", padding: "1rem", fontSize: "1rem", textShadow: "0 0 4px #0ff" }}>Created At</th>
            <th style={{ textAlign: "left", padding: "1rem", fontSize: "1rem", textShadow: "0 0 4px #0ff" }}>Updated At</th>
          </tr>
        </thead>
        <tbody>
          {notes.map((note) => (
            <tr
              key={note.id}
              onClick={() => openEditor(note)}
              style={{
                cursor: "pointer",
                transition: "background 0.3s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(34,211,238,0.1)")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              <td style={{ padding: "1rem", fontWeight: "bold", color: "#fff" }}>{note.title}</td>
              <td style={{ padding: "1rem", color: "#fff" }}>{note.created_at}</td>
              <td style={{ padding: "1rem", color: "#fff" }}>{note.updated_at}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Modal */}
      {selectedNote && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          backdropFilter: "blur(5px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <div style={{
            background: "rgba(15,23,42,0.85)",
            padding: "2rem",
            borderRadius: "12px",
            maxWidth: "600px",
            width: "90%",
            boxShadow: "0 0 30px rgba(0,255,255,0.3)",
            color: "#e0f2fe",
          }}>
            <h2 style={{ marginBottom: "1rem", color: "#67e8f9", textShadow: "0 0 5px #0ff" }}>Edit Note: {selectedNote.id}</h2>
            <input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              placeholder="Title"
              style={{
                width: "96%",
                padding: "0.75rem",
                marginBottom: "1rem",
                borderRadius: "6px",
                border: "1px solid #38bdf8",
                background: "rgba(2,6,23,0.8)",
                color: "#e0f2fe",
                fontFamily: "monospace",
                boxShadow: "0 0 5px rgba(34,211,238,0.4)",
              }}
            />
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              rows={10}
              style={{
                width: "96%",
                padding: "0.75rem",
                borderRadius: "6px",
                border: "1px solid #38bdf8",
                background: "rgba(2,6,23,0.8)",
                color: "#e0f2fe",
                fontFamily: "monospace",
                boxShadow: "0 0 5px rgba(34,211,238,0.4)",
              }}
            />
            <div style={{
              marginTop: "1.5rem",
              display: "flex",
              justifyContent: "space-between",
              gap: "1rem"
            }}>
              <button
                onClick={handleSave}
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  background: "#22c55e",
                  color: "#000",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >Save</button>
              { selectedNote.id && (
                <button
                onClick={handleDelete}
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  background: "#ef4444",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >Delete</button>
                )
              }
              
              <button
                onClick={closeEditor}
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  background: "#334155",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >Cancel</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}  

export default SecureNotes;
