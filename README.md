# Remotely — Full-Stack Candidate Management System

A professional recruitment management system that lets recruitment teams **create, browse, inspect, edit, and delete** candidate profiles with photographs, technical skills, and pagination — backed by a persistent PostgreSQL database.

Built as part of the **Remotely Works — Software Engineering Challenge 10**.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Feature Checklist](#feature-checklist)
4. [Folder Structure](#folder-structure)
5. [Prerequisites](#prerequisites)
6. [Installation](#installation)
7. [Running the Application](#running-the-application)
8. [Running Tests](#running-tests)
9. [API Documentation](#api-documentation)
10. [Database Documentation](#database-documentation)
11. [Screenshots](#screenshots)
12. [Architectural Decisions](#architectural-decisions)
13. [Roadmap / Extensions](#roadmap--extensions)
14. [License](#license)

---

## Project Overview

Remotely is a **recruitment dashboard** where a recruiter can:

- View a dashboard with total candidates, recently added candidates, and a candidate directory.
- Browse all candidates with **server-side pagination** (25 per page).
- Open an individual candidate's profile on a dedicated route.
- **Create** a new candidate with a required profile photograph and optional technical skills.
- **Edit** an existing candidate, including replacing the photograph and modifying skills.
- **Delete** a candidate after a confirmation dialog.
- Persist all data in **PostgreSQL** so records survive application restarts.

---

## Tech Stack

| Layer       | Technology                                  |
| ----------- | ------------------------------------------- |
| Frontend    | React + TypeScript + Vite + Tailwind CSS    |
| Routing     | React Router                                |
| HTTP Client | Axios                                       |
| Backend     | Python + FastAPI                            |
| ORM         | SQLAlchemy                                  |
| Database    | PostgreSQL                                  |
| Migrations  | Alembic                                     |
| Backend Tests | Pytest + httpx                          |
| Frontend Tests | Vitest + React Testing Library         |
| E2E Tests   | Playwright                                  |
| Tooling     | VS Code, Git, PowerShell, Postman           |

---

## Feature Checklist

- [ ] Dashboard with total candidates and recent candidates
- [ ] Candidate directory with server-side pagination
- [ ] Candidate profile page (route-based)
- [ ] Create candidate form with validation
- [ ] Edit candidate form with photograph replacement
- [ ] Delete candidate with confirmation dialog
- [ ] Photograph upload and display
- [ ] Multiple technical skills per candidate
- [ ] Persistent PostgreSQL storage
- [ ] Duplicate email handling
- [ ] 404 handling for invalid candidate IDs
- [ ] Loading, empty, and error states
- [ ] Responsive navigation
- [ ] Backend integration tests
- [ ] Frontend component tests
- [ ] End-to-end tests (Playwright)

---

## Folder Structure

> **Status: placeholder — will be updated as the project is built.**
