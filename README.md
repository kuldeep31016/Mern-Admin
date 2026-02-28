# MERN Admin Panel

A full-stack admin panel application built with the MERN stack for managing agents and distributing contact lists using a round-robin algorithm.

## 📋 Project Overview

This admin panel allows administrators to:
- Securely login with JWT authentication
- Create, view, and delete agents
- Upload CSV/Excel files containing contact lists
- Automatically distribute contacts equally among agents using a round-robin algorithm
- View distributed contact lists for each agent

## ✨ Features

- **Admin Authentication**: Secure JWT-based login system
- **Agent Management**: Full CRUD operations for managing agents
- **File Upload**: Support for CSV, XLSX, and XLS file formats
- **Smart Distribution**: Automatic round-robin distribution algorithm ensures equal contact distribution
- **Real-time Dashboard**: View statistics for agents, lists, and total contacts
- **Professional UI**: Clean, corporate design with intuitive navigation
- **Form Validation**: Client-side and server-side validation for all inputs
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Responsive Design**: Works seamlessly on desktop devices

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **csv-parser** - CSV file parsing
- **xlsx** - Excel file parsing

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Redux Toolkit** - State management
- **React Router v6** - Client-side routing
- **Axios** - HTTP client
- **React Hook Form** - Form handling
- **React Hot Toast** - Toast notifications
- **Plain CSS** - Styling (no UI frameworks)

## 📦 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **MongoDB** (v5.0 or higher)
- **npm** or **yarn** package manager

## 🚀 Installation & Setup

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd mern-admin
```

### Step 2: Setup Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
PORT=5000
MONGO_URI=mongodb://localhost:27017/mern_admin
JWT_SECRET=supersecretjwtkey2024
JWT_EXPIRE=7d
EOF

# Seed the database with admin user
npm run seed

# Start the backend server
npm run dev
```

The backend server will start on **http://localhost:5000**

### Step 3: Setup Frontend

Open a new terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
VITE_API_URL=http://localhost:5000/api
EOF

# Start the frontend development server
npm run dev
```

The frontend will start on **http://localhost:5173**

## 🔑 Default Login Credentials

After running the seeder script, use these credentials to login:

```
Email: admin@admin.com
Password: Admin@123
```

## 📚 API Endpoints

### Authentication Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/login` | Admin login | No |
| GET | `/api/auth/me` | Get logged in user | Yes |

### Agent Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/agents` | Get all agents | Yes |
| POST | `/api/agents` | Create new agent | Yes |
| DELETE | `/api/agents/:id` | Delete agent | Yes |

### List Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/lists/upload` | Upload and distribute file | Yes |
| GET | `/api/lists` | Get all distributed lists | Yes |

## 📄 Sample CSV Format

Create a CSV file with the following columns:

```csv
FirstName,Phone,Notes
John Doe,+919876543210,Important client
Jane Smith,+919876543211,Follow up required
Bob Johnson,+919876543212,New lead
Alice Williams,+919876543213,VIP customer
Charlie Brown,+919876543214,Needs callback
```

**Note**: Column names are case-insensitive. The following variations are supported:
- FirstName, firstname, FIRSTNAME, first name
- Phone, phone, PHONE, phonenumber, mobile
- Notes, notes, NOTES, note

## 🔄 Distribution Algorithm

The application uses a **round-robin algorithm** to distribute contacts equally among agents:

**Example**: If you upload 26 contacts and have 5 agents:
- Agent 1: 6 contacts (indices 0, 5, 10, 15, 20, 25)
- Agent 2: 6 contacts (indices 1, 6, 11, 16, 21)
- Agent 3: 6 contacts (indices 2, 7, 12, 17, 22)
- Agent 4: 5 contacts (indices 3, 8, 13, 18, 23)
- Agent 5: 3 contacts (indices 4, 9, 14, 19, 24)

