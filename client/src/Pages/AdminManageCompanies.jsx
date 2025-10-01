import { useState, useEffect } from 'react'
import api from '../api/axios'

const AdminManageCompanies = () => {
  const [showAddForm, setShowAddForm] = useState(false)
  const [companyData, setCompanyData] = useState([])
  const [newCompany, setNewCompany] = useState({
    id: '',
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
        console.log(err)
      }
    }
    fetchCompanyData()
  }, [showAddForm])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await api.post('/company/register', newCompany)
    console.log(res.data)
    setNewCompany({
      id: '',
      name: '',
      email: '',
      industry: '',
      address: '',
    })
    setShowAddForm(false)
  }

  const handleAddInputChange = (e) => {
    const { name, value } = e.target
    setNewCompany((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className='container mx-auto p-4 sm:p-6 lg:p-8'>
      <h2 className='text-2xl font-bold mb-6 text-gray-800'>Companies List</h2>

      {/* Add New Interview Button */}
      <button
        onClick={() => setShowAddForm(!showAddForm)}
        className='mb-6 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>
        {showAddForm ? 'Hide Add Form' : 'Add Company'}
      </button>

      {/* Add New Interview Form */}
      {showAddForm && (
        <div className='mb-8 p-6 bg-white shadow-md rounded-lg'>
          <h3 className='text-xl font-semibold mb-4 text-gray-800'>
            Add Company
          </h3>
          <form
            onSubmit={handleSubmit}
            className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label
                htmlFor='companyId'
                className='block text-sm font-medium text-gray-700'>
                Company Id
              </label>
              <input
                type='text'
                id='companyId'
                name='id'
                value={newCompany.id}
                onChange={handleAddInputChange}
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                required
              />
            </div>
            <div>
              <label
                htmlFor='name'
                className='block text-sm font-medium text-gray-700'>
                Company Name
              </label>
              <input
                type='text'
                id='name'
                name='name'
                value={newCompany.name}
                onChange={handleAddInputChange}
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                required
              />
            </div>
            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-gray-700'>
                Company Email
              </label>
              <input
                type='email'
                id='email'
                name='email'
                value={newCompany.email}
                onChange={handleAddInputChange}
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                required
              />
            </div>
            <div>
              <label
                htmlFor='industry'
                className='block text-sm font-medium text-gray-700'>
                Company Industry
              </label>
              <input
                type='text'
                id='industry'
                name='industry'
                value={newCompany.industry}
                onChange={handleAddInputChange}
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                required
              />
            </div>
            <div>
              <label
                htmlFor='address'
                className='block text-sm font-medium text-gray-700'>
                Company Address
              </label>
              <input
                type='textarea'
                id='address'
                name='address'
                value={newCompany.address}
                onChange={handleAddInputChange}
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
              />
            </div>
            <div className='md:col-span-2'>
              <button
                type='submit'
                className='px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'>
                Add Company
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Interview Table */}
      <div className='overflow-x-auto bg-white shadow-md rounded-lg'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-blue-600'>
            <tr>
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider'>
                Company Id
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider'>
                Company Name
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider'>
                Email
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider'>
                Industry
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider'>
                Address
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {companyData &&
              companyData.map((company) => (
                <tr key={company._id} className='hover:bg-gray-50'>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                    {company._id}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                    {company.name}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                    {company.email}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm'>
                    {company.industry}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                    {company.address}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                    <button className='text-indigo-600 hover:text-indigo-900'>
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
