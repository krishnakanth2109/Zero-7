ZERO-7 PROJECT - MERN STACK APPLICATION
=====================================

Project Name:
-------------
Zero-7

GitHub Repository:
------------------
https://github.com/krishnakanth2109/Zero-7 (feature-branch)


PROJECT DESCRIPTION
-------------------
Zero-7 is a full-stack web application built using the **MERN stack** 
(MongoDB, Express.js, React.js, Node.js). The project contains a 
client (React) and backend (Express/Node) setup to provide a modern 
responsive user interface and REST API backend.

FEATURES
--------
• User authentication (Login/Signup)  
• Dynamic frontend UI using React  
• RESTful API backend with Express  
• MongoDB for database (Atlas recommended)  
• Environment configuration support  
• Modular folder structure (client & backend)  

TECHNOLOGY STACK
----------------
Frontend:
- React.js
- HTML5
- CSS3
- JavaScript

Backend:
- Node.js
- Express.js

Database:
- MongoDB (Atlas recommended)

Other:
- Git & GitHub version control
- Vercel / Render / Heroku (for deployment)

REPOSITORY STRUCTURE
--------------------
Zero-7
|
|-- backend       (Backend API + server code)
|-- client        (React frontend application)
|-- .gitignore
|-- vercel.json
|-- package-lock.json
|-- .DS_Store

PREREQUISITES
-------------
Make sure the following are installed before running locally:

• Node.js  
• npm (Node Package Manager)  
• Git

INSTALLATION STEPS
------------------
1. Clone the repository:
   git clone https://github.com/krishnakanth2109/Zero-7.git

2. Change directory:
   cd Zero-7

BACKEND SETUP
-------------
1. Navigate to backend folder:
   cd backend

2. Install dependencies:
   npm install

3. Create a .env file with required environment variables:
   PORT=5000
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret

4. Start server:
   npm run dev

This will start the backend at:
http://localhost:5000

FRONTEND SETUP
--------------
1. Navigate to client folder:
   cd ../client

2. Install frontend dependencies:
   npm install

3. Start React app:
   npm start

This will open frontend at:
http://localhost:3000

ENVIRONMENT VARIABLES
---------------------
Create a .env file in the backend/server folder with:

PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key

DATABASE
--------
This project uses MongoDB for data storage. You can use
MongoDB Atlas cloud instance or a local MongoDB server.

CONTACT DETAILS
---------------
Project Maintainer:  
Email: zero7technologies@gmail.com

CONTRIBUTION
------------
Contributions are welcome! To contribute:

1. Fork this repository.
2. Create a new feature branch.
3. Make your changes and commit.
4. Push branch and open a Pull Request.

SECURITY NOTE
-------------
Do not commit your .env files or sensitive data to GitHub.
Use environment variables for all secrets.

LICENSE
-------
This project is open source and free to use for learning and development.

=====================================
END OF README
=====================================
