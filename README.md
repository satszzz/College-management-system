# College Management System (CMIS) 🎓

A comprehensive, role-based College Management Information System built with the **MERN Stack** (MongoDB, Express.js, React, Node.js). This application streamlines administrative tasks, academic management, and communication between students, faculty, and parents.

## 🌐 Live Demo:
**[Click here to view the Live App](https://college-management-system-gama.onrender.com/)**


## Features

The system provides tailored dashboards and functionalities for different user roles:

### 🛡️ Admin
- **User Management**: Create and manage Student, Faculty, and Admin accounts.
- **Course Management**: Add, update, and remove courses.
- **Reporting**:  View comprehensive reports on attendance, fees, and academic performance.
- **System Settings**: Configure application-wide settings.

### 👩‍🏫 Faculty
- **Student Management**: View student lists and details.
- **Attendance**: Mark and track daily student attendance.
- **Marks Integration**: Upload and manage student grades/marks.
- **Schedule**: View and manage class schedules.

### 👨‍🎓 Student
- **Dashboard**: Quick view of attendance, upcoming classes, and recent notices.
- **My Courses**: Access enrolled course details.
- **Academic Records**: View internal marks and semester results.
- **Fee Status**: Check fee payment status and history.
- **Attendance**: Track personal attendance records.

### 👪 Parent
- **Performance Tracking**: Monitor their child's academic progress (marks).
- **Fee Monitoring**: View fee dues and payment status.
- **Communications**: Receive important updates and notices.

---

## 🛠️ Tech Stack

### Frontend
- **React.js** (Vite): Fast and modular UI development.
- **React Router**: For seamless client-side navigation.
- **Context API**: For state management (Auth, Theme).
- **Vanilla CSS**: Custom, responsive, and modern styling with CSS variables.
- **React Icons**: For a clean and intuitive user interface.

### Backend
- **Node.js & Express.js**: Robust RESTful API architecture.
- **MongoDB**: NoSQL database for flexible data storage.
- **Mongoose**: ODM for data modeling and validation.
- **JWT (JSON Web Tokens)**: Secure authentication and authorization.
- **Bcrypt.js**: Password hashing for security.

---

## 🏁 Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) (Local or Atlas)
- [Git](https://git-scm.com/)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/satszzz/College-management-system.git
    cd College-management-system
    ```

2.  **Install Frontend Dependencies**
    ```bash
    npm install
    ```

3.  **Install Backend Dependencies**
    *(Assuming a backend folder structure exists, otherwise dependencies might be in root as per `package.json`)*
    ```bash
    # If backend dependencies are mixed in root
    npm install
    ```

### Running the Application

1.  **Start the Backend Server**
    ```bash
    npm run server
    ```
    *Runs on http://localhost:5000 (default)*

2.  **Start the React Development Server**
    ```bash
    npm run dev
    ```
    *Runs on http://localhost:5173 (default)*

3.  **Run Both Concurrently**
    ```bash
    npm run dev:full
    ```

---

## 📂 Project Structure

```
src/
├── assets/         # Images and static files
├── components/     # Reusable UI components
│   ├── common/     # Buttons, Inputs, Layouts
│   └── layout/     # Header, Sidebar, Footer
├── context/        # React Context (Auth, Theme)
├── pages/          # Application Pages (Views)
│   ├── auth/       # Login, Register
│   ├── dashboard/  # Role-based Dashboards
│   ├── students/   # Student-related pages
│   └── ...         # marks, fees, courses, etc.
├── services/       # API calls and Mock Data
├── utils/          # Helper functions
├── App.jsx         # Main App Component & Routing
└── main.jsx        # Entry point
```

## 🛡️ Security

- **Authentication**: JWT-based stateless authentication.
- **Authorization**: Role-based access control (RBAC) protecting routes and API endpoints.
- **Data Protection**: Passwords are hashed before storage.

--

## 🤝 Contributing

Contributions are welcome! Please fork the repository and create a pull request.
---
By Satheeswaran_B
