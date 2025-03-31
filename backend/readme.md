# FindMyVerto - Backend (API v1) Installation Guide

FindMyVerto Backend (API v1) is the updated server-side application that powers the FindMyVerto platform, providing APIs for accessing and managing data.

---

## 📌 Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

---

## 📥 Installation

### Prerequisites
Ensure you have the following installed:

- **Docker & Docker Compose** (Recommended for running the app)
- **Node.js & npm** (If running locally without Docker)
- **MongoDB** (If running locally, else Docker will handle it)

### Installation Steps (Using Docker)

1. **Clone the repository:**
   ```sh
   git clone https://github.com/aryanpnd/findMyVerto.git
   cd backend/api-v1
   ```

2. **Set up environment variables:**
   Create a `.env` file in the root directory and add the following:
   ```env
   MONGODB_URI=mongodb://mongo:27017/mydatabase
   PORT=3000
   
   CLOUDINARY_CLOUD_NAME=
   CLOUDINARY_API_KEY=
   CLOUDINARY_API_SECRET=
   
   GOOGLE_PROJECT_ID=
   GOOGLE_PRIVATE_KEY=
   GOOGLE_CLIENT_EMAIL=
   
   IMAGEKIT_PUBLIC_KEY=
   IMAGEKIT_PRIVATE_KEY=
   IMAGEKIT_URL_ENDPOINT=
   ```
   > If you want to use **Cloudinary** or **ImageKit**, create an account on their respective platforms and add the API keys and same for the **Firebase**. Leave them blank if you don't need these features.

3. **Start the application using Docker:**
   ```sh
   docker-compose up --build
   ```
   This will start the backend along with a MongoDB container.

### Alternative: Running Locally Without Docker
If you prefer to run the backend manually:

1. **Ensure MongoDB is running locally** (Default port `27017`).
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Start the server:**
   ```sh
   npm start
   ```

---

## 📜 Environment Variables

- `MONGODB_URI` - Connection string for MongoDB.
- `PORT` - Port on which the server runs.
- `CLOUDINARY_*` - Cloudinary API credentials (if using Cloudinary for image storage).
- `IMAGEKIT_*` - ImageKit API credentials (if using ImageKit for image storage).
- `GOOGLE_*` - Google service account credentials (if using Google-related features, for now `FCM`).

---

## 📖 API Documentation
Once the server is running, access the **API documentation** at:

🔗 [http://localhost:3000/api-docs/](http://localhost:3000/api-docs/)

This provides interactive API endpoints and details on request/response formats.

---

## 🤝 Contributing
We welcome contributions! Please open an issue or submit a pull request for any changes or improvements.

---

## 📜 License
This project is licensed under the MIT License. See the [LICENSE](https://github.com/aryanpnd/findMyVerto/blob/main/LICENSE) file for details.

