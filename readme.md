# Find My Verto

Find My Verto is a platform designed for LPU students to manage and view their details, timetable, attendance, and friends' information. It combines a backend service for scraping data from the LPU UMS (University Management System) portal and a React Native app for an enhanced student experience.

## Repository Structure

```
findMyVerto/
│
├── app/findmyverto        # React Native app for mobile users
├── backend/               
    └── api                # Backend service for API
    └── scrapper           # Backend service for data scraping
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
    git clone https://github.com/aryanpnd/findMyVerto/tree/main/backend/
    ```
    ```sh
    cd api
    ```
    or
    ```sh
    cd scrapper
    ```
2. Install dependencies:
    ```sh
    npm install
    ```
3. Create a `.env` file in the root directory:
    
    for `api`
    ```env
    DBURL=_MONGO_DB_URL_
    PORT=_PORT_
    SECRETKEY=_JWT_SECRET_
    SCRAPPER_BASE_URL=_BASE_URL_OF_THE_SCRAPPER_
    ```
    for `scrapper`
    ```env
    PORT=_PORT_
    CLOUDINARY_CLOUD_NAME=_CLOUDINARY_CLOUD_NAME_
    CLOUDINARY_API_KEY=_CLOUDINARY_API_KEY_
    CLOUDINARY_API_SECRET=_CLOUDINARY_API_SECRET_
    ```
4. Start the backend:
    ```sh
    node server.js
    ```

#### App
1. Clone the app repository:
    ```sh
    git clone https://github.com/aryanpnd/findMyVerto/tree/main/app/findmyverto
    cd findmyverto
    ```
2. Install dependencies:
    ```sh
    npm install
    ```
3. Start the development server:
    ```sh
    npm start
    # or
    yarn start
    ```

4. Open the Expo Go app on your mobile device and scan the QR code displayed in the terminal or browser to load the app.

---

### App
1. Start the backend service.
2. Use the app to log in and sync data with the backend.

---

## Project Structure


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