import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const PageWrapper = ({ children }: { children: React.ReactNode }) => {
    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();
  
    const handleLogout = () => {
        logout();
        navigate('/login')
      };
    
  return (
    <>
        <button className="right-4 p-2 bg-red-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded" onClick={handleLogout}>Logout</button>
        {children}
    </>
  )
}

export default PageWrapper
