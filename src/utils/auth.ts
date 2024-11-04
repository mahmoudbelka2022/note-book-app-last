import { User } from '../types';

export const authenticateUser = (username: string, password: string): User | null => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  return users.find((user: User) => user.username === username && user.password === password) || null;
};

export const registerUser = (username: string, password: string): boolean => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  
  if (users.some((user: User) => user.username === username)) {
    return false;
  }

  users.push({
    username,
    password,
    notes: []
  });
  
  localStorage.setItem('users', JSON.stringify(users));
  return true;
};

export const saveUserNotes = (username: string, notes: any[]) => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const userIndex = users.findIndex((user: User) => user.username === username);
  
  if (userIndex !== -1) {
    users[userIndex].notes = notes;
    localStorage.setItem('users', JSON.stringify(users));
  }
};