**How it works**:
1. Contacts are distributed sequentially
2. Contact at index `i` goes to agent at index `i % totalAgents`
3. This ensures the most balanced distribution possible
4. Each upload creates a fresh distribution (previous lists are cleared)

## 📁 Project Structure

```
mern-admin/
├── backend/
│   ├── config/
│   │   └── db.js                    # Database connection
│   ├── controllers/
│   │   ├── authController.js        # Authentication logic
│   │   ├── agentController.js       # Agent CRUD operations
│   │   └── listController.js        # File upload & distribution
│   ├── middleware/
│   │   ├── authMiddleware.js        # JWT verification
│   │   └── errorMiddleware.js       # Error handling
│   ├── models/
│   │   ├── User.js                  # Admin user model
│   │   ├── Agent.js                 # Agent model
│   │   └── DistributedList.js       # Distributed list model
│   ├── routes/
│   │   ├── authRoutes.js            # Auth endpoints
│   │   ├── agentRoutes.js           # Agent endpoints
│   │   └── listRoutes.js            # List endpoints
│   ├── uploads/                     # Temporary file storage
│   ├── .env                         # Environment variables
│   ├── server.js                    # Express server
│   ├── seeder.js                    # Database seeder
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── axios.js             # API client setup
    │   ├── components/
    │   │   ├── Sidebar.jsx/css      # Sidebar navigation
    │   │   ├── Navbar.jsx/css       # Top navbar
    │   │   ├── ProtectedRoute.jsx   # Auth route wrapper
    │   │   ├── StatCard.jsx/css     # Dashboard stat cards
    │   │   └── AgentModal.jsx/css   # Add agent modal
    │   ├── pages/
    │   │   ├── Login.jsx/css        # Login page
    │   │   ├── Dashboard.jsx/css    # Dashboard page
    │   │   ├── Agents.jsx/css       # Agents management
    │   │   └── Lists.jsx/css        # File upload & lists
    │   ├── store/
    │   │   ├── store.js             # Redux store
    │   │   └── slices/
    │   │       └── authSlice.js     # Auth state management
    │   ├── App.jsx                  # Main app component
    │   ├── main.jsx                 # App entry point
    │   └── index.css                # Global styles
    ├── .env                         # Environment variables
    ├── index.html                   # HTML template
    ├── vite.config.js               # Vite configuration
    └── package.json
```

## 🎨 Design System

The application uses a professional design system with the following CSS variables:

```css
--primary: #1a237e          /* Deep navy blue */
--primary-hover: #283593
--accent: #e53935           /* Bold red for actions */
--bg: #f4f6f9              /* Page background */
--card-bg: #ffffff         /* Card background */
--text-primary: #1c1c2e    /* Main text */
--text-secondary: #6b7280  /* Secondary text */
--success: #2e7d32         /* Success color */
--error: #c62828           /* Error color */
```

## 🧪 Testing the Application

1. **Login**: Use the default admin credentials
2. **Add Agents**: Navigate to Agents page and add some test agents
3. **Upload File**: Go to Lists page and upload a CSV file
4. **View Distribution**: Check how contacts are distributed among agents
5. **Delete Agent**: Test deleting an agent (associated lists will also be deleted)

## ⚠️ Important Notes

- **Fresh Distribution**: Each new file upload clears previous distributions
- **File Cleanup**: Uploaded files are automatically deleted after processing
- **Password Security**: All passwords are hashed using bcryptjs
- **Token Expiry**: JWT tokens expire after 7 days
- **File Size Limit**: Maximum upload size is 10MB
- **Supported Formats**: Only CSV, XLSX, and XLS files are accepted

## 🔧 Troubleshooting

### MongoDB Connection Error
```bash
# Make sure MongoDB is running
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # macOS
```

### Port Already in Use
```bash
# Backend (Port 5000)
lsof -ti:5000 | xargs kill -9

# Frontend (Port 5173)
lsof -ti:5173 | xargs kill -9
```

### Module Not Found Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

Built with ❤️ using the MERN stack

---

**Happy Coding! 🚀**
