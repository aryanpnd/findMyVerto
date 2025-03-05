<p align="center">
  <img src="logo.png" style="border-radius:2rem" alt="Find My Verto Logo" width="200">  
</p>

<h1 align="center" style="font-size:3rem">Find My Verto</h1>
<h3 align="center">Your Open-Source LPU Companion 🚀</h3>

<p align="center">
  <a href="https://github.com/aryanpnd"><img title="Author" src="https://img.shields.io/badge/Author-aryan-green.svg?style=for-the-badge&logo=github"></a>
</p>

<p align="center">
  <a href="https://github.com/aryanpnd/findMyVerto/stargazers/"><img title="Stars" src="https://img.shields.io/github/stars/aryanpnd/findMyVerto?color=yellow&style=flat-square"></a>
  <a href="https://github.com/aryanpnd/findMyVerto/network/members"><img title="Forks" src="https://img.shields.io/github/forks/aryanpnd/findMyVerto?color=lightgrey&style=flat-square"></a>
  <a href="https://github.com/aryanpnd/findMyVerto/issues"><img title="Issues" src="https://img.shields.io/github/issues/aryanpnd/findMyVerto"></a>
</p>

Find My Verto is an open-source social and academic management platform built exclusively for LPU students. Access your timetable 📅, attendance 📊, CGPA, marks, exam schedules, assignments, friend information 👥, and much more—all in one convenient place!

---

## 📖 Table of Contents

- [✨ Features](#-features)
- [📂 Project Structure](#-project-structure)
- [⚙️ Installation](#-installation)
  - [🔧 Prerequisites](#-prerequisites)
  - [📱 App Setup](#-app-setup)
  - [🖥 Backend Setup](#-backend-setup)
- [🚀 Usage](#-usage)
  - [📲 Running the App](#-running-the-app)
  - [🛠 Interacting with the Backend](#-interacting-with-the-backend)
- [📡 API Documentation](#-api-documentation)
- [🤝 Contributing](#-contributing)
- [🚧 Future Enhancements](#-future-enhancements)
- [📜 License](#-license)
- [📧 Contact](#-contact)

---

## ✨ Features

- 🔑 **Secure Authentication:** Login securely using your LPU UMS credentials. 🔒
- 👤 **Student Profile:** View and manage your academic profile effortlessly. 🎓
- 🕒 **Timetable Management:** Access and organize your class schedule with ease. 🗓️
- 📊 **Attendance Tracking:** Monitor your attendance records in real-time. 📈
- 💯 **Marks & CGPA:** Instantly check your grades and calculate your CGPA. 📊
- 📚 **Academic Management:** Manage assignments, exams, makeup classes, pending tasks, My Messages and more. 📝
- 🧑‍🤝‍🧑 **Friend Management:** Connect with peers, send friend requests, and view friends' academic details. 🤝
- 🔔 **Real-time Notifications:** Receive timely push notifications for important updates. 📢
- 🚀 **Over-the-Air Updates:** Enjoy instant feature updates without manual intervention. 🔄
- ⚙️ **Robust Backend:** Experience secure, scalable, and well-documented API services. 🖥️
- 🎨 **User-Friendly Interface:** Navigate a visually appealing and intuitive design. 🤩
- 🌟 **Continuous Improvements:** Frequent feature enhancements and new updates are on the way! 🔄

---

## 📂 Project Structure

### 📱 App (`findmyverto`)

```
app/
    findmyverto/
        .env
        .expo/
        .gitignore
        android/
        App.js
        app.json
        assets/
        AuthPage.jsx
        babel.config.js
        context/
        dev-readme.md
        eas.json
        forDeveloper.md
        hooks/
        package.json
        readme.md
        src/
        ttTest.json
        utils/
icons/
    android/
    ios/
    web/
icons-old-rn/
    adaptive-icon.png
    favicon.png
    icon.png
    logo.png
    splash.png
```

### 🖥 Backend (`api-v1`)

```
backend/
    api-v1/
        .env
        .gitignore
        apis.md
        controller/
        models/
        package.json
        ...
```

---

## ⚙️ Installation

### 🔧 Prerequisites

Ensure you have the following installed:
- 🖥 Node.js
- 📦 npm or yarn
- 📲 Expo CLI

### 📱 App Setup

1. Clone the repository:
    ```sh
    git clone https://github.com/aryanpnd/findMyVerto.git
    ```
2. Navigate to the app directory:
    ```sh
    cd findMyVerto/app/findmyverto
    ```
3. Install dependencies:
    ```sh
    npm install --legacy-peer-deps
    ```
4. Start the development server:
    ```sh
    npm start
    # or
    yarn start
    ```

### 🖥 Backend Setup

1. Clone the repository:
    ```sh
    git clone https://github.com/aryanpnd/findMyVerto.git
    ```
2. Navigate to the backend directory:
    ```sh
    cd findMyVerto/backend/api-v1
    ```
3. Install dependencies:
    ```sh
    npm install
    ```
4. Start the server:
    ```sh
    npm start
    ```

---

## 🚀 Usage

### 📲 Running the App

1. Open **Expo Go** on your mobile device 📱.
2. Scan the QR code displayed in the terminal or browser 🖥️.
3. The app will launch on your device 🚀.

### 🛠 Interacting with the Backend

The backend server runs at `http://localhost:3000`. Test API endpoints using tools like **Postman** or **cURL**.

---

## 📡 API Documentation

The comprehensive API documentation is available in the `apis.md` file within the backend directory. It covers endpoints for:
- 🔐 Student Authentication
- 📊 Academic data retrieval (timetable, attendance, marks, CGPA, assignments, exams, makeup classes, pending assignments, leave slips, and placement drives)
- 🤝 Friend Management (sending/receiving friend requests and accessing friends’ academic details)
- 🔔 Notifications via Firebase Cloud Messaging
- 📸 Image Uploads to Cloudinary and ImageKit

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. 🍴 Fork the repository.
2. 🌿 Create a new branch (e.g., `feature-xyz`).
3. 💾 Commit your changes (e.g., `git commit -m 'Add new feature'`).
4. 📤 Push to your branch (e.g., `git push origin feature-xyz`).
5. 🔄 Open a **Pull Request**.

Please adhere to our coding guidelines, include tests where applicable, and update documentation as needed.

---

## 🚧 Future Enhancements

We’re actively expanding Find My Verto with new features and improvements. Follow our repository and contribute your ideas to help shape the future of this platform!

---

## 📜 License

This project is licensed under the **MIT License**. See the `LICENSE` file for details.

---

## 📧 Contact

For any inquiries or feedback, please reach out at [aryanpnd3@gmail.com](mailto:aryanpnd3@gmail.com).
