/** Case-insensitive match on title or author. An empty query returns every book. */
export function searchBooks(store, query = "") {
  const needle = query.trim().toLowerCase();
  const books = store.listBooks();
  if (!needle) return books;
  return books.filter(
    (book) => book.title.toLowerCase().includes(needle) || book.author.toLowerCase().includes(needle),
  );
}
