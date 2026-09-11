/**
 * TRINETRA - Authorized Prototype Users Configuration
 * Smart India Hackathon 2026 | Team Furious Rookie
 *
 * NOTE FOR TEAM FURIOUS ROOKIE:
 * You can replace the names and emails below with your actual team members'
 * names and email addresses. Passwords are validated using SHA-256 hashes.
 *
 * Default demo password for all 6 accounts: "Trinetra@2026"
 * (Pre-computed SHA-256 hash stored below - no plaintext passwords in storage)
 */

import { PrototypeUser } from '../types';

// Pre-computed SHA-256 hash of "Trinetra@2026"
export const DEFAULT_DEMO_PASSWORD_HASH =
  '5a1a1f0a20e40fa3d06cb55627255953dd6a8ee382dfa54b38d3ca2eb8fa49ef';

export const DEMO_PROTOTYPE_USERS: PrototypeUser[] = [
  {
    user_id: 'FR-001',
    name: 'Rehan',
    email: 'rehan@furiousrookie.team',
    password_hash: DEFAULT_DEMO_PASSWORD_HASH,
    role: 'Team Lead / Supervising Analyst',
    access_level: 'PROTOTYPE_USER',
    last_login: '2026-09-04 12:45 IST',
  },
  {
    user_id: 'FR-002',
    name: 'Baskar',
    email: 'baskar@furiousrookie.team',
    password_hash: DEFAULT_DEMO_PASSWORD_HASH,
    role: 'Cybercrime Investigator',
    access_level: 'PROTOTYPE_USER',
    last_login: '2026-09-04 13:10 IST',
  },
  {
    user_id: 'FR-003',
    name: 'Raghu',
    email: 'raghu@furiousrookie.team',
    password_hash: DEFAULT_DEMO_PASSWORD_HASH,
    role: 'Network Intelligence Analyst',
    access_level: 'PROTOTYPE_USER',
    last_login: '2026-09-04 11:30 IST',
  },
  {
    user_id: 'FR-004',
    name: 'Harisudhan',
    email: 'harisudhan@furiousrookie.team',
    password_hash: DEFAULT_DEMO_PASSWORD_HASH,
    role: 'Financial Fraud Analyst',
    access_level: 'PROTOTYPE_USER',
    last_login: '2026-09-04 10:15 IST',
  },
  {
    user_id: 'FR-005',
    name: 'Yuvashree',
    email: 'yuvashree@furiousrookie.team',
    password_hash: DEFAULT_DEMO_PASSWORD_HASH,
    role: 'Geospatial Intelligence Analyst',
    access_level: 'PROTOTYPE_USER',
    last_login: '2026-09-04 09:00 IST',
  },
  {
    user_id: 'FR-006',
    name: 'Madhu',
    email: 'madhu@furiousrookie.team',
    password_hash: DEFAULT_DEMO_PASSWORD_HASH,
    role: 'Predictive Analytics Analyst',
    access_level: 'PROTOTYPE_USER',
    last_login: '2026-09-04 08:30 IST',
  },
];
