# To-Do App (React + Spring Boot + MySQL) — Dockerized

A small full-stack To-Do application:

- Frontend: React (Vite) served by Nginx

- Backend: Spring Boot (Java 17)

- DB: MySQL 8

- Orchestration: Docker Compose

The app is wired so the frontend talks to the backend via the same origin (/api), which works consistently on Linux, macOS, and Windows.

## 1) Prerequisites

Docker 20+

Docker Compose v2 (usually included with recent Docker Desktop / Docker Engine)

No need to install Node, Java, or MySQL locally—everything runs in containers.

## 2) One-command run

From the project root (where docker-compose.yml lives):

docker compose up -d --build


This builds the images and starts all services.

Open the app

Frontend: http://localhost

(You should see the To-Do UI. Add tasks on the left; they appear on the right.)

If your compose publishes a different port (e.g., 3000), use that: http://localhost:3000.

## 3) What gets started

frontend (Nginx): serves the built React app and proxies /api → backend:8080

backend (Spring Boot): REST API on port 8080 inside the network

mysql: MySQL 8 with an app database (mounted volume for data persistence)

Docker Compose handles the internal networking; the frontend reaches the backend by service name (backend)—no host IPs.

## 4) Configuration

The frontend is already configured to call the API via the same origin:

VITE_API_BASE_URL=/api


So the React app will call, for example, POST /api/tasks.

If you need to override it locally, create todo-frontend/.env.local with:

VITE_API_BASE_URL=/api


(Usually not necessary; the default is already set.)

## 5) API quick check (optional)

After the stack is up, you can exercise the API directly:

[comment]: <> Create a task
curl -X POST http://localhost/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Read books","description":"Need to cover the syllabus"}'

<> List tasks
curl http://localhost/api/tasks


If your frontend publishes on port 3000, use http://localhost:3000/api/....

## 6) Useful commands
<> View logs (follow all services)
docker compose logs -f

<> View only backend logs
docker compose logs -f backend

<> Stop containers (keep data volumes)
docker compose down

<> Stop and remove containers + volumes (fresh start)
docker compose down -v

## 7) Local development (optional, without Docker)

Only if you want to run services directly:

Backend:

cd todo-backend
./mvnw spring-boot:run
<> runs on http://localhost:8080


Frontend:

cd todo-frontend
npm install
echo "VITE_API_BASE_URL=http://localhost:8080/api" > .env.local
npm run dev
<> open the printed dev URL (often http://localhost:5173)


Docker is preferred for evaluation; the above is just for hacking.

Everything is containerized; docker compose up -d --build is enough.

Frontend → backend uses /api (no hard-coded hostnames).

No external services or credentials are required.
