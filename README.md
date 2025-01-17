QR Code Scanner - Frontend

This is the frontend application for the QR Code Scanner project. It is a React-based web application designed to scan and process QR codes.

Requirements

Before you get started, make sure you have the following installed on your machine:
1.	Node.js (version >= 16.x)
•	Download and install it from Node.js Official Website.
2.	npm (Node Package Manager) or yarn (comes with Node.js installation)
•	Alternatively, install yarn.
3.	Git (for version control)
•	Install Git if not already installed.

Installation

Follow the steps below to install and run the project in production:

1. Clone the Repository
   ```
   git clone https://github.com/alfaizuna/qr-code-scanner.git
   cd qr-code-scanner
   ```
2. Install Dependencies

Install all required dependencies using npm or yarn:
```bash
npm install
```

3. Set Up Environment Variables

Create a .env file in the root directory (if not already present) and configure the required environment variables. Below is an example .env template:
```
REACT_APP_API_URL=https://your-api-url.com
REACT_APP_ENV=production
```

4. Build the Project

Generate the production build of the application:
```bash
npm run build
```

5. Serve the Application

To serve the app in production, use a static file server like serve:
```bash
npm install -g serve
serve -s build
```


