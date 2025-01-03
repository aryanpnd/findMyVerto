# Find My Verto

Find My Verto is a platform designed for LPU students to manage and view their details, timetable, attendance, and friends' information. It combines a backend service for scraping data from the LPU UMS (University Management System) portal and a React Native app for an enhanced student experience.

## Repository Structure

```
findMyVerto/
│
├── app/findmyverto        # React Native app for mobile users
├── backend/javascript     # Backend service for data scraping and API
└── .gitignore
```

---

## Features

### Backend
- Secure login to LPU UMS.
- Retrieve:
  - Student information.
  - Timetable and attendance.
- Search for other students.
- Manage friends and view their details.

### App
- Login and sync data with UMS via backend API.
- Retrieve and display:
  - Student information, timetable, and attendance.
- Manage:
  - Friend requests, profiles, and notifications.
- Access friend's timetable and attendance.

---

## Getting Started

### Prerequisites
- **Backend**: Node.js, npm.
- **App**: Node.js, npm/yarn, Expo CLI.

### Installation

#### Backend
1. Clone the backend repository:
    ```sh
    git clone https://github.com/aryanpnd/findMyVerto/tree/main/backend/javascript
    cd javascript
    ```
2. Install dependencies:
    ```sh
    npm install
    ```
3. Create a `.env` file in the root directory and add your LPU UMS credentials:
    ```env
    USERNAME=your_username
    PASSWORD=your_password
    ```
4. Start the backend:
    ```sh
    node scrapper.js
    ```

#### App
1. Clone the app repository:
    ```sh
    git clone https://github.com/aryanpnd/findMyVerto/tree/main/app/findmyverto
    cd findmyverto
    ```
2. Install dependencies:
    ```sh
    npm install --legacy-peer-deps
    ```
3. Start the development server:
    ```sh
    npm start
    # or
    yarn start
    ```

4. Open the Expo Go app on your mobile device and scan the QR code displayed in the terminal or browser to load the app.

---

## Usage

### Backend Example
```javascript
const UmsScrapper = require('./middlewares/scrapper');

(async () => {
    try {
        const umsScrapper = new UmsScrapper("your_username", "your_password", false);
        await umsScrapper.init();
        await umsScrapper.login();
        const studentDetails = await umsScrapper.get_user_info();
        console.log(studentDetails);
        const timeTable = await umsScrapper.get_time_table();
        console.log(timeTable);
        const attendance = await umsScrapper.get_user_attendance();
        console.log(attendance);
        umsScrapper.close();
    } catch (error) {
        console.error(error);
    }
})();
```

### App
1. Start the backend service.
2. Use the app to log in and sync data with the backend.

---

## Project Structure

### Backend
```
backend/javascript/
├── middlewares/          # Puppeteer scrapers and utilities
├── scrapper.js           # Entry point for the backend service
└── package.json          # Dependencies and scripts
```

### App
```
app/findmyverto/
├── src/                  # Source files
│   ├── components/       # UI components
│   ├── screens/          # App screens
│   └── constants/        # Constants and configurations
├── App.js                # Entry point
├── assets/               # Static assets
├── context/              # Context providers
├── package.json          # Dependencies and scripts
└── app.json              # Expo configuration
```

---

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes.

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.

---

## Contact

For any inquiries, please contact [aryanpnd3@gmail.com](mailto:aryanpnd3@gmail.com).

--- 

Feel free to share any additional details or tweaks you'd like to incorporate!