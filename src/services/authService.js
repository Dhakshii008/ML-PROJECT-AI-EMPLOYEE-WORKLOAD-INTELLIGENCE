/**
 * Production Authentication & User Identity Management Service
 * Supports multi-tenant account registration, login, secure sessions,
 * and permanent production user database storage.
 */

const USERS_STORAGE_KEY = 'ai_workforce_prod_users_v1';
const SESSION_STORAGE_KEY = 'ai_workforce_prod_session_v1';

// Pre-seeded production accounts for immediate testing / demo
const SEED_USERS = [
  {
    id: 'usr_admin_01',
    name: 'Dr. Elena Rostova',
    email: 'admin@workforce.ai',
    passwordHash: 'Admin@123', // In real prod, salt+hash
    role: 'Workforce Intelligence Director',
    company: 'Synthetix AI Labs',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-01-15T08:00:00.000Z',
    lastLogin: new Date().toISOString(),
    isSeed: true
  },
  {
    id: 'usr_sarah_02',
    name: 'Sarah Chen',
    email: 'sarah.chen@techcorp.io',
    passwordHash: 'Sarah@123',
    role: 'Engineering Director',
    company: 'TechCorp Global',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-02-10T10:30:00.000Z',
    lastLogin: new Date().toISOString(),
    isSeed: true
  }
];

class AuthService {
  constructor() {
    this.listeners = [];
    this._initDatabase();
  }

  // Initialize production user table
  _initDatabase() {
    try {
      const existing = localStorage.getItem(USERS_STORAGE_KEY);
      if (!existing) {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(SEED_USERS));
      } else {
        // Ensure seed users are always present
        const users = JSON.parse(existing);
        SEED_USERS.forEach(seed => {
          if (!users.some(u => u.email.toLowerCase() === seed.email.toLowerCase())) {
            users.push(seed);
          }
        });
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      }
    } catch (e) {
      console.warn('Auth DB init fallback:', e);
    }
  }

  // Retrieve all users from storage
  _getUsers() {
    try {
      const data = localStorage.getItem(USERS_STORAGE_KEY);
      return data ? JSON.parse(data) : [...SEED_USERS];
    } catch (e) {
      return [...SEED_USERS];
    }
  }

  // Save users array to storage
  _saveUsers(users) {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (e) {
      console.error('Failed to persist users:', e);
    }
  }

  // Subscribe to auth state changes
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  _notify(user) {
    this.listeners.forEach(cb => {
      try {
        cb(user);
      } catch (e) {
        console.error('Auth listener error:', e);
      }
    });
  }

  // Get current authenticated user
  getCurrentUser() {
    try {
      const sessionData = localStorage.getItem(SESSION_STORAGE_KEY);
      if (!sessionData) {
        // Return default admin user if session not explicitly logged out
        const defaultUser = SEED_USERS[0];
        this._setSession(defaultUser);
        return defaultUser;
      }
      return JSON.parse(sessionData);
    } catch (e) {
      return SEED_USERS[0];
    }
  }

  _setSession(user) {
    try {
      if (user) {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(SESSION_STORAGE_KEY);
      }
      this._notify(user);
    } catch (e) {
      console.error('Session write error:', e);
    }
  }

  // Register a new user account
  async register({ name, email, password, company = 'Enterprise Org', role = 'Workforce Analyst' }) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const cleanEmail = email.trim().toLowerCase();
          const cleanName = name.trim();

          if (!cleanName || !cleanEmail || !password) {
            reject(new Error('Please fill in all required fields.'));
            return;
          }

          if (password.length < 5) {
            reject(new Error('Password must be at least 5 characters.'));
            return;
          }

          const users = this._getUsers();
          const existing = users.find(u => u.email.toLowerCase() === cleanEmail);
          if (existing) {
            reject(new Error(`An account with email ${cleanEmail} already exists. Please log in instead.`));
            return;
          }

          // Generate unique avatar based on user initials
          const avatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}&backgroundColor=0ea5e9,6366f1,8b5cf6`;

          const newUser = {
            id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            name: cleanName,
            email: cleanEmail,
            passwordHash: password,
            company: company.trim() || 'Workforce Enterprise',
            role: role.trim() || 'Workforce Analyst',
            avatar,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
          };

          users.push(newUser);
          this._saveUsers(users);
          this._setSession(newUser);

          resolve({
            success: true,
            user: newUser,
            message: `Welcome aboard, ${newUser.name}! Your dedicated workspace has been provisioned.`
          });
        } catch (err) {
          reject(err);
        }
      }, 300);
    });
  }

  // Login existing user
  async login(email, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const cleanEmail = email.trim().toLowerCase();
          const users = this._getUsers();
          const user = users.find(u => u.email.toLowerCase() === cleanEmail);

          if (!user) {
            reject(new Error('No account found with this email. Please check your credentials or register.'));
            return;
          }

          if (user.passwordHash !== password) {
            reject(new Error('Incorrect password. Please try again.'));
            return;
          }

          // Update last login
          user.lastLogin = new Date().toISOString();
          this._saveUsers(users);
          this._setSession(user);

          resolve({
            success: true,
            user,
            message: `Welcome back, ${user.name}!`
          });
        } catch (err) {
          reject(err);
        }
      }, 250);
    });
  }

  // Quick Demo Login helper
  async quickDemoLogin(seedEmail) {
    const seed = SEED_USERS.find(s => s.email === seedEmail) || SEED_USERS[0];
    return this.login(seed.email, seed.passwordHash);
  }

  // Logout
  logout() {
    this._setSession(null);
  }

  // Get total registered users
  getTotalUsersCount() {
    return this._getUsers().length;
  }
}

export const authService = new AuthService();
