# SmartRecruit Frontend

A modern Vue 3 frontend application for the SmartRecruit recruitment platform, featuring comprehensive authentication, role-based access control (RBAC), audit trails, and user profile management.

## Features

### 🔐 Authentication & Security
- JWT-based authentication with automatic token refresh
- Two-factor authentication (2FA) with QR code setup
- Secure password policies and validation
- Session management with automatic logout

### 👥 Role-Based Access Control (RBAC)
- Hierarchical role system (Admin, Manager, Recruiter, Candidate)
- Granular permissions for different resources
- UI-level permission directives
- Route guards for protected pages

### 📊 Audit Trail
- Comprehensive logging of all user actions
- Advanced search and filtering capabilities
- Real-time audit log viewer
- Export functionality for compliance

### 👤 User Profile Management
- Complete user profile CRUD operations
- Avatar upload with image validation
- Profile settings and preferences
- Admin user management interface

## Tech Stack

- **Framework**: Vue 3 (Composition API)
- **Build Tool**: Vite
- **State Management**: Pinia
- **Routing**: Vue Router 4
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS
- **Icons**: Heroicons
- **Validation**: VeeValidate + Yup
- **Notifications**: Custom toast system

## Project Structure

```
src/
├── components/          # Reusable Vue components
│   ├── auth/           # Authentication components
│   ├── common/         # Common UI components
│   └── ...
├── composables/        # Vue composables for logic reuse
├── config/            # Configuration files
├── directives/        # Vue directives
├── layouts/           # Layout components
├── pages/             # Page components
├── router/            # Vue Router configuration
├── services/          # API service layer
├── stores/            # Pinia stores
├── types/             # TypeScript type definitions
├── utils/             # Utility functions
├── validators/        # Validation schemas
└── views/             # Main view components
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running on port 3000

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smartrecruit/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```

   Configure the following variables in `.env`:
   ```env
   VITE_API_BASE_URL=http://localhost:3000/api
   VITE_APP_NAME=SmartRecruit
   VITE_APP_VERSION=1.0.0
   ```

4. **Development Server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## API Integration

The frontend communicates with the backend API through a structured service layer:

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Token refresh
- `POST /api/auth/logout` - User logout
- `POST /api/auth/2fa/setup` - 2FA setup
- `POST /api/auth/2fa/verify` - 2FA verification

### User Management Endpoints
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/avatar` - Upload avatar
- `GET /api/users` - List users (Admin only)
- `PUT /api/users/:id` - Update user (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)

### Audit Trail Endpoints
- `GET /api/audit/logs` - Get audit logs
- `GET /api/audit/logs/:id` - Get specific audit log
- `POST /api/audit/logs/search` - Search audit logs

## Security Features

### Authentication Flow
1. User submits login credentials
2. Server validates credentials and returns JWT tokens
3. Client stores tokens securely in localStorage
4. Automatic token refresh before expiration
5. Optional 2FA verification for enhanced security

### Authorization
- **Route Guards**: Protect routes based on authentication and permissions
- **Component Directives**: Conditionally render UI elements
- **API Guards**: Backend validates permissions for each request
- **Role Hierarchy**: Higher roles inherit lower role permissions

### Permissions System
```javascript
// Check permissions in components
v-if="$can('users.view')"

// Check permissions in composables
if (usePermissions().can('users.edit')) {
  // Allow action
}
```

## Development Guidelines

### Code Style
- Use Vue 3 Composition API
- Follow Vue.js style guide
- Use TypeScript for type safety (optional)
- Maintain consistent naming conventions

### State Management
- Use Pinia stores for global state
- Create composables for reusable logic
- Keep components focused on presentation

### API Communication
- Use Axios interceptors for authentication
- Handle errors consistently across the app
- Implement proper loading states

## Testing

```bash
# Run unit tests
npm run test

# Run E2E tests
npm run test:e2e

# Run linting
npm run lint
```

## Deployment

### Environment Variables for Production
```env
VITE_API_BASE_URL=https://api.smartrecruit.com/api
VITE_APP_NAME=SmartRecruit
VITE_APP_VERSION=1.0.0
VITE_DEV_MODE=false
```

### Build Optimization
- Code splitting for better performance
- Asset optimization and compression
- Service worker for caching (optional)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation for common solutions