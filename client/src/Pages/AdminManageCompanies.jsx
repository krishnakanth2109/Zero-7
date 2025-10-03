import { useState, useEffect } from 'react'
import api from '../api/axios'

const AdminManageCompanies = () => {
  const [showAddForm, setShowAddForm] = useState(false)
  const [companyData, setCompanyData] = useState([])
  const [needsRefresh, setNeedsRefresh] = useState(true) // To trigger data fetching
  const [newCompany, setNewCompany] = useState({
    _id: '',
    name: '',
    email: '',
    industry: '',
    address: '',
  })

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const { data } = await api.get('/company/')
        setCompanyData(data)
      } catch (err) {
        console.error('Failed to fetch companies:', err)
      }
    }
    // Only fetch data when needsRefresh is true
    if (needsRefresh) {
      fetchCompanyData()
      setNeedsRefresh(false) // Reset after fetching
    }
  }, [needsRefresh])

  const handleAddInputChange = (e) => {
    const { name, value } = e.target
    setNewCompany((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/company/register', newCompany)
      setNewCompany({ _id: '', name: '', email: '', industry: '', address: '' })
      setShowAddForm(false)
      setNeedsRefresh(true) // Trigger a data refresh
    } catch (error) {
      console.error('Error adding company:', error)
      alert('Failed to add company: ' + (error.response?.data?.message || 'Server error'))
    }
  }

  const handleDelete = async (companyId, companyName) => {
    // Add a confirmation dialog for better UX
    if (window.confirm(`Are you sure you want to delete ${companyName}?`)) {
      try {
        await api.delete(`/company/${companyId}`)
        setNeedsRefresh(true) // Trigger a data refresh
      } catch (error) {
        console.error('Error deleting company:', error)
        alert('Failed to delete company.')
      }
    }
  }

  return (
    <div className='container mx-auto p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen'>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-3xl font-bold text-gray-800'>Manage Companies</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className='px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-transform transform hover:scale-105'>
          {showAddForm ? 'Close Form' : 'Add Company'}
        </button>
      </div>

      {showAddForm && (
        <div className='mb-8 p-6 bg-white shadow-xl rounded-lg border border-gray-200'>
          <h3 className='text-2xl font-semibold mb-6 text-gray-700'>
            Add New Company
          </h3>
          <form
            onSubmit={handleSubmit}
            className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4'>
            <div>
              <label htmlFor='companyId' className='block text-sm font-medium text-gray-600'>Company ID</label>
              <input
                type='text'
                id='companyId'
                name='_id'
                value={newCompany._id}
                onChange={handleAddInputChange}
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
                required
              />
            </div>
            <div>
              <label htmlFor='name' className='block text-sm font-medium text-gray-600'>Company Name</label>
              <input
                type='text'
                id='name'
                name='name'
                value={newCompany.name}
                onChange={handleAddInputChange}
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
                required
              />
            </div>
            <div>
              <label htmlFor='email' className='block text-sm font-medium text-gray-600'>Email</label>
              <input
                type='email'
                id='email'
                name='email'
                value={newCompany.email}
                onChange={handleAddInputChange}
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
                required
              />
            </div>
            <div>
              <label htmlFor='industry' className='block text-sm font-medium text-gray-600'>Industry</label>
              <input
                type='text'
                id='industry'
                name='industry'
                value={newCompany.industry}
                onChange={handleAddInputChange}
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
                required
              />
            </div>
            <div className='md:col-span-2'>
              <label htmlFor='address' className='block text-sm font-medium text-gray-600'>Address</label>
              <textarea
                id='address'
                name='address'
                value={newCompany.address}
                onChange={handleAddInputChange}
                rows='3'
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
              />
            </div>
            <div className='md:col-span-2'>
              <button
                type='submit'
                className='w-full px-4 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'>
                Add Company
              </button>
            </div>
          </form>
        </div>
      )}

      <div className='overflow-x-auto bg-white shadow-xl rounded-lg border border-gray-200'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              {['ID', 'Name', 'Email', 'Industry', 'Address', 'Actions'].map((header) => (
                <th key={header} className='px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider'>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {companyData.map((company) => (
              <tr key={company._id} className='hover:bg-gray-100 transition-colors duration-200'>
                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800'>{company._id}</td>
                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>{company.name}</td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>{company.email}</td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>{company.industry}</td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>{company.address}</td>
                <td className='px-6 py-4 whitespace-nowrap text-left text-sm font-medium'>
                  <button
                    onClick={() => handleDelete(company._id, company.name)}
                    className='text-red-600 hover:text-red-900 font-semibold'>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminManageCompanies