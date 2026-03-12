🎓 School ERP System

A comprehensive School Enterprise Resource Planning (ERP) System designed to manage and automate administrative, academic, and operational activities within educational institutions.

This project provides a centralized platform for handling student records, attendance, academic data, fee management, and staff administration, enabling schools to streamline operations and improve efficiency.

The system is intended for:

Schools and educational institutions

Administrators and school management

Teachers and academic staff

Developers interested in ERP or education management systems

🚀 Features

The School ERP System includes modules that simplify school administration:

👨‍🎓 Student Management

Student registration and profiles

Academic information tracking

Student enrollment records

📊 Attendance Management

Track daily student attendance

Attendance reports and analytics

Teacher attendance tracking

💰 Fee Management

Record and track student fees

Fee receipt generation

Fee status monitoring

👩‍🏫 Staff / Teacher Management

Teacher profiles and records

Role-based access control

Staff management dashboard

📅 Academic Management

Class scheduling

Subject allocation

Exam and results management

📈 Reports & Analytics

Academic reports

Attendance reports

Financial summaries

🔐 Authentication & Access Control

Login system for administrators and staff

Secure authentication

Role-based system access

🧰 Tech Stack

Based on the repository structure and common ERP implementations, this system is built using the following technologies:

Layer	Technology
Backend	PHP
Database	MySQL
Frontend	HTML, CSS, JavaScript
Framework/UI	Bootstrap
Server	Apache / XAMPP / LAMP
Version Control	Git
⚙️ Prerequisites

Before running the project locally, ensure the following tools are installed:

PHP (>= 7.x recommended)

MySQL or MariaDB

Apache Server

XAMPP / WAMP / LAMP

Git

Optional but recommended:

phpMyAdmin for database management

VS Code for development

📦 Installation

Follow these steps to run the project locally.

1️⃣ Clone the Repository
git clone https://github.com/CodeeSmithh/ERP-SCHOOL-ERP-.git

Navigate to the project directory:

cd ERP-SCHOOL-ERP-
2️⃣ Move Project to Web Server

Place the project inside your server directory:

Example (XAMPP):

xampp/htdocs/

Example:

xampp/htdocs/school-erp
3️⃣ Create Database

Open phpMyAdmin and create a new database:

school_erp
4️⃣ Import Database

Import the SQL file included in the repository:

school_erp.sql

Steps:

Open phpMyAdmin

Select the created database

Click Import

Upload the .sql file

5️⃣ Configure Database Connection

Locate the configuration file (commonly):

config.php

Update database credentials:

$host = "localhost";
$user = "root";
$password = "";
$database = "school_erp";
6️⃣ Run the Application

Start Apache and MySQL.

Open the browser and navigate to:

http://localhost/school-erp
🖥️ Usage

After installation, the ERP system can be used to manage school operations.

Typical workflow:

Login as Admin

Add teachers and staff

Register students

Assign classes and subjects

Record attendance

Manage student fees

Generate reports

📁 Project Structure

Example structure of the repository:

ERP-SCHOOL-ERP-
│
├── assets/            # CSS, JS, images
├── config/            # Database configuration
├── modules/           # ERP modules
│   ├── students
│   ├── teachers
│   ├── attendance
│   ├── fees
│   └── reports
│
├── database/
│   └── school_erp.sql
│
├── index.php          # Application entry point
├── login.php          # Authentication system
└── README.md
🔧 Configuration

Common configuration settings include:

Database Configuration
config/database.php
Server Configuration

Apache .htaccess may be used for:

URL routing

Security rules

Redirects

🤝 Contributing

Contributions are welcome! 🚀

To contribute:

Fork the repository

Create a new branch

git checkout -b feature/new-feature

Commit your changes

git commit -m "Add new feature"

Push to your fork

git push origin feature/new-feature

Open a Pull Request

🐛 Issues

If you encounter bugs or have feature suggestions:

Open an Issue in the repository

Provide detailed steps to reproduce the problem





📬 Contact
Email: priyanshuraturi644@gmail.com
For questions or support regarding the project:

GitHub Issues

Repository Maintainer

⭐ Support the Project

If you find this project helpful:

⭐ Star the repository
🍴 Fork it
📢 Share it with others
