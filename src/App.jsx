import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const App = () => {
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem("notes");
    return savedNotes ? JSON.parse(savedNotes) : [];
  });

  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [selectedNoteId, setSelectedNoteId] = useState(null);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  function handleAddNote(e) {
    e.preventDefault();

    const trimmedTitle = noteTitle.trim();
    const trimmedContent = noteContent.trim();

    if (!trimmedTitle || !trimmedContent) {
      alert("Title and content cannot be empty or just spaces.");
      return;
    }

    if (selectedNoteId) {
      setNotes(
        notes.map((note) =>
          note.id === selectedNoteId
            ? { ...note, title: trimmedTitle, content: trimmedContent }
            : note
        )
      );
      setSelectedNoteId(null);
    } else {
      const newNote = {
        id: uuidv4(),
        title: trimmedTitle,
        content: trimmedContent,
      };

      setNotes([newNote, ...notes]);
    }
    setNoteTitle("");
    setNoteContent("");
  }

  function handleEdit(note) {
    setSelectedNoteId(note.id);
    setNoteTitle(note.title);
    setNoteContent(note.content);
  }

  function handleDelete(id) {
    setNotes(notes.filter((note) => note.id != id));

    if (selectedNoteId === id) {
      setSelectedNoteId(null);
      setNoteTitle("");
      setNoteContent("");
    }
  }

  function handleCancel() {
    setSelectedNoteId(null);
    setNoteTitle("");
    setNoteContent("");
  }

  return (
    <div className="p-4 min-h-screen bg-yellow-50">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">
        Write All Your Notes Here
      </h1>

      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-1">
          <form
            className="bg-white p-6 rounded-lg shadow-md"
            onSubmit={handleAddNote}
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Add New Note
            </h2>

            <div className="mb-4">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                Title
              </label>
              <input
                id="title"
                type="text"
                required
                className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Note title"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                Content
              </label>
              <textarea
                id="content"
                required
                className="w-full border resize-none border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-40"
                placeholder="Write your note here..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-200"
            >
              Save Note
            </button>
            {selectedNoteId ? (
              <button
                onClick={handleCancel}
                className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition duration-200"
              >
                Cancel
              </button>
            ) : (
              ""
            )}
          </form>
        </div>

        {/* Notes Section */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Your Notes
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Note Card - Example */}
              {notes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}

              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition duration-200">
                <h3 className="font-medium text-lg mb-2 text-gray-800">Tips</h3>
                <p className="text-gray-600 text-sm">
                  Try to keep your notes organized and concise for better
                  readability.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;

const NoteCard = ({ note, onEdit, onDelete }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition duration-200">
      <h3 className="font-medium text-lg mb-2 text-gray-800">{note.title}</h3>
      <p className="text-gray-600 text-sm">{note.content}</p>
      <div className="mt-3 flex justify-end space-x-2">
        <button
          onClick={() => onEdit(note)}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(note.id)}
          className="text-red-600 hover:text-red-800 text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );
};
