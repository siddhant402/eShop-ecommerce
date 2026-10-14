# eShop

Full-stack e-commerce demo: a Spring Boot REST API and a minimalist React storefront.

| Folder | What it is |
| --- | --- |
| `backend/` | Java 21, Spring Boot 3.4, Spring Security + JWT, Spring Data JPA, H2 (default) or MySQL |
| `frontend/` | React 19, Vite 6, react-router 7, axios |

## Run locally

Prerequisites: JDK 21, Maven, Node.js 20+.

```bash
# terminal 1: API on http://localhost:8080
cd backend
mvn spring-boot:run

# terminal 2: storefront on http://localhost:5173
cd frontend
npm install
npm run dev
```

On first start the backend creates the `USER` and `ADMIN` roles and imports 100 products from DummyJSON (prices converted to INR). The Vite dev server proxies `/api` to the backend.

- Swagger UI: `http://localhost:8080/swagger-ui/index.html`
- H2 data file: `backend/data/` (delete it to reseed)

## Configuration

| Variable | Purpose | Default |
| --- | --- | --- |
| `JWT_SECRET` | Token signing key | random per start (warning logged) |
| `SERVER_PORT` | API port | `8080` |
| `SPRING_PROFILES_ACTIVE=mysql` | Use MySQL instead of H2 | off |
| `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` | MySQL connection (mysql profile) | none |
| `VITE_API_URL` | API base URL for the frontend | `/api` |

See `backend/.env.example` and `frontend/.env.example`.

## API overview

- `POST /api/auth/register`, `POST /api/auth/login`
- `GET /api/products`, `GET /api/categories` (public)
- Everything else requires a `Bearer` token

## Screenshots

`frontend/scripts/capture-screenshots.mjs` captures desktop and mobile views with Playwright:

```bash
cd frontend
npm install -D playwright && npx playwright install chromium
node scripts/capture-screenshots.mjs ./screenshots
```

## CI

GitHub Actions builds and tests the backend and builds the frontend on every push and pull request (`.github/workflows/ci.yml`).
