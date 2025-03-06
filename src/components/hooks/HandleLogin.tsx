import users from '../../pseudo-db/users.json';

export const handleLogin = async (email: string, password: string) => {
    try {
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            // Simpan seluruh data user ke localStorage
            localStorage.setItem('currentUser', JSON.stringify(user));

            return { success: true, message: 'Login successful', user };
        } else {
            return { success: false, message: 'Invalid email or password' };
        }
    } catch (error) {
        console.error('Login failed:', error);
        throw error;
    }
};

export const getCurrentUser = () => {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
};

export const handleLogout = () => {
    localStorage.removeItem('currentUser');
};
