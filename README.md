# Shelf

A small library lending service: books, members, loans and late fines. It exists to test Void
features, mainly Void Review, so it is deliberately small and has no dependencies.

## Run it

```bash
npm test
npm start          # http://localhost:3000
```

## API

| Method | Path | What it does |
|---|---|---|
| GET | `/health` | Liveness check |
| GET | `/books?q=` | List books; `q` filters by title or author |
| POST | `/books` | Add a book `{ title, author, isbn?, copies? }` |
| GET | `/books/:id` | One book plus how many copies are available |
| POST | `/members` | Add a member `{ name, email }` |
| GET | `/members/:id/fines` | Total outstanding fines, in cents |
| POST | `/loans` | Borrow a book `{ bookId, memberId }` |
| POST | `/loans/:id/return` | Return a book; the response includes the fine |

## Layout

```
src/
  config.js          lending policy (loan period, limits, fines)
  store.js           in-memory repository
  models/            book, member validation
  services/          loans, fines (the business rules)
  http/              router + node:http server
  util/              dates, errors
test/                node:test suites
research/            Researcher Lab corpus (OKF notes) about lending policy
docs/specs/          specs that Void Paw can build from
```

See [AGENTS.md](AGENTS.md) for the rules PRs are reviewed against.
