# My React App Project 2025

A modern React application built with TypeScript, Tailwind CSS, and best practices.

## 🚀 Features

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Redux Toolkit** for state management
- **React Router** for navigation
- **Axios** for API calls
- **Custom Hooks** for reusable logic
- **Component-based architecture**
- **Responsive design**
- **Dark/Light theme support**

## 📁 Project Structure

```
my-react-app-project-2025/
├── public/                    # Static files (favicon, index.html, manifest.json)
├── src/                       # Main source code
│   ├── assets/                # Images, fonts, icons, CSS, SCSS...
│   ├── components/            # Common components
│   │   ├── ui/                # Common UI components (Button, Modal, Input)
│   │   ├── layout/            # Layouts like Navbar, Sidebar, Footer
│   │   ├── hooks/             # Custom hooks (useAuth, useTheme...)
│   │   └── utils/             # Utility functions (formatDate, debounce...)
│   └── pages/                 # Pages (Home, About, Dashboard...)
│       ├── Home/              # Each page has its own directory
│       ├── About/
│       └── Dashboard/
├── store/                     # State management (Redux, Zustand...)
│   └── slices/                # Redux slices (authSlice, userSlice)
├── routes/                    # Router configuration
│   ├── privateRoutes.ts       # Routes requiring login
│   ├── publicRoutes.ts        # Routes not requiring login
│   └── index.tsx              # Main App Router
├── services/                  # API services (Axios, Fetch)
│   ├── authService.ts         # Authentication service
│   └── userService.ts         # User service
├── config/                    # General configuration (axios, env, theme...)
│   ├── axios.ts               # Axios configuration
│   ├── env.ts                 # Load environment variables
│   └── theme.ts               # Dark/Light Theme config
├── types/                     # Contains TypeScript types
│   ├── user.ts                # User data type definition
│   └── auth.ts                # Auth data type definition
├── App.tsx                    # Root component of the application
├── main.tsx                   # Entry point of the application
├── .env                       # Environment variables
├── tsconfig.json              # TypeScript configuration
├── tailwind.config.js         # Tailwind CSS configuration
├── package.json               # List of dependencies
├── vite.config.ts             # Vite configuration
└── README.md                  # Project documentation
```

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd my-react-app-project-2025
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
# API Configuration
REACT_APP_API_URL=https://bds-be-g9xi.onrender.com/api
REACT_APP_API_TIMEOUT=10000

# App Configuration
REACT_APP_NAME=My React App
REACT_APP_VERSION=1.0.0

# Feature Flags
REACT_APP_ENABLE_ANALYTICS=false
REACT_APP_ENABLE_DEBUG=true
```

4. Start the development server:
```bash
npm run dev
```

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## 🎨 Components

### UI Components
- **Button** - Reusable button component with variants
- **Input** - Form input component with validation
- **Modal** - Modal dialog component

### Layout Components
- **Navbar** - Main navigation bar
- **Sidebar** - Side navigation for dashboard
- **Footer** - Application footer

### Custom Hooks
- **useAuth** - Authentication state management
- **useTheme** - Theme switching functionality

## 🔧 Configuration

### Environment Variables
The application uses environment variables for configuration. See the `.env` file for available options.

### Theme Configuration
The application supports both light and dark themes. Theme configuration can be found in `config/theme.ts`.

### API Configuration
API configuration is handled in `config/axios.ts` with interceptors for authentication and error handling.

## 📱 Pages

- **Home** - Landing page with feature overview
- **About** - Information about the application and team
- **Dashboard** - Main dashboard with analytics and quick actions

## 🔐 Authentication

The application includes a complete authentication system with:
- Login/Register functionality
- JWT token management
- Protected routes
- Session management

## 🎯 State Management

Redux Toolkit is used for state management with slices for:
- Authentication state
- User management
- Application settings

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support, email support@example.com or create an issue in the repository.
