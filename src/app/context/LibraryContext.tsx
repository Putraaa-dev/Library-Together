import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockBooks, mockLoans, mockUsers, Book, Loan, User, LoanStatus } from '../data/mockData';

interface LibraryContextType {
  books: Book[];
  loans: Loan[];
  users: User[];
  addBook: (book: Omit<Book, 'id'>) => void;
  updateBook: (id: string, data: Partial<Book>) => void;
  deleteBook: (id: string) => void;
  addLoan: (loan: Omit<Loan, 'id'>) => void;
  updateLoanStatus: (id: string, status: LoanStatus, notes?: string) => void;
  returnBook: (id: string) => void;
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: string, data: Partial<User>) => void;
  deleteUser: (id: string) => void;
  getLoansByUser: (userId: string) => Loan[];
  getBookById: (id: string) => Book | undefined;
  getUserById: (id: string) => User | undefined;
  stats: {
    totalBooks: number;
    totalUsers: number;
    totalLoans: number;
    activeLoans: number;
    overdueLoans: number;
    returnedLoans: number;
  };
}

const LibraryContext = createContext<LibraryContextType | null>(null);

export function LibraryProvider({ children }: { children: React.ReactNode }) {
  const [books, setBooks] = useState<Book[]>(() => {
    const stored = localStorage.getItem('perpus_books');
    return stored ? JSON.parse(stored) : mockBooks;
  });
  const [loans, setLoans] = useState<Loan[]>(() => {
    const stored = localStorage.getItem('perpus_loans');
    return stored ? JSON.parse(stored) : mockLoans;
  });
  const [users, setUsers] = useState<User[]>(() => {
    const stored = localStorage.getItem('perpus_users');
    return stored ? JSON.parse(stored) : mockUsers;
  });

  useEffect(() => { localStorage.setItem('perpus_books', JSON.stringify(books)); }, [books]);
  useEffect(() => { localStorage.setItem('perpus_loans', JSON.stringify(loans)); }, [loans]);
  useEffect(() => { localStorage.setItem('perpus_users', JSON.stringify(users)); }, [users]);

  const addBook = (book: Omit<Book, 'id'>) => {
    const newBook = { ...book, id: `b${Date.now()}` };
    setBooks(prev => [...prev, newBook]);
  };

  const updateBook = (id: string, data: Partial<Book>) => {
    setBooks(prev => prev.map(b => b.id === id ? { ...b, ...data } : b));
  };

  const deleteBook = (id: string) => {
    setBooks(prev => prev.filter(b => b.id !== id));
  };

  const addLoan = (loan: Omit<Loan, 'id'>) => {
    const newLoan = { ...loan, id: `l${Date.now()}` };
    setLoans(prev => [...prev, newLoan]);
    setBooks(prev => prev.map(b => b.id === loan.bookId ? { ...b, available: Math.max(0, b.available - 1) } : b));
  };

  const updateLoanStatus = (id: string, status: LoanStatus, notes?: string) => {
    setLoans(prev => prev.map(l => {
      if (l.id !== id) return l;
      const updated = { ...l, status };
      if (notes !== undefined) updated.notes = notes;
      return updated;
    }));
    if (status === 'rejected') {
      const loan = loans.find(l => l.id === id);
      if (loan) {
        setBooks(prev => prev.map(b => b.id === loan.bookId ? { ...b, available: b.available + 1 } : b));
      }
    }
  };

  const returnBook = (id: string) => {
    const loan = loans.find(l => l.id === id);
    if (!loan) return;
    setLoans(prev => prev.map(l => l.id === id ? {
      ...l,
      status: 'returned',
      returnDate: new Date().toISOString().split('T')[0],
    } : l));
    setBooks(prev => prev.map(b => b.id === loan.bookId ? { ...b, available: b.available + 1 } : b));
  };

  const addUser = (user: Omit<User, 'id'>) => {
    const newUser = { ...user, id: `u${Date.now()}` };
    setUsers(prev => [...prev, newUser]);
  };

  const updateUser = (id: string, data: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...data } : u));
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const getLoansByUser = (userId: string) => loans.filter(l => l.userId === userId);
  const getBookById = (id: string) => books.find(b => b.id === id);
  const getUserById = (id: string) => users.find(u => u.id === id);

  const stats = {
    totalBooks: books.length,
    totalUsers: users.filter(u => u.role === 'user').length,
    totalLoans: loans.length,
    activeLoans: loans.filter(l => l.status === 'approved').length,
    overdueLoans: loans.filter(l => l.status === 'overdue').length,
    returnedLoans: loans.filter(l => l.status === 'returned').length,
  };

  return (
    <LibraryContext.Provider value={{
      books, loans, users,
      addBook, updateBook, deleteBook,
      addLoan, updateLoanStatus, returnBook,
      addUser, updateUser, deleteUser,
      getLoansByUser, getBookById, getUserById,
      stats,
    }}>
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary() {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error('useLibrary must be used within LibraryProvider');
  return ctx;
}
