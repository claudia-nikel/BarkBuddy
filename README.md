# BarkBuddy

BarkBuddy is a personal dog dictionary application that allows users to add pictures and basic information about dogs they meet at the dog park. Each dog gets a unique identifier that can be shared with others.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the App](#running-the-app)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)
- [Version](#version)

## Features

- Add and store pictures and information about dogs
- Unique identifiers for each dog
- User-friendly interface
- Responsive design

## Getting Started

### Prerequisites

To run this project, you will need to have the following installed on your machine:

- Node.js (version 16.x recommended)
- npm (Node package manager)
- AWS account for S3 and RDS (if deploying the backend)

### Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/claudia-nikel/BarkBuddy.git
    cd BarkBuddy
    ```

2. Install the dependencies for both the frontend and backend:

    ```sh
    cd client
    npm install
    cd ../server
    npm install
    ```

### Running the App

1. Set up the environment variables as described in the [Environment Variables](#environment-variables) section.
2. Start the backend server:

    ```sh
    cd server
    npm run dev
    ```

3. Start the frontend development server:

    ```sh
    cd client
    npm run dev
    ```

4. Open your browser and navigate to `http://localhost:3000` to see the app in action.

## Environment Variables

Create a `.env` file in the `server` directory with the following environment variables:
```
DB_HOST=<your-database-host>
DB_USER=<your-database-user>
DB_PASS=<your-database-password>
DB_NAME=<your-database-name>
AWS_ACCESS_KEY_ID=<your-aws-access-key-id>
AWS_SECRET_ACCESS_KEY=<your-aws-secret-access-key>
AWS_REGION=<your-aws-region>
S3_BUCKET_NAME=<your-s3-bucket-name>
```


Create a `.env` file in the `client` directory with the following environment variables:
`REACT_APP_API_URL=<your-backend-api-url>`



## Deployment

### Backend

The backend is deployed using AWS Elastic Beanstalk. Follow the official AWS Elastic Beanstalk documentation to deploy the backend server.

### Frontend

The frontend is deployed using Netlify. Follow the official Netlify documentation to deploy the React app.

## Technologies Used

- **Frontend:** React, Axios, Material-UI
- **Backend:** Node.js, Express, PostgreSQL, Sequelize
- **Storage:** AWS S3 for storing images
- **Database:** AWS RDS PostgreSQL

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Versions

# V1
Release Date: July 6, 2024
- [x] Add & Delete Dogs
- [x] Edit Dog details
- [x] Add & Edit dog image
- [x] Display total count of dogs

# V2
Release Date: August 11, 2024
- [X] Add login (authorization & authentication)
- [X] Minor UI changes
- [X] Add Landing Page

# V3 (Current)
Release Date: August 13, 2024
- [X] Redo UI 

# V4
- [ ] Add page for your own dog with unique id
- [ ] Add ability to add other dogs by their unique id

# V5
- [ ] Add more details to Dog Detail page
