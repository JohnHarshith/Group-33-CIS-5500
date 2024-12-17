# PennDash – Restaurant Review Website

![PennDash](PennDash.Preview.png)

Demo Video -  https://drive.google.com/file/d/1CA39Xxb1Jif8d1ybGm8vc2RhRBgaQNo_/view?usp=sharing 

# Motivation :
The motivation behind PennDash Project stems from the growing demand for accessible, personalized dining recommendations, as highlighted by recent trends in the restaurant industry. With 94% of diners researching restaurants online before visiting and 79% preferring customized suggestions, there’s a clear need for platforms that provide tailored dining information and intuitive user experiences (Zippia; Restaurant Dive). PennDash meets this need by offering a Pennsylvania-specific platform that allows users to explore and save their favorite dining spots, filter based on key preferences like cuisine, location, and rating, and discover trending restaurants through Yelp’s extensive dataset. The platform’s Google Maps integration ensures easy navigation, while secure login provides a personalized and reliable user experience. By connecting locals and visitors to their ideal dining options, PennDash enhances the way people discover and engage with Pennsylvania’s vibrant culinary scene, offering an impactful, timely solution rooted in real-world demand and industry insights.

# Project Description :
The goal of this project is to develop PennDash, a user-friendly restaurant review platform focusing on the state of Pennsylvania. The website will enable users to explore restaurants based on various filters, such as type of cuisine, location, ratings, or name, and can favorite or bookmark restaurants based on individual preferences. The platform will incorporate key functionalities like: Detailed restaurant reviews and ratings along with their business information (e.g., Wi-Fi availability, outdoor seating, vehicle parking, etc.), location mapping via Google Maps integration, users can save their favorite restaurants or bookmark, and refer them later on, secure login/logout functionality for an optimized user experience, trending restaurant analytics based on Pennsylvania and user feedback trends from Yelp’s public dataset will be shown to the user.

# System Architecture :
![Architecture](SystemArch.png)

Folder structure is as follows -
```
.
├── penndash_app                 # Main application folder
│   ├── node_modules             # Dependencies installed via npm
│   ├── public                   # Static resources
│   │   ├── images               # Images used in the application
│   │       ├── cuisines         # Cuisine-specific images
│   │       ├── default          # Default placeholder images
│   ├── src                      # Source code for the frontend
│   │   ├── components           # UI components grouped by functionality
│   │   │   ├── analytics        # Analytics page components
│   │   │   ├── bookmarks        # Bookmarks management components
│   │   │   ├── favorites        # Favorites management components
│   │   │   ├── home             # Homepage components
│   │   │   ├── loginregister    # Login and registration components
│   │   │   ├── logout           # Logout components
│   │   │   ├── restaurantpage   # Restaurant details page components
│   │   ├── .env                 # Environment variables for the frontend
│   │   ├── App.css              # Global styles for the app
│   │   ├── App.js               # Main React component
│   │   ├── index.css            # Entry-point styles
│   │   ├── index.js             # Entry-point script
│   ├── README.md                # Documentation for the frontend
│   ├── generate-react-cli.json  # Configuration for React CLI
│   ├── package-lock.json        # Dependency tree for the frontend
│   ├── package.json             # Project metadata for the frontend
├── server                       # Backend server
│   ├── __tests__                # Unit tests for the backend
│   │   ├── results.json         # Test results
│   │   ├── tests.js             # Test cases
│   ├── config.json              # Server configuration
│   ├── constants.js             # Backend constants
│   ├── package-lock.json        # Dependency tree for the backend
│   ├── package.json             # Project metadata for the backend
│   ├── routes.js                # API route handlers
│   ├── server.js                # Entry-point script for the backend
├── .gitignore                   # Git ignore file
├── README.md                    # Documentation for the project
├── package-lock.json            # Root dependency tree
├── package.json                 # Root project metadata
```

# Dataset : 
https://www.yelp.com/dataset

# Instructions :

## Prerequisites

Before proceeding, ensure the following are installed on your system:

1. **Node.js and npm**: Download and install the latest version of [Node.js](https://nodejs.org/). npm comes bundled with Node.js.
2. **Git**: [Install Git](https://git-scm.com/downloads) to clone the repository if you choose that option.
3. **An IDE or text editor**: [Visual Studio Code](https://code.visualstudio.com/) is recommended.
4. **Web Browser**: A modern browser like Google Chrome is required for the best experience.

## Connect to the PostgreSQL Database

1. Connect to the PostgreSQL database hosted on AWS using the credentials provided in the **Final Report (pages 3-4)**.
2. Use a tool like **DataGrip** or any PostgreSQL-compatible client to establish the connection.
3. Once connected, ensure the database is accessible and properly configured before proceeding.

Now follow the steps below to set up and run the project.

## Instructions to Run Locally

### 1. Clone or Download the Repository

#### Option 1: Clone the Repository
1. Open a terminal and navigate to your desired directory.
2. Run the following command to clone the repository:
   ```bash
   git clone <repository-url>
   ```
   Replace `<repository-url>` with the actual GitHub or source control URL of the project.

#### Option 2: Download the ZIP File
1. Navigate to the project repository on GitHub.
2. Click the green "Code" button and select **Download ZIP**.
3. Extract the contents of the ZIP file to your desired directory.

### 2. Open the Project

1. Open the extracted folder or cloned repository in an IDE like Visual Studio Code.
2. Alternatively, navigate to the folder using a terminal.

### 3. Set Up and Run the Server

1. **Navigate to the `server` folder**:
   ```bash
   cd server
   ```
2. **Install Dependencies**:
   Run the following command to install the necessary Node.js packages:
   ```bash
   npm install
   ```
3. **Start the Server**:
   Launch the server by running:
   ```bash
   npm start
   ```
4. You should see a message in the terminal indicating that the server is running.

### 4. Set Up and Start the Client

1. **Open a new terminal shell**:
   If using zsh, open a new zsh shell. Otherwise, open another terminal or command prompt window.
2. **Navigate to the `penndash_app` folder**:
   ```bash
   cd penndash_app
   ```
3. **Install Dependencies**:
   Run the following command to install the necessary Node.js packages for the client:
   ```bash
   npm install
   ```
4. **Start the Application**:
   Launch the application by running:
   ```bash
   npm start
   ```
5. Once the application starts, your default web browser (e.g., Google Chrome) will automatically open with the website. If it doesn’t, visit the URL provided in the terminal output, typically `http://localhost:3000`.

## Notes and Troubleshooting

- Ensure the server is running before starting the client.
- If you encounter any errors during `npm install`, make sure your Node.js and npm versions are up to date.
- Use the following commands if you face issues:
  - To clear npm cache:
    ```bash
    npm cache clean --force
    ```
  - To reinstall all dependencies:
    ```bash
    rm -rf node_modules
    npm install
    ```
- If the application doesn't automatically open in the browser, navigate to the provided URL (usually `http://localhost:3000`) manually.

## Closing the Project

To stop the server or client, press `Ctrl + C` in the respective terminal window.
