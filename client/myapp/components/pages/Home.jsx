import { useEffect, useState } from "react";

export default function Home() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [updatedTitles, setUpdatedTitles] = useState({});

  // Fetch all books
  const fetchBooks = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/Books/");
      const data = await response.json();
      setBooks(data);
    } catch (err) {
      console.error("Error fetching books:", err);
    }
  };

  // Create a new book
  const createBook = async () => {
    const data = {
      title,
      release_date: releaseDate,
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/api/Books/create/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("Error:", response.status, text);
        return;
      }

      const result = await response.json();
      console.log("Created book:", result);

      // Refresh list after adding
      fetchBooks();

      // Clear form
      setTitle("");
      setReleaseDate("");
    } catch (e) {
      console.error("Error creating book:", e);
    }
  };

  // Update a book title (PUT request)
  const updateBook = async (id, currentReleaseDate) => {
    const newTitle = updatedTitles[id];
    if (!newTitle || newTitle.trim() === "") return;

    const data = {
      title: newTitle,
      release_date: currentReleaseDate,
    };

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/Books/${id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("Error updating book:", response.status, text);
        return;
      }

      const result = await response.json();
      console.log("Updated book:", result);

      // Clear input for this book and refresh list
      setUpdatedTitles((prev) => ({ ...prev, [id]: "" }));
      fetchBooks();
    } catch (e) {
      console.error("Error updating book:", e);
    }
  };

  // Delete a book (DELETE request)
  const deleteBook = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/Books/${id}/`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("Error deleting book:", response.status, text);
        return;
      }

      console.log("Deleted book with id:", id);

      // Refresh list after deleting
      fetchBooks();
    } catch (e) {
      console.error("Error deleting book:", e);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <>
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault(); // prevent page reload
            createBook();
          }}
        >
          <input
            type="text"
            placeholder="Book Title ..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="date"
            placeholder="Release Date ..."
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
          />
          <button type="submit">Add Book</button>
        </form>
      </div>

      <div>
        {books.map((book) => (
          <div key={book.id}>
            <p>Title: {book.title}</p>
            <p>Release Date: {book.release_date}</p>
            <input
              type="text"
              placeholder="new title ..."
              value={updatedTitles[book.id] || ""}
              onChange={(e) =>
                setUpdatedTitles((prev) => ({
                  ...prev,
                  [book.id]: e.target.value,
                }))
              }
            />
            <button onClick={() => deleteBook(book.id)}>Delete</button>
            <button onClick={() => updateBook(book.id, book.release_date)}>
              Updatename
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
