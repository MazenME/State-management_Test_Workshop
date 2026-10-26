# State Management & Testing Workshop

A small shopping-cart app built to practise **state management** and **automated testing** in React. Products come from a mock REST API, the cart lives in a typed Zustand store, and the store, the API layer and the UI are all covered by Jest and React Testing Library tests.

> **Status:** the Zustand version is complete. A Redux Toolkit version of the same app (for a side-by-side comparison) is planned but not built yet.

## Features

- Product catalogue loaded from a REST endpoint, with loading and error states
- Cart with add, increase, decrease, remove and clear actions
- Stock limits: an item can't be added beyond its available stock, and the button shows "Out of stock"
- Cart totals and an empty-cart state
- Cart persisted in `localStorage`, so it survives a page refresh (products are always re-fetched)

## Tech stack

| Area | Tools |
| --- | --- |
| UI | React 19, TypeScript, Vite |
| State | Zustand (with the `persist` middleware) |
| HTTP | Axios |
| Mock backend | JSON Server |
| Testing | Jest, React Testing Library, user-event, jest-dom |
| Tooling | Oxlint, Babel (for Jest) |

## Getting started

Requirements: Node.js and Yarn (the repo includes a `yarn.lock`).

```bash
# install dependencies
yarn install

# terminal 1: start the mock API on http://localhost:3001
yarn start

# terminal 2: start the app
yarn dev
```

Open the URL Vite prints (usually http://localhost:5173). The API base URL is set in `src/api/axiosInstance.ts`.

## Scripts

| Command | What it does |
| --- | --- |
| `yarn dev` | Start the Vite dev server |
| `yarn start` | Start JSON Server using `server/db.json` on port 3001 |
| `yarn build` | Type-check and build for production |
| `yarn preview` | Preview the production build |
| `yarn lint` | Run Oxlint |
| `yarn test` | Run the Jest test suite |

## Testing

The tests live in `src/tests/zustand/` and run in a `jsdom` environment:

| File | What it covers |
| --- | --- |
| `shopStore.test.ts` | Store logic: fetching products, adding to cart, stock limits, increasing and decreasing quantity, removing items, clearing the cart (API mocked) |
| `productsApi.test.ts` | The products API function: success and failure (Axios mocked) |
| `productsUi.test.tsx` | Products component: loading, error and loaded states, stock count updates, disabled button when out of stock |
| `cartUi.test.tsx` | Cart component: empty state, totals, +/- buttons, Remove, Clear cart, Close |

Run them with:

```bash
yarn test
```

## Project structure

```
server/db.json              Mock data served by JSON Server
src/
  api/                      Axios instance and products API
  components/
    common/Navbar.tsx
    zustand/                Products and Cart components
  store/zustand/shopStore.ts  Zustand store (products, cart, loading, error)
  tests/zustand/            Store, API and UI tests
  types/                    Product, cart and store types
md.md                       My step-by-step task list and notes for the workshop
```

## What I practised

- Designing a typed store with actions and derived behaviour (stock limits, quantity rules)
- Persisting only part of the state (`cart`) with `partialize`
- Mocking modules and network calls in Jest
- Testing user behaviour with React Testing Library instead of implementation details

## Roadmap

- [x] Axios instance and products API
- [x] Zustand store: products, cart, loading and error states
- [x] Products and cart UI
- [x] Jest tests for the store and API
- [x] React Testing Library tests for the UI
- [ ] Rebuild the same app with Redux Toolkit (store, slices, async thunk) and test it
- [ ] Compare Zustand and Redux Toolkit in practice
