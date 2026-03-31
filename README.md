# 🚀 AcadTrackAI

**Collaborative Weekly Report Management System**

---

## 📌 Overview

AcadTrackAI is a web-based platform designed to streamline the creation and management of departmental weekly reports in educational institutions.

It replaces manual data collection with a structured, collaborative system that enables multiple contributors to input, manage, and generate reports efficiently.

---

## 🎯 Problem Solved

Traditional weekly reporting involves collecting data manually from multiple faculty members across 17 sections, leading to:

* Delays and inefficiencies
* Missing or inconsistent data
* Increased workload for coordinators

AcadTrackAI solves this by providing:

* Centralized data entry
* Structured section-wise forms
* Automated report generation

---

## ⚙️ Key Features

### 🧾 17 Structured Report Sections

Covers all required institutional sections including:

* Faculty & Student Achievements
* Events (Technical & Non-Technical)
* Placements, MoUs, Patents
* Skill Development Programs
* And more

---

### 👥 Collaborative Data Entry

* Multiple contributors can add entries
* Each entry is tagged with contributor name
* Supports dynamic row-based inputs

---

### 📊 Smart Dashboard

* Displays all 17 sections
* Status indicators:

  * Completed
  * In Progress
  * Empty
* Overall completion tracking

---

### 📅 Week-Based Management

* Data is organized by selected week
* Easy switching between different reporting periods

---

### 📎 File Upload Support

* Optional proof/document upload for each entry
* Enhances validation and transparency

---

### 📄 Report Generation

* Generates structured weekly report
* Matches institutional format
* Preview before download

---

### 📥 Custom Report Download

* Download full report
* Or generate section-wise customized reports

---

## 🧱 Tech Stack

**Frontend:**

* React (Vite)

**Backend:**

* Node.js
* Express.js

**Database:**

* MongoDB

---

## 📂 Project Structure

```
Team2_MNRU/
├── frontend/    # React application
├── backend/     # Node + Express server
└── database/    # Database schema & setup
```

---

## 🧬 Database Design

The system uses a week-based data model:

* Each week contains all 17 sections
* Each section contains multiple entries
* Each entry includes:

  * Structured data fields
  * Contributor name
  * Optional file
  * Timestamp

---

## ▶️ How to Run Locally

### 1. Clone the repository

```
git clone <repo-link>
cd Team2_MNRU
```

### 2. Start Backend

```
cd backend
npm install
node server.js
```

### 3. Start Frontend

```
cd frontend
npm install
npm run dev
```

---

## 🚀 Future Enhancements

* Role-based authentication (Admin / Faculty)
* Real-time collaboration
* Advanced analytics dashboard
* Full PDF/DOCX export engine

---

## 👨‍💻 Team

**Team Name:** Team Krypto

---

## 💡 Conclusion

AcadTrackAI transforms a manual, error-prone reporting process into a structured, efficient, and collaborative digital system, improving productivity and accuracy in academic institutions.
