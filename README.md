# Thesis Management System

A comprehensive web-based platform designed to streamline and manage the entire lifecycle of undergraduate theses for the Computer Engineering and Informatics Department (CEID) at the University of Patras.

## Overview
This system provides a centralized environment for students, professors, and department secretaries to collaborate on thesis projects. It handles everything from topic creation and assignment to committee formation, examination scheduling, grading, and final archiving. 

## Tech Stack
* **Backend:** Node.js with Express.js
* **Frontend:** Single Page Application (SPA) architecture using vanilla JavaScript, HTML, and CSS
* **Database:** SQL-based relational database
* **Authentication:** JSON Web Tokens (JWT) securely stored in HTTP-only cookies

## Key Features by User Role

### 👨‍🏫 Professors
* **Topic Management:** Create, edit, and delete thesis topics, or assign them directly to students.
* **Committee Participation:** Receive, accept, or reject invitations from students to join their three-member evaluation committee.
* **Thesis Oversight:** Post private notes on active theses, review student drafts, and monitor progress.
* **Examination & Grading:** Enable the grading phase, submit individual grades (which automatically calculate the final score), and generate official presentation announcements.
* **Analytics:** Access detailed statistics and histograms regarding average completion times, average grades, and total theses supervised.

### 🎓 Students
* **Topic Selection:** Browse available research topics and coordinate with professors for assignment.
* **Committee Formation:** Send official invitations to professors to form their required three-member evaluation committee.
* **Thesis Execution:** Upload thesis drafts (PDFs) and link supplementary materials or source code.
* **Examination Scheduling:** Set the date, time, and location (physical or virtual) for the thesis presentation.
* **Completion:** View the official examination report, final grades, and submit the permanent institutional repository (Nimertis) link.

### 🏛️ Secretary
* **Data Import:** Bulk import student and professor accounts into the system via JSON files.
* **Lifecycle Management:** Oversee active theses and officially transition them to "Completed" status once all requirements (grading, repository linking) are met.

### 🌍 Public Access
* **Announcements API:** A public REST endpoint that serves upcoming thesis presentation announcements in both JSON and XML formats.

## Architecture & Performance Highlights
* **Single Page Application (SPA):** The frontend relies on a single `index.html` file, dynamically updating content via DOM manipulation and REST API calls. This cleanly separates the frontend UI from the backend business logic and significantly reduces server load.
* **Asynchronous Backend:** Chosen over PHP, the Node.js/Express stack allows for highly concurrent, non-blocking request handling.
* **Automated Database Triggers:** SQL triggers are heavily utilized to automate state transitions (e.g., logging status changes, calculating final grades, and marking completion dates).
* **Optimized Server-Side Caching:** * **HTML:** `Cache-Control: private, max-age=0, must-revalidate` ensures users always see the most up-to-date dynamic state.
  * **Static Assets (CSS/JS):** `Cache-Control: public, max-age=604800` (7 days) reduces redundant network requests for static files, drastically improving load times.

## Project Contributors
* Nikolaos Derekenaris 
* Argyrios Kefalonitis 
* Evangelos Mitrogiannis 

*(Developed for the Spring Semester 2024-25 / September 2025 Examination Period)*