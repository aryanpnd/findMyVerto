# FindMyVerto - App Installation Guide

FindMyVerto provides seamless access to timetables, attendance, grades, assignments, social connections, and more, all in one place.

---

## 📌 Table of Contents

- [Features](#features)
- [Upcoming Features](#upcoming-features)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

---

## 🚀 Features

- **📅 Timetables**: Access class schedules, makeup classes, ongoing sessions, and more.
- **✅ Attendance**: Track your attendance with search, filter, and sort features.
- **📊 Grades**: View your marks and CGPA.
- **📝 Assignments**: Manage and track your assignments efficiently.
- **💬 My Messages**: View UMS messages with advanced search, history, and pagination.
- **🎯 My Drives**: Stay updated with placement drives.
- **🔔 Notifications**: Get real-time notifications and reminders.
- **👥 Social**: Connect and collaborate with friends and view their details.
- **⚙️ Settings**: Customize visibility, server configurations, auto-syncing, and more.

---

## 🔮 Upcoming Features

- **📢 Social Feed**: A Reddit-like feed exclusively for LPU students.
- **💬 User Chat**: A secure and optimized chat system for students.

---

## 📥 Installation

### Prerequisites

Ensure you have the following installed:

- Node.js
- npm or yarn
- Expo CLI
- Firebase project (for notifications)
- Expo updates (for OTA updates)

### Installation Steps

1. **Clone the repository:**

   ```sh
   git clone https://github.com/aryanpnd/findmyverto.git
   cd app/findmyverto
   ```

2. **Install dependencies:**

   ```sh
   npm install
   # or
   yarn install
   ```

   > If you face dependency errors, use:

   ```sh
   npm install --legacy-peer-deps
   ```

3. **Set up Firebase:**

   - Set up Firebase.
   - Retrieve your keystore using Expo CLI and upload it to Firebase.
   - Download `google-service-account-key.json` and `google-services.json` and place them in the root directory.

4. **Create a development build:**

   ```sh
   eas build --profile development --platform android
   # or
   eas build --profile preview --platform ios
   ```

5. **Start the development server:**

   ```sh
   npm start
   # or
   yarn start
   ```

---

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guidelines](https://github.com/aryanpnd/findmyverto/blob/main/CONTRIBUTING.md) for more details.

---

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/aryanpnd/findmyverto/blob/main/LICENSE) file for details.

