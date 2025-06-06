import React from 'react'

const Header: React.FC = () => {
  return (
    <header style={{ 
      backgroundColor: '#2c3e50', 
      color: 'white', 
      padding: '1rem 2rem',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h1>Parents in the Loop</h1>
      <p>Stay connected with your child's learning journey</p>
    </header>
  )
}

export default Header