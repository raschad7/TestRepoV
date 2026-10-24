# API examples

Start the server with `npm start`, then:

```bash
# add a book
curl -s -X POST localhost:3000/books -H 'content-type: application/json' \
  -d '{"title":"Dune","author":"Frank Herbert","copies":2}'

# add a member
curl -s -X POST localhost:3000/members -H 'content-type: application/json' \
  -d '{"name":"Ada","email":"ada@example.com"}'

# borrow (use the ids from above)
curl -s -X POST localhost:3000/loans -H 'content-type: application/json' \
  -d '{"bookId":"<book-id>","memberId":"<member-id>"}'

# return it; the response includes fineCents
curl -s -X POST localhost:3000/loans/<loan-id>/return

# what does the member owe?
curl -s localhost:3000/members/<member-id>/fines
```

Errors come back as `{ "error": "...", "requestId": "..." }`. Send `x-request-id` to choose the id.
