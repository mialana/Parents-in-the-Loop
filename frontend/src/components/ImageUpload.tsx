import React, { useState } from 'react'
import axios from 'axios'

interface UploadResponse {
  success: boolean
  feedback?: string
  error?: string
}

const ImageUpload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setError(null)
      setFeedback(null)
      
      // Create preview URL
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setUploading(true)
    setError(null)
    setFeedback(null)

    const formData = new FormData()
    formData.append('image', selectedFile)

    try {
      const response = await axios.post<UploadResponse>('/api/upload-image/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (response.data.success) {
        setFeedback(response.data.feedback || 'Upload successful!')
      } else {
        setError(response.data.error || 'Upload failed')
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const resetUpload = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setFeedback(null)
    setError(null)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
  }

  return (
    <div style={{
      padding: '20px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      marginTop: '20px'
    }}>
      <h3>Upload Homework Image</h3>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Upload an image of homework to get AI feedback and guidance
      </p>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          style={{
            padding: '10px',
            border: '2px dashed #ddd',
            borderRadius: '4px',
            width: '100%',
            cursor: 'pointer'
          }}
        />
      </div>

      {previewUrl && (
        <div style={{ marginBottom: '20px' }}>
          <h4>Preview:</h4>
          <img
            src={previewUrl}
            alt="Upload preview"
            style={{
              maxWidth: '300px',
              maxHeight: '300px',
              objectFit: 'contain',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
          style={{
            marginRight: '10px',
            opacity: (!selectedFile || uploading) ? 0.6 : 1
          }}
        >
          {uploading ? 'Analyzing...' : 'Upload & Analyze'}
        </button>
        
        {selectedFile && (
          <button
            onClick={resetUpload}
            style={{
              backgroundColor: '#6c757d'
            }}
          >
            Clear
          </button>
        )}
      </div>

      {error && (
        <div style={{
          padding: '10px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          border: '1px solid #f5c6cb',
          borderRadius: '4px',
          marginBottom: '10px'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {feedback && (
        <div style={{
          padding: '15px',
          backgroundColor: '#d4edda',
          color: '#155724',
          border: '1px solid #c3e6cb',
          borderRadius: '4px'
        }}>
          <h4>AI Feedback:</h4>
          <div style={{ whiteSpace: 'pre-line' }}>
            {feedback}
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageUpload