# Endpoints
### Authentication Endpoints

#### `POST /api/auth/login`
- **Description**: Logs in a student and returns a JWT token.
- **Request Body**:
  ```json
  {
    "regNo": "string",
    "password": "string"
  }
  ```
- **Response**:
  - **Success**: 
    ```json
    {
      "status": true,
      "message": "Login success",
      "token": "string"
    }
    ```
  - **Failure**: 
    ```json
    {
      "status": false,
      "message": "Login failed"
    }
    ```

#### `POST /api/auth/signup`
- **Description**: Signs up a new student.
- **Request Body**:
  ```json
  {
    "regNo": "string",
    "password": "string"
  }
  ```
- **Response**:
  - **Success**: 
    ```json
    {
      "status": true,
      "message": "Account created successfully"
    }
    ```
  - **Failure**: 
    ```json
    {
      "status": false,
      "message": "Account already exists, please login"
    }
    ```

### Student Endpoints

#### `POST /api/student/getStudentInfo`
- **Description**: Retrieves student information.
- **Request Body**:
  ```json
  {
    "sync": "boolean",
    "password": "string"
  }
  ```
- **Response**:
  - **Success**: 
    ```json
    {
      "status": true,
      "message": "Info fetched",
      "data": "object"
    }
    ```
  - **Failure**: 
    ```json
    {
      "status": false,
      "message": "Student not found"
    }
    ```

#### `POST /api/student/searchStudents`
- **Description**: Searches for students based on a query.
- **Request Body**:
  ```json
  {
    "query": "string"
  }
  ```
- **Response**:
  - **Success**: 
    ```json
    [
      {
        "section": "string",
        "name": "string",
        "registrationNumber": "string",
        "photoURL": "string",
        "_id": "string"
      }
    ]
    ```
  - **Failure**: 
    ```json
    {
      "status": false,
      "message": "Some error occurred"
    }
    ```

#### `POST /api/student/getStudentTimeTable`
- **Description**: Retrieves the student's timetable.
- **Request Body**:
  ```json
  {
    "sync": "boolean",
    "password": "string"
  }
  ```
- **Response**:
  - **Success**: 
    ```json
    {
      "Monday": "object",
      "Tuesday": "object",
      "Wednesday": "object",
      "Thursday": "object",
      "Friday": "object",
      "Saturday": "object",
      "Sunday": "object"
    }
    ```
  - **Failure**: 
    ```json
    {
      "status": false,
      "message": "User doesn't exist in database, Signup first"
    }
    ```

#### `POST /api/student/getStudentAttendance`
- **Description**: Retrieves the student's attendance.
- **Request Body**:
  ```json
  {
    "sync": "boolean",
    "password": "string"
  }
  ```
- **Response**:
  - **Success**: 
    ```json
    {
      "attendanceHistory": "array",
      "lastSync": "date"
    }
    ```
  - **Failure**: 
    ```json
    {
      "status": false,
      "message": "User doesn't exist in database, Signup first"
    }
    ```

### Scrapping Endpoints

#### `POST /api/scrap/getStudentInfo`
- **Description**: Scrapes and retrieves student information.
- **Request Body**:
  ```json
  {
    "regNo": "string",
    "password": "string",
    "update": "boolean"
  }
  ```
- **Response**:
  - **Success**: 
    ```json
    {
      "name": "string",
      "registrationNumber": "string",
      "password": "string",
      "rollNo": "string",
      "term": "string",
      "section": "string",
      "group": "string",
      "program": "string"
    }
    ```
  - **Failure**: 
    ```json
    {
      "status": false,
      "message": "Some error occurred while logging into UMS"
    }
    ```

#### `POST /api/scrap/getStudentTimeTable`
- **Description**: Scrapes and retrieves the student's timetable.
- **Request Body**:
  ```json
  {
    "regNo": "string",
    "password": "string",
    "update": "boolean"
  }
  ```
- **Response**:
  - **Success**: 
    ```json
    {
      "Monday": "object",
      "Tuesday": "object",
      "Wednesday": "object",
      "Thursday": "object",
      "Friday": "object",
      "Saturday": "object",
      "Sunday": "object"
    }
    ```
  - **Failure**: 
    ```json
    {
      "status": false,
      "message": "Some error occurred while logging into UMS"
    }
    ```

### Friend Endpoints

#### `POST /api/student/getfriendData`
- **Description**: Retrieves data of a specific friend.
- **Request Body**:
  ```json
  {
    "studentId": "string"
  }
  ```
- **Response**:
  - **Success**: 
    ```json
    {
      "success": true,
      "studentInfo": "object",
      "timetable": "object",
      "attendance": "object"
    }
    ```
  - **Failure**: 
    ```json
    {
      "success": false,
      "msg": "Not friends"
    }
    ```

#### `POST /api/student/getfriendList`
- **Description**: Retrieves the list of friends.
- **Response**:
  - **Success**: 
    ```json
    {
      "friends": "array"
    }
    ```
  - **Failure**: 
    ```json
    {
      "status": false,
      "message": "User doesn't exist in database, Login first"
    }
    ```

#### `POST /api/student/getfriendRequests`
- **Description**: Retrieves the list of friend requests.
- **Response**:
  - **Success**: 
    ```json
    {
      "friendRequests": "array"
    }
    ```
  - **Failure**: 
    ```json
    {
      "status": false,
      "message": "User doesn't exist in database, Login first"
    }
    ```

#### `POST /api/student/getSentFriendRequests`
- **Description**: Retrieves the list of sent friend requests.
- **Response**:
  - **Success**: 
    ```json
    {
      "sentFriendRequests": "array"
    }
    ```
  - **Failure**: 
    ```json
    {
      "status": false,
      "message": "User doesn't exist in database, Login first"
    }
    ```

#### `POST /api/student/sendFriendRequest`
- **Description**: Sends a friend request to another student.
- **Request Body**:
  ```json
  {
    "studentId": "string"
  }
  ```
- **Response**:
  - **Success**: 
    ```json
    {
      "success": true,
      "msg": "Friend Request sent"
    }
    ```
  - **Failure**: 
    ```json
    {
      "success": false,
      "msg": "Error sending Friend request"
    }
    ```

#### `POST /api/student/addFriend`
- **Description**: Accepts a friend request from another student.
- **Request Body**:
  ```json
  {
    "studentId": "string"
  }
  ```
- **Response**:
  - **Success**: 
    ```json
    {
      "success": true,
      "msg": "Added to friend"
    }
    ```
  - **Failure**: 
    ```json
    {
      "success": false,
      "msg": "Error while Adding to the Friend"
    }
    ```

#### `POST /api/student/removeFriend`
- **Description**: Removes a friend from the friend list.
- **Request Body**:
  ```json
  {
    "studentId": "string"
  }
  ```
- **Response**:
  - **Success**: 
    ```json
    {
      "success": true,
      "msg": "Removed from your friends list"
    }
    ```
  - **Failure**: 
    ```json
    {
      "success": false,
      "msg": "Error while Removing from the Friends list"
    }
    ```

#### `POST /api/student/removeFromFriendRequest`
- **Description**: Removes a friend request from the received requests list.
- **Request Body**:
  ```json
  {
    "studentId": "string"
  }
  ```
- **Response**:
  - **Success**: 
    ```json
    {
      "success": true,
      "msg": "Removed from your friends request list"
    }
    ```
  - **Failure**: 
    ```json
    {
      "success": false,
      "msg": "Error while Removing from the Friends request list"
    }
    ```

