import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

const Navbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5001/api/current_user')
      .then(res => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  return (
    <nav className="w-full py-4 px-8 bg-gray-800 border-b border-gray-700 flex justify-between items-center sticky top-0 z-50">
      <Link to="/" className="text-2xl font-bold text-blue-500 hover:text-blue-400 transition">BITStream</Link>
      
      <div className="flex items-center space-x-6">
        <Link to="/" className="hover:text-blue-400 transition text-gray-300 font-medium">Home</Link>
        
        {user ? (
          <div className="flex items-center space-x-4">
            <Link to="/upload" className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-xs font-bold transition border border-gray-600">
              + Upload
            </Link>
            <div className="flex items-center space-x-2">
               <span className="text-xs text-gray-400">{user.name}</span>
               <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center font-bold text-sm">{user.name.charAt(0)}</div>
            </div>
          </div>
        ) : (
          <a href="http://localhost:5001/auth/google" className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg text-sm font-bold transition shadow-lg text-white">
            Login
          </a>
        )}
      </div>
    </nav>
  )
}

export default Navbar