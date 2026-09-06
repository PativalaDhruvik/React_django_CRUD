import { useEffect, useState } from "react";

export default function Home() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [releaseDate, setReleaseDate] = useState("");

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
          </div>
        ))}
      </div>
    </>
  );
}
