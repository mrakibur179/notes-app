import { useState } from "react";

const App = () => {
  const [notes, setNotes] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedNote, setSelectedNote] = useState(null);

  function handleAddNote(e) {
    e.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (!trimmedTitle || !trimmedDescription) {
      alert("Title and description cannot be empty or just spaces.");
      return;
    }

    if (selectedNote) {
      const updatedNotes = notes.map((note) =>
        note.id === selectedNote.id
          ? { ...note, title: trimmedTitle, description: trimmedDescription }
          : note
      );
      setNotes(updatedNotes);
      setSelectedNote(null);
    } else {
      const newNote = {
        id: Date.now(),
        title: trimmedTitle,
        description: trimmedDescription,
      };
      setNotes([newNote, ...notes]);
    }

    setTitle("");
    setDescription("");
  }

  function handleSelectedNote(notes) {
    setSelectedNote(notes);
    setTitle(notes.title);
    setDescription(notes.description);
  }

  function handleDeleteNote(id) {
    const filteredNotes = notes.filter((note) => note.id !== id);
    setNotes(filteredNotes);

    // If the deleted note was selected for editing, reset the form
    if (selectedNote && selectedNote.id === id) {
      setSelectedNote(null);
      setTitle("");
      setDescription("");
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Form Section */}
        <form
          onSubmit={handleAddNote}
          className="bg-white max-h-max p-6 rounded-lg shadow-md flex flex-col gap-4"
        >
          <h2 className="text-2xl font-bold text-gray-800">Add New Note</h2>
          <input
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note Title"
            required
          />
          <textarea
            className="border border-gray-300 rounded px-3 py-2 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Note Description"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer font-semibold py-2 rounded transition"
          >
            {selectedNote ? "Update Note" : "Submit"}
          </button>
          {selectedNote ? (
            <button
              type="button"
              onClick={() => {
                setSelectedNote(null);
                setTitle("");
                setDescription("");
              }}
              className="bg-red-600 hover:bg-red-700 text-white cursor-pointer font-semibold py-2 rounded transition"
            >
              Cancel
            </button>
          ) : (
            ""
          )}
        </form>

        {/* Notes Section */}
        {notes.length > 0 ? (
          <div className="md:col-span-2 flex flex-wrap gap-6 justify-center md:justify-start">
            {notes.map((note) => (
              <NoteItems
                key={note.id}
                note={note}
                onClick={handleSelectedNote}
                onDelete={handleDeleteNote}
              />
            ))}
          </div>
        ) : (
          <h1>Currently you don't have any notes.</h1>
        )}
      </div>
    </div>
  );
};

export default App;

const NoteItems = ({ note, onClick, onDelete }) => {
  return (
    <div
      onClick={() => onClick(note)}
      className="relative bg-white p-5 rounded-lg shadow-md w-full sm:w-[45%] md:w-[45%] lg:w-[30%] flex flex-col h-60 cursor-pointer"
    >
      <button
        className="absolute cursor-pointer top-3 right-5 text-red-500 hover:text-red-700 text-lg font-bold"
        title="Delete"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(note.id);
        }}
      >
        ✕
      </button>

      <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4 truncate">
        {note.title}
      </h3>

      <div className="flex-1 overflow-y-auto">
        <p className="text-gray-600 text-sm whitespace-pre-wrap">
          {note.description}
        </p>
      </div>
    </div>
  );
};
