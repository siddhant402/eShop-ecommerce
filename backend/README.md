# eShop Backend (Spring Boot)

REST API for the eShop project: products, categories, JWT authentication.

**Stack:** Java 21, Spring Boot 3.4, Spring Security (JWT), Spring Data JPA, H2 / MySQL 8, springdoc OpenAPI.

## Run locally (no database install needed)
```
.\mvnw.cmd spring-boot:run
```
API: http://localhost:8080. Data is stored in `./data/eshop` (H2 file DB, git-ignored).

## Run against MySQL
```
$env:SPRING_PROFILES_ACTIVE="mysql"
$env:DB_PASSWORD="your-password"
.\mvnw.cmd spring-boot:run
```
Optional: `DB_URL`, `DB_USERNAME` (see `.env.example`).

## Configuration
| Variable | Default | Purpose |
|---|---|---|
| `SPRING_PROFILES_ACTIVE` | (H2) | `mysql` switches to MySQL |
| `DB_PASSWORD` | none | MySQL password (mysql profile only) |
| `DB_URL` / `DB_USERNAME` | local MySQL / `root` | MySQL connection |
| `JPA_SHOW_SQL` | `false` | SQL logging |
| `JPA_DDL_AUTO` | `update` | Hibernate schema mode |
| `SERVER_PORT` | `8080` | HTTP port |
