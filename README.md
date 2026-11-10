# Return and Refund Management System

A full-stack web application built to manage customer return requests, track their status, and check return eligibility.

## Overview

The Return and Refund Management System helps manage the return process through a centralized dashboard. It allows users to submit return requests and track their status, while administrators can review and manage requests.

## Features

- **Dashboard:** View total returns and their status (Pending, Approved, Rejected).
- **Return Requests:** Create and manage customer return requests.
- **Status Management:** Update return request statuses.
- **Eligibility Check:** Check whether a product qualifies for a return based on its purchase date.
- **Return Tracking:** View and monitor return records.
- **REST APIs:** Backend APIs for managing return requests.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, JavaScript |
| Backend | Java, Spring Boot |
| Database | MySQL |
| API | REST API |
| Build Tool | Maven |
| Version Control | Git, GitHub |

## Project Structure

```text
return-refund-manager/
│
├── backend/
│   └── src/
│       └── main/
│           ├── java/
│           └── resources/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── .gitignore
└── README.md
```

## Backend API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/returns` | Retrieve all return requests |
| POST | `/returns` | Create a return request |
| PUT | `/returns` | Update a return request |
| GET | `/returns/{id}/eligibility` | Check return eligibility |

## Getting Started

### Prerequisites

- Java Development Kit (JDK)
- Node.js and npm
- MySQL Server
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/Aaryaporwal/return-refund-manager.git
cd return-refund-manager
```

### 2. Configure the Database

Create a MySQL database:

```sql
CREATE DATABASE return_refund_db;
```

Configure your MySQL username, password, database URL, and application port in the backend's `application.properties` file.

### 3. Run the Backend

```bash
cd backend
.\mvnw.cmd spring-boot:run
```

### 4. Run the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite in your browser.

## Future Improvements

- Authentication and role-based access control
- Refund processing and payment integration
- Advanced search and filtering
- Deployment to a cloud platform

## Author

**Aarya Porwal**

- GitHub: [Aaryaporwal](https://github.com/Aaryaporwal)

---

*Built as a full-stack software development project using Java, Spring Boot, React, and MySQL.*