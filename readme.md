<p align="center">
  <img src="logo.png" style="border-radius:2rem" alt="Find My Verto Logo" width="200">  
</p>

<h1 align='center' style="font-size:3rem">Find My Verto</h1>
<h3 align='center'>Your Open-Source LPU Companion 🚀</h3>


<p align="center">
<a href="https://github.com/aryanpnd"><img title="Author" src="https://img.shields.io/badge/Author-aryan-green.svg?style=for-the-badge&logo=github"></a>
</p>


<p align="center">
<a href="https://github.com/aryanpnd/findMyVerto/stargazers/"><img title="Stars" src="https://img.shields.io/github/stars/aryanpnd/findMyVerto?color=yellow&style=flat-square"></a>
<a href="https://github.com/aryanpnd/findMyVerto/network/members"><img title="Forks" src="https://img.shields.io/github/forks/aryanpnd/findMyVerto?color=lightgrey&style=flat-square"></a>
<a href="https://github.com/aryanpnd/findMyVerto/issues"><img title="issues" src="https://img.shields.io/github/issues/aryanpnd/findMyVerto">
</a>
</p>

Find My Verto is an open-source platform built for LPU students to seamlessly manage and view their academic information.  Access your timetable 📅, attendance 📊, CGPA, marks, exam schedules, assignments, friend information 👥, and much more, all in one convenient place!

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
- [📜 License](#-license)
- [📧 Contact](#-contact)

---

## ✨ Features

- 🔑 **Secure Authentication:**  Login securely using your LPU UMS credentials. 🔒
- 👤 **Student Profile:** View and manage your complete academic profile.  🎓
- 🕒 **Timetable Management:**  Access and organize your class schedule with ease. 🗓️
- 📊 **Attendance Tracking:** Monitor your attendance records in real-time.  📈
- 💯 **Marks & CGPA Retrieval:** Check your grades and calculate your CGPA.  📊
- 🧑‍🤝‍🧑 **Friend Connection:** Search, add, and manage your friends within the LPU community.  🤝
- 🔄 **Automatic Data Sync:** Stay up-to-date with seamless synchronization with the LPU UMS. 🔄
- 📨 **Friend Requests:** Send and manage friend requests.  💌
- 📝 **Profile Customization:** Personalize your profile information.  ✍️
- 🔔 **Real-time Notifications:** Receive important updates and alerts.  📢
- 🚀 **Over-the-Air Updates:** Enjoy the latest features and improvements without manual updates. 📲
- ⚙️ **Open Source:**  Contribute to the project and help make it even better!  💻
- 🎨 **User-Friendly Interface:**  Intuitive and easy-to-navigate design.  🤩


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

The backend server runs at `http://localhost:3000`. You can test API endpoints using tools like **Postman** 📬 or **cURL** 🔄.

---

## 📡 API Documentation

The API documentation is available in the `apis.md` file within the backend directory. This includes details on:
- 🔐 Authentication
- 📊 Student data retrieval
- 🕒 Timetable & attendance APIs
- 🤝 Friend management endpoints

---

## 🤝 Contributing

🎉 Contributions are welcome! Follow these steps:

1. 🍴 Fork the repository.
2. 🌿 Create a new branch (`feature-xyz`).
3. 💾 Commit your changes (`git commit -m 'Add new feature'`).
4. 📤 Push to your branch (`git push origin feature-xyz`).
5. 🔄 Open a **Pull Request**.

---

## 📜 License

This project is licensed under the **MIT License** 📄. See the `LICENSE` file for details.

---

## 📧 Contact

For any inquiries, reach out to ✉️ [aryanpnd3@gmail.com](mailto:aryanpnd3@gmail.com).

