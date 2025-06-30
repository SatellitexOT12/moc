// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
    is_superuser: boolean;
}

interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    // Cargar usuario desde localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error('Error al cargar usuario desde localStorage');
            }
        }
    }, []);

    const logout = () => {
        fetch('http://localhost:8000/api/logout/', {
            method: 'POST',
            credentials: 'include'
        })
            .then(() => {
                localStorage.removeItem('user');
                setUser(null);
            });
    };

    return (
        <AuthContext.Provider value={{ user, setUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook seguro para usar en componentes
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de un AuthProvider');
    }
    return context;
};