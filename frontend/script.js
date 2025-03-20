const BASE_URL = 'http://localhost:3000';
const noteForm = document.getElementById("noteForm");
const notesContainer = document.getElementById("notesContainer");
const logoutBtn = document.getElementById("logoutBtn");
const searchInput = document.getElementById("searchInput");

let editingNoteId = null;
const token = localStorage.getItem("token");
if (!token) {
  window.location.href = "login.html";
}
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "login.html";
});
let allNotes = [];
function displayNotes(notes) {
  notesContainer.innerHTML = '';
  if (notes.length === 0) {
    notesContainer.innerHTML = '<p>No notes yet.</p>';
  }
  notes.forEach(note => {
    const noteElement = document.createElement('div');
    noteElement.classList.add('note');
    noteElement.innerHTML = `
      <h3>${note.title}</h3>
      <p>${note.content}</p>
      <button class="editBtn" onclick="editNote('${note._id}')">Edit</button>
      <button class="deleteBtn" onclick="deleteNote('${note._id}')">Delete</button>
    `;
    notesContainer.appendChild(noteElement);
  });
}
async function fetchNotes() {
  try {
    const response = await fetch(`${BASE_URL}/api/notes`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || "Failed to fetch notes");
    }

    allNotes = await response.json();
    displayNotes(allNotes);
  } catch (error) {
    alert("Error loading notes: " + error.message);
    console.error(error);
  }
}
noteForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value.trim();
  const content = document.getElementById("content").value.trim();
  if (!title || !content) {
    alert("Please fill in both title and content.");
    return;
  }
  const noteData = { title, content };
  try {
    let response;
    if (editingNoteId) {
      response = await fetch(`${BASE_URL}/api/notes/${editingNoteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(noteData),
      });
    } else {
      response = await fetch(`${BASE_URL}/api/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(noteData),
      });
    }
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || "Failed to save note");
    }
    fetchNotes();
    noteForm.reset();
    editingNoteId = null;
    noteForm.querySelector("button").textContent = "Add Note"; // Reset button
  } catch (error) {
    alert("Error saving note: " + error.message);
    console.error(error);
  }
});
function editNote(id) {
  const note = allNotes.find(n => n._id === id);
  if (note) {
    document.getElementById("title").value = note.title;
    document.getElementById("content").value = note.content;
    editingNoteId = id;
    noteForm.querySelector("button").textContent = "Update Note";
  }
}
async function deleteNote(id) {
  if (!confirm("Are you sure you want to delete this note?")) return;
  try {
    const response = await fetch(`${BASE_URL}/api/notes/${id}`, {
      method: 'DELETE',
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || "Failed to delete note");
    }
    fetchNotes();
  } catch (error) {
    alert("Error deleting note: " + error.message);
    console.error(error);
  }
}
searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  const filteredNotes = allNotes.filter(note =>
    note.title.toLowerCase().includes(query) || note.content.toLowerCase().includes(query)
  );
  displayNotes(filteredNotes);
});
fetchNotes();
