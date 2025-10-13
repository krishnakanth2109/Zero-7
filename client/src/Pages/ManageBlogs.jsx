import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { FaTrashAlt, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa' // For icons in alerts and delete button

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api'

export default function ManageBlogs() {
  const [blogs, setBlogs] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const fileInputRef = useRef(null) // Create a ref for the file input

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
      setErrorMessage('Failed to load blogs.')
      clearMessages()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Clear previous messages
    setSuccessMessage('')
    setErrorMessage('')

    if (!title || !description || !image) {
      setErrorMessage('All fields are required.')
      clearMessages()
      return
    }

    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    formData.append('image', image) // 'image' should match the field name your backend expects for the file

    setLoading(true)

    try {
      await axios.post(`${API_URL}/blogs`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      setSuccessMessage('Blog added successfully!')
      // Reset form fields
      setTitle('')
      setDescription('')
      setImage(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = '' // Clear file input
      }
      fetchBlogs() // Re-fetch blogs to update the list
    } catch (err) {
      console.error('Failed to add blog:', err)
      setErrorMessage('Failed to add blog. Please try again.')
    } finally {
      setLoading(false)
      clearMessages()
    }
  }

  const handleDelete = async (id) => {
    // Optional: Add a confirmation dialog before deleting
    if (!window.confirm('Are you sure you want to delete this blog?')) {
      return
    }

    setSuccessMessage('')
    setErrorMessage('')

    try {
      await axios.delete(`${API_URL}/blogs/${id}`)
      setSuccessMessage('Blog deleted successfully!')
      fetchBlogs() // Re-fetch blogs
    } catch (err) {
      console.error('Failed to delete blog:', err)
      setErrorMessage('Failed to delete blog. Please try again.')
    } finally {
      clearMessages()
    }
  }

  return (
    <div className='min-h-screen bg-blue-50 p-4'>
      <div className='max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6'>
        <h2 className='text-4xl font-extrabold text-center text-blue-800 mb-8'>
          Manage Blogs
        </h2>

        {/* Success and Error Alerts */}
        {successMessage && (
          <div className='flex items-center bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded'>
            <FaCheckCircle className='mr-2 text-lg' />
            <p className='font-semibold'>{successMessage}</p>
          </div>
        )}
        {errorMessage && (
          <div className='flex items-center bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded'>
            <FaExclamationCircle className='mr-2 text-lg' />
            <p className='font-semibold'>{errorMessage}</p>
          </div>
        )}

        {/* Add New Blog Form */}
        <form onSubmit={handleSubmit} className='bg-blue-50 p-6 rounded-lg shadow-md mb-8'>
          <h3 className='text-2xl font-semibold text-blue-700 mb-6'>Add New Blog Post</h3>

          <div className='mb-4'>
            <label htmlFor='title' className='block text-blue-700 text-sm font-bold mb-2'>
              Blog Title
            </label>
            <input
              type='text'
              id='title'
              placeholder='Enter blog title'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 transition duration-200 ease-in-out'
            />
          </div>

          <div className='mb-4'>
            <label htmlFor='description' className='block text-blue-700 text-sm font-bold mb-2'>
              Blog Description
            </label>
            <textarea
              id='description'
              placeholder='Enter blog description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              rows='5'
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 transition duration-200 ease-in-out'
            />
          </div>

          <div className='mb-6'>
            <label htmlFor='imageUpload' className='block text-blue-700 text-sm font-bold mb-2'>
              Upload Image
            </label>
            <input
              type='file'
              id='imageUpload'
              ref={fileInputRef}
              onChange={(e) => setImage(e.target.files[0])}
              disabled={loading}
              className='block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 file:cursor-pointer'
            />
            {image && (
              <p className='mt-2 text-sm text-gray-600'>Selected: {image.name}</p>
            )}
          </div>

          <button
            type='submit'
            disabled={loading}
            className='w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {loading ? 'Uploading Blog...' : 'Add Blog'}
          </button>
        </form>

        {/* Blogs List */}
        <h3 className='text-3xl font-bold text-blue-800 mb-6'>Your Blog Posts</h3>
        {blogs.length === 0 ? (
          <p className='text-center text-gray-600 text-lg'>No blogs found. Add one above!</p>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {blogs.map((blog) => (
              <div
                key={blog._id}
                className='bg-white border border-blue-100 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out overflow-hidden'
              >
                <img
                  src={blog.imageUrl || 'https://via.placeholder.com/400x250.png?text=No+Image'} // Fallback for missing image
                  alt={blog.title}
                  className='w-full h-48 object-cover'
                />
                <div className='p-4'>
                  <h4 className='text-xl font-semibold text-blue-800 mb-2 truncate'>
                    {blog.title}
                  </h4>
                  <p className='text-gray-700 text-sm mb-4 line-clamp-3'>
                    {blog.description}
                  </p>
                  <button
                    onClick={() => handleDelete(blog._id)}
                    className='flex items-center justify-center bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 rounded text-sm transition duration-300 ease-in-out'
                  >
                    <FaTrashAlt className='mr-1' /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}