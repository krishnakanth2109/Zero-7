// File: src/Pages/ManageBlogs.jsx

import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api'

export default function ManageBlogs() {
  const [blogs, setBlogs] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Create a ref for the file input
  const fileInputRef = useRef(null)

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`${API_URL}/blogs`)
      setBlogs(response.data)
    } catch (err) {
      console.error('Failed to fetch blogs:', err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title || !description || !image) {
      setError('All fields are required.')
      return
    }

    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    formData.append('image', image)

    setLoading(true)
    setError('')

    try {
      await axios.post(`${API_URL}/blogs`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      // Reset form fields and fetch blogs again
      setTitle('')
      setDescription('')
      setImage(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = '' // Clear file input
      }
      fetchBlogs()
    } catch (err) {
      console.error('Failed to add blog:', err)
      setError('Failed to add blog. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/blogs/${id}`)
      fetchBlogs()
    } catch (err) {
      console.error('Failed to delete blog:', err)
    }
  }

  return (
    <div className='flex flex-col items-center'>
      <h2 className='text-3xl font-bold '>Manage Blogs</h2>

      <form onSubmit={handleSubmit} className='blog-form'>
        {error && <p className='error-message'>{error}</p>}
        <input
          type='text'
          placeholder='Blog Title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
        />
        <textarea
          placeholder='Blog Description'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={loading}
        />
        <input
          type='file'
          ref={fileInputRef} // Attach ref here
          onChange={(e) => setImage(e.target.files[0])}
          disabled={loading}
        />
        <button type='submit' disabled={loading}>
          {loading ? 'Uploading...' : 'Add Blog'}
        </button>
      </form>

      <div className='blogs-list'>
        {blogs.map((blog) => (
          <div key={blog._id} className='blog-item'>
            {/* THE FIX IS HERE: Use blog.imageUrl directly */}
            <img src={blog.imageUrl} alt={blog.title} />
            <h3>{blog.title}</h3>
            <p>{blog.description}</p>
            <button onClick={() => handleDelete(blog._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}
