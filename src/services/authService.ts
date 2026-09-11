/**
 * TRINETRA - Prototype Authentication & Audit Service
 *
 * NOTE ON SECURITY ARCHITECTURE:
 * This is a client-side prototype authentication simulation representing
 * Role-Based Access Control (RBAC) for authorized demonstration users.
 * In a production deployment, this layer would interface with an authorized
 * government identity provider (e.g. Parichay / e-Pramaan / departmental SSO)
 * over mTLS with hardware security module (HSM) backed sessions.
 */

import { PrototypeUser, AuditLogEntry } from '../types';
import { DEMO_PROTOTYPE_USERS } from '../data/demoUsers';

const STORAGE_SESSION_KEY = 'trinetra_auth_session';
const STORAGE_AUDIT_KEY = 'trinetra_audit_logs';

/**
 * Computes SHA-256 hash of a string using Web Crypto API.
 */
export async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Initial audit trail entries
const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'AUD-2026-001',
    timestamp: '2026-09-04 12:45:10 IST',
    userId: 'FR-001',
    userName: 'Rehan',
    userRole: 'Team Lead / Supervising Analyst',
    action: 'LOGIN',
    details: 'Authorized prototype login in prototype environment',
  },
  {
    id: 'AUD-2026-002',
    timestamp: '2026-09-04 12:48:22 IST',
    userId: 'FR-001',
    userName: 'Rehan',
    userRole: 'Team Lead / Supervising Analyst',
    action: 'CASE_OPENED',
    details: 'Opened flagship case TRI-2026-0042 for analysis',
  },
  {
    id: 'AUD-2026-003',
    timestamp: '2026-09-04 12:50:05 IST',
    userId: 'FR-002',
    userName: 'Baskar',
    userRole: 'Cybercrime Investigator',
    action: 'PREDICTION_GENERATED',
    details: 'Generated cash-out prediction: Zone T. Nagar Corridor (78%)',
  },
  {
    id: 'AUD-2026-004',
    timestamp: '2026-09-04 13:10:14 IST',
    userId: 'FR-004',
    userName: 'Harisudhan',
    userRole: 'Financial Fraud Analyst',
    action: 'LOGIN',
    details: 'Session started - multi-hop mule analysis',
  },
];

class AuthService {
  private currentUser: PrototypeUser | null = null;
  private auditLogs: AuditLogEntry[] = [];

  constructor() {
    this.loadSession();
    this.loadAuditLogs();
  }

  private loadSession() {
    try {
      const stored = localStorage.getItem(STORAGE_SESSION_KEY);
      if (stored) {
        this.currentUser = JSON.parse(stored);
      }
    } catch {
      this.currentUser = null;
    }
  }

  private loadAuditLogs() {
    try {
      const stored = localStorage.getItem(STORAGE_AUDIT_KEY);
      if (stored) {
        this.auditLogs = JSON.parse(stored);
      } else {
        this.auditLogs = [...INITIAL_AUDIT_LOGS];
      }
    } catch {
      this.auditLogs = [...INITIAL_AUDIT_LOGS];
    }
  }

  public getDemoUsers(): PrototypeUser[] {
    return DEMO_PROTOTYPE_USERS;
  }

  public getCurrentUser(): PrototypeUser | null {
    return this.currentUser;
  }

  public isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  public async loginWithPassword(
    identifier: string, // email or user_id
    passwordPlain: string
  ): Promise<{ success: boolean; user?: PrototypeUser; error?: string }> {
    const trimmed = identifier.trim().toLowerCase();
    const user = DEMO_PROTOTYPE_USERS.find(
      (u) =>
        u.email.toLowerCase() === trimmed ||
        u.user_id.toLowerCase() === trimmed
    );

    if (!user) {
      return { success: false, error: 'User identifier not found in prototype roster.' };
    }

    const hashedInput = await sha256(passwordPlain);
    if (hashedInput !== user.password_hash) {
      return { success: false, error: 'Authentication failed: Invalid credential.' };
    }

    // Success
    const updatedUser: PrototypeUser = {
      ...user,
      last_login: new Date().toLocaleTimeString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
      }) + ' IST',
    };

    this.currentUser = updatedUser;
    try {
      localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(updatedUser));
    } catch {
      // ignore
    }

    this.recordAuditLog('LOGIN', `Authorized prototype login via secure gateway`);
    return { success: true, user: updatedUser };
  }

  public quickSelectUser(user: PrototypeUser): PrototypeUser {
    const updatedUser: PrototypeUser = {
      ...user,
      last_login: new Date().toLocaleTimeString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
      }) + ' IST',
    };

    this.currentUser = updatedUser;
    try {
      localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(updatedUser));
    } catch {
      // ignore
    }

    this.recordAuditLog('LOGIN', `Quick verified demo access as ${user.name} (${user.role})`);
    return updatedUser;
  }

  public logout() {
    if (this.currentUser) {
      this.recordAuditLog('LOGOUT', `User logged out of active session`);
    }
    this.currentUser = null;
    try {
      localStorage.removeItem(STORAGE_SESSION_KEY);
    } catch {
      // ignore
    }
  }

  public recordAuditLog(
    action: AuditLogEntry['action'],
    details: string
  ) {
    const entry: AuditLogEntry = {
      id: `AUD-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toLocaleTimeString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }) + ' IST',
      userId: this.currentUser?.user_id || 'ANONYMOUS',
      userName: this.currentUser?.name || 'System',
      userRole: this.currentUser?.role || 'Guest',
      action,
      details,
    };

    this.auditLogs.unshift(entry);
    if (this.auditLogs.length > 50) {
      this.auditLogs = this.auditLogs.slice(0, 50);
    }

    try {
      localStorage.setItem(STORAGE_AUDIT_KEY, JSON.stringify(this.auditLogs));
    } catch {
      // ignore
    }
  }

  public getAuditLogs(): AuditLogEntry[] {
    return this.auditLogs;
  }
}

export const authService = new AuthService();
