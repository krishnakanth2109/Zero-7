// File: src/Pages/ManageBlogs.jsx

import React, { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api'

export default function ManageBlogs() {
  const [blogs, setBlogs] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [editingId, setEditingId] = useState(null) // State to track the blog being edited
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchBlogs()
  }, [])

  // Function to clear messages after a few seconds
  const clearMessages = () => {
    setTimeout(() => {
      setSuccessMessage('')
      setErrorMessage('')
    }, 4000) // Clear messages after 4 seconds
  }

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`${API_URL}/blogs`)
      setBlogs(response.data)
    } catch (err) {
      console.error('Failed to fetch blogs:', err)
      setError('Failed to load blogs.')
    }
  }

  // Resets the form to its initial state
  const resetForm = () => {
    setTitle('')
    setDescription('')
    setImageUrl('')
    setEditingId(null)
    setError('')
  }

  // Handler to set the form up for editing a blog post
  const handleEdit = (blog) => {
    setEditingId(blog._id)
    setTitle(blog.title)
    setDescription(blog.description)
    setImageUrl(blog.imageUrl)
    window.scrollTo({ top: 0, behavior: 'smooth' }) // Scroll to top to see the form
  }

  const handleCancelEdit = () => {
    resetForm()
  }

  // Unified handler for both creating and updating a blog post
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title || !description || !imageUrl) {
      setError('All fields are required.')
      return
    }

    setLoading(true)
    setError('')

    const blogData = { title, description, imageUrl }

    try {
      if (editingId) {
        // If we have an editingId, update the existing blog (PUT request)
        await axios.put(`${API_URL}/blogs/${editingId}`, blogData)
      } else {
        // Otherwise, create a new blog (POST request)
        await axios.post(`${API_URL}/blogs`, blogData)
      }

      resetForm() // Reset form after successful submission
      fetchBlogs() // Refresh the list of blogs
    } catch (err) {
      console.error('Failed to submit blog:', err)
      setError(
        err.response?.data?.message ||
          'Failed to submit blog. Please try again.',
      )
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) {
      return
    }

    try {
      await axios.delete(`${API_URL}/blogs/${id}`)
      setBlogs(blogs.filter((blog) => blog._id !== id)) // Refresh list locally
    } catch (err) {
      console.error('Failed to delete blog:', err)
      setError(err.response?.data?.message || 'Failed to delete blog.')
    }
  }

  return (
    <div className='flex flex-col items-center p-4'>
      <div className='w-full max-w-lg'>
        <h2 className='text-3xl font-bold mb-6 text-center'>
          {editingId ? 'Edit Blog Post' : 'Add New Blog Post'}
        </h2>

        <form
          onSubmit={handleSubmit}
          className='p-6 bg-white shadow-md rounded-lg'>
          {error && <p className='text-red-500 mb-4'>{error}</p>}

          <input
            type='text'
            placeholder='Blog Title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
            className='w-full p-2 mb-4 border rounded'
          />

          <textarea
            placeholder='Blog Description'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
            className='w-full p-2 mb-4 border rounded'
            rows='4'
          />

          <input
            type='url'
            placeholder='Image URL (e.g., https://...)'
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            disabled={loading}
            className='w-full p-2 mb-4 border rounded'
          />

          <div className='flex items-center space-x-2'>
            <button
              type='submit'
              disabled={loading}
              className='flex-grow p-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300'>
              {loading
                ? editingId
                  ? 'Updating...'
                  : 'Adding...'
                : editingId
                ? 'Update Post'
                : 'Add Post'}
            </button>

            {/* Show cancel button only when editing */}
            {editingId && (
              <button
                type='button'
                onClick={handleCancelEdit}
                className='p-3 bg-gray-500 text-white rounded hover:bg-gray-600'>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className='w-full max-w-5xl mt-12'>
        <h3 className='text-2xl font-semibold mb-4 border-b pb-2'>
          Existing Posts
        </h3>
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className='bg-white shadow-lg rounded-lg overflow-hidden flex flex-col'>
              <img
                src={blog.imageUrl}
                alt={blog.title}
                className='w-full h-40 object-cover'
              />
              <div className='p-4 flex flex-col flex-grow'>
                <h4 className='font-bold text-lg truncate'>{blog.title}</h4>
                <p className='text-sm text-gray-600 flex-grow h-16 overflow-hidden'>
                  {blog.description}
                </p>
                <div className='flex space-x-2 mt-4'>
                  <button
                    onClick={() => handleEdit(blog)}
                    className='w-full py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600'>
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(blog._id)}
                    className='w-full py-2 bg-red-500 text-white rounded hover:bg-red-600'>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
