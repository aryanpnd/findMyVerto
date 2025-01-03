# Find My Verto (app)

Find My Verto is a platform designed for LPU students to manage and view their details, timetable, attendance, and friends' information. It scrapes data from the LPU UMS (University Management System) portal (this happens on the server side, don't relate this with the app, this is where the API is coming from) and provides various features to enhance the student experience.

## Features

- **Login to LPU UMS**: Securely log in to the LPU UMS portal.
- **Retrieve student information**: Fetch and display detailed student information.
- **Retrieve student timetable**: Access and view the student's timetable.
- **Retrieve student attendance**: Get and display attendance records.
- **Search for other students**: Search for other students by name, section, or registration number.
- **Manage friends and view their details**: Add, remove, and view details of friends.
- **Sync data**: Sync data with the UMS server to ensure up-to-date information.
- **View friend requests**: Manage incoming and outgoing friend requests.
- **View friend's timetable and attendance**: Access the timetable and attendance of friends.
- **Profile management**: Manage and update student profiles.
- **Notifications**: Receive notifications for various events and updates.

## Project Structure

```
.expo/
	devices.json
	README.md
.gitignore
App.js
app.json
assets/
AuthPage.jsx
babel.config.js
context/
	Auth.js
	MainApp.js
eas.json
forDeveloper.md
package.json
readme.md
src/
	components/
		attendance/
		friendProfile/
		home/
		miscellaneous/
		...
	constants/
		...
	screens/
```

## Getting Started

### Prerequisites

- Node.js
- npm or yarn
- Expo CLI

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/aryanpnd/findMyVerto/tree/main/app/findmyverto
    ```
    ```sh
    cd find-my-verto
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

## Usage

1. Open the Expo Go app on your mobile device.
2. Scan the QR code displayed in the terminal or browser.
3. The app will load on your device.

## Contributing

Contributions are welcome! Please read the contributing guidelines first.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For any inquiries, please contact [aryanpnd3@gmail.com](aryanpnd3@gmail.com).

---

This README provides an overview of the project, its features, and instructions for getting started. Feel free to add more details as needed.