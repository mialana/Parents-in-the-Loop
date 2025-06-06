import React, { useState, useEffect } from 'react'
import axios from 'axios'
import ImageUpload from './ImageUpload'

interface ApiStatus {
  status: string
  message: string
}

const Dashboard: React.FC = () => {
  const [apiStatus, setApiStatus] = useState<ApiStatus | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkApiConnection = async () => {
      try {
        const response = await axios.get('/api/health/')
        setApiStatus(response.data)
      } catch (error) {
        setApiStatus({
          status: 'error',
          message: 'Unable to connect to backend API'
        })
      } finally {
        setLoading(false)
      }
    }

    checkApiConnection()
  }, [])

  return (
    <div>
      <h2>Dashboard</h2>
      <div style={{ 
        padding: '20px', 
        backgroundColor: 'white', 
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginTop: '20px'
      }}>
        <h3>API Connection Status</h3>
        {loading ? (
          <p>Checking connection...</p>
        ) : (
          <div style={{
            padding: '10px',
            borderRadius: '4px',
            backgroundColor: apiStatus?.status === 'ok' ? '#d4edda' : '#f8d7da',
            color: apiStatus?.status === 'ok' ? '#155724' : '#721c24',
            border: `1px solid ${apiStatus?.status === 'ok' ? '#c3e6cb' : '#f5c6cb'}`
          }}>
            <strong>Status:</strong> {apiStatus?.status}<br />
            <strong>Message:</strong> {apiStatus?.message}
          </div>
        )}
      </div>

      <ImageUpload />
      
      <div style={{ 
        padding: '20px', 
        backgroundColor: 'white', 
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginTop: '20px'
      }}>
        <h3>Welcome to Parents in the Loop</h3>
        <p>This is your dashboard where you can track your child's homework progress and stay informed about their learning activities.</p>
        <p>Features:</p>
        <ul>
          <li>✅ Homework image upload and AI analysis</li>
          <li>📊 Progress tracking</li>
          <li>💬 AI-powered feedback and guidance</li>
          <li>📈 Learning analytics</li>
        </ul>
      </div>
    </div>
  )
}

export default Dashboard