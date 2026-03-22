import React, { useEffect, useState } from 'react';
import { Api } from '../../Services/App/Api';
import { useBook } from '../../Services/App/slice/Dispatches/BookDispatch';
import { useSelector } from 'react-redux';

export default function DashBord() {
  const { allBooks } = useBook();
  const { books } = useSelector((state) => state.books);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        await allBooks();
        // const result = await res.json();
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div>
      {books.length === 0 && <p>Loading books...</p>}

      {books.map((book) => (
        <div
          key={book.id}
          style={{ border: '1px solid #ccc', margin: 8, padding: 8 }}
        >
          <h3>{book.title || 'No Title'}</h3>
          <p>
            {book.authors && book.authors.length > 0
              ? book.authors.map((a) => a.name).join(', ')
              : 'Unknown Author'}
          </p>
          <p>
            Ebook URL: {book.formats?.['text/plain; charset=utf-8'] || 'N/A'}
          </p>
        </div>
      ))}
    </div>
  );
}
