# Find My Verto (backend)

Find My Verto is a platform designed for LPU students to manage and view their details, timetable, attendance, and friends' information. It scrapes data from the LPU UMS (University Management System) portal and provides various features to enhance the student experience.

## Features

- Login to LPU UMS
- Retrieve student information
- Retrieve student timetable
- Retrieve student attendance
- Search for other students
- Manage friends and view their details

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/aryanpnd/findMyVerto/tree/main/backend/javascript
    ```
2. Navigate to the project directory

3. Install the dependencies:
    ```sh
    npm install
    ```

## Usage

1. Create a `.env` file in the root directory and add your LPU UMS credentials:
    ```env
    USERNAME=your_username
    PASSWORD=your_password
    ```

2. Run the project:
    ```sh
    node scrapper.js
    ```

## Example

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

## Methods

### 

init()


Initializes the Puppeteer browser instance.

### 

login()


Logs in to the LPU UMS portal using the provided credentials.

### 

get_user_info()


Retrieves the student's information from the LPU UMS portal.

### 

get_time_table()


Retrieves the student's timetable from the LPU UMS portal.

### 

get_user_attendance()


Retrieves the student's attendance from the LPU UMS portal.

### 

close()


Closes the Puppeteer browser instance.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes.

## Contact

For any inquiries, please contact [aryanpnd3@gmail.com](mailto:aryanpnd3@gmail.com).