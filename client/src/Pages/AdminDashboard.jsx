import {
  Briefcase,
  Calendar,
  UserCheck,
  UsersRound,
  Building2,
  TrendingUp,
} from 'lucide-react'
import './AdminDashboard.css'
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useState } from 'react'

export default function AdminDashboard() {
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({
    candidate: '',
    position: '',
    Experience: '',
    Location: '',
    Skills: '',
    Phone: '',
    Status: '',
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // handle form submission here
    setShowModal(false)
  }
  const applicationsTrend = [
    { month: 'Jan', applications: 45, interviews: 12, hired: 3 },
    { month: 'Feb', applications: 52, interviews: 18, hired: 5 },
    { month: 'Mar', applications: 78, interviews: 25, hired: 8 },
    { month: 'Apr', applications: 95, interviews: 32, hired: 12 },
    { month: 'May', applications: 115, interviews: 38, hired: 15 },
    { month: 'Jun', applications: 128, interviews: 45, hired: 18 },
  ]

  const recentApplicates = [
    {
      candidate: 'Joe Doe',
      position: 'Full Stack Developer',
      Experience: '3-10 years',
      Location: 'Hyderabad',
      Skills: ['React js', 'Node js', 'Docker'],
      Phone: 8121211111,
      AppliedDate: '19/09/2025',
      Status: 'Active',
    },
    {
      candidate: 'Sarah Smith',
      position: 'Frontend Developer',
      Experience: '2-5 years',
      Location: 'Bangalore',
      Skills: ['React js', 'TypeScript', 'CSS'],
      Phone: 9876543210,
      AppliedDate: '18/09/2025',
      Status: 'InActive',
    },
    {
      candidate: 'Mike Johnson',
      position: 'Backend Developer',
      Experience: '4-8 years',
      Location: 'Mumbai',
      Skills: ['Node js', 'Python', 'MongoDB'],
      Phone: 7654321098,
      AppliedDate: '17/09/2025',
      Status: 'Active',
    },
    {
      candidate: 'Emily Chen',
      position: 'DevOps Engineer',
      Experience: '5-7 years',
      Location: 'Pune',
      Skills: ['AWS', 'Docker', 'Kubernetes'],
      Phone: 8899776655,
      AppliedDate: '16/09/2025',
      Status: 'InActive',
    },
    {
      candidate: 'Alex Kumar',
      position: 'UI/UX Designer',
      Experience: '3-6 years',
      Location: 'Chennai',
      Skills: ['Figma', 'Adobe XD', 'Sketch'],
      Phone: 9988776655,
      AppliedDate: '15/09/2025',
      Status: 'Active',
    },
    {
      candidate: 'Lisa Patel',
      position: 'Data Engineer',
      Experience: '4-7 years',
      Location: 'Delhi',
      Skills: ['Python', 'SQL', 'Hadoop'],
      Phone: 7788994455,
      AppliedDate: '14/09/2025',
      Status: 'InActive',
    },
    {
      candidate: 'Tom Wilson',
      position: 'Cloud Architect',
      Experience: '6-10 years',
      Location: 'Hyderabad',
      Skills: ['Azure', 'AWS', 'GCP'],
      Phone: 8877665544,
      AppliedDate: '13/09/2025',
      Status: 'Active',
    },
    {
      candidate: 'Priya Sharma',
      position: 'QA Engineer',
      Experience: '2-4 years',
      Location: 'Bangalore',
      Skills: ['Selenium', 'Jest', 'Cypress'],
      Phone: 9966554433,
      AppliedDate: '12/09/2025',
      Status: 'InActive',
    },
    {
      candidate: 'David Lee',
      position: 'Mobile Developer',
      Experience: '3-5 years',
      Location: 'Mumbai',
      Skills: ['React Native', 'Flutter', 'iOS'],
      Phone: 8855443322,
      AppliedDate: '11/09/2025',
      Status: 'Active',
    },
    {
      candidate: 'Anna Brown',
      position: 'System Architect',
      Experience: '7-12 years',
      Location: 'Pune',
      Skills: ['Java', 'Spring', 'Microservices'],
      Phone: 7744332211,
      AppliedDate: '10/09/2025',
      Status: 'InActive',
    },
  ]

  const addCandidateForm = () => {
    return (
      <div className='fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-lg'>
        <div className='bg-white rounded-xl p-6 w-full max-w-lg shadow-lg'>
          <h2 className='text-xl font-bold mb-4'>Add Candidate</h2>
          <form onSubmit={handleSubmit}>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium mb-1'>
                  Candidate Name
                </label>
                <input
                  name='candidate'
                  value={form.candidate}
                  onChange={handleChange}
                  className='w-full border rounded px-2 py-1'
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-medium mb-1'>
                  Position
                </label>
                <input
                  name='position'
                  value={form.position}
                  onChange={handleChange}
                  className='w-full border rounded px-2 py-1'
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-medium mb-1'>
                  Experience
                </label>
                <input
                  name='experience'
                  value={form.experience}
                  onChange={handleChange}
                  className='w-full border rounded px-2 py-1'
                />
              </div>
              <div>
                <label className='block text-sm font-medium mb-1'>
                  Location
                </label>
                <input
                  name='location'
                  value={form.location}
                  onChange={handleChange}
                  className='w-full border rounded px-2 py-1'
                />
              </div>
              <div>
                <label className='block text-sm font-medium mb-1'>
                  Skills (comma separated)
                </label>
                <input
                  name='skills'
                  value={form.skills}
                  onChange={handleChange}
                  className='w-full border rounded px-2 py-1'
                />
              </div>
              <div>
                <label className='block text-sm font-medium mb-1'>Phone</label>
                <input
                  name='phone'
                  value={form.phone}
                  onChange={handleChange}
                  className='w-full border rounded px-2 py-1'
                />
              </div>
            </div>
            <div className='flex justify-end gap-2 mt-6'>
              <button
                type='button'
                className='px-4 py-2 rounded bg-gray-200'
                onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button
                type='submit'
                className='px-4 py-2 rounded bg-blue-600 text-white'>
                Add
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className='flex flex-col gap-4'>
      <div className='admin-main flex-1 rounded-2xl p-6 border-border flex flex-col md:flex-row items-start md:items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>Welcome back!</h1>
          <span>Here&apos;s your recruitment dashboard today.</span>
        </div>
        <div className='flex items-center gap-2'>
          <button className='schedule-button flex items-center text-xs hover:cursor-pointer'>
            <Calendar className='icons mr-1 ' /> Schedule Interview
          </button>
          <button
            onClick={() => setShowModal(true)}
            className='add-candidate flex items-center text-xs hover:cursor-pointer'>
            <UsersRound className='icons mr-1 ' /> Add Candidate
          </button>
        </div>
      </div>
      {showModal && addCandidateForm()}
      {/* Card Container */}
      <div className='flex flex-wrap gap-2'>
        <div className='bg-white rounded-2xl p-4 hover:shadow-xl flex-1 flex flex-col gap-1'>
          {/* Icon with percent */}
          <div className='flex items-center justify-between'>
            <div className='bg-red-200 p-2 rounded-lg'>
              <UsersRound className=' stroke-red-500 stroke-2' />
            </div>
            <p className='text-[#16a34a]'>+12%</p>
          </div>
          <div>
            <h1 className='text-3xl font-bold mt-3'>0</h1>
            <p className='text-lg font-semibold text-[#64748b]'>
              Total Candidates
            </p>
            <p className='text-sm text-[#64748b]'>vs Last week</p>
          </div>
        </div>
        <div className='bg-white rounded-2xl flex-1 p-4 hover:shadow-xl flex flex-col gap-1 '>
          {/* Icon with percent */}
          <div className='flex items-center justify-between'>
            <div className='bg-red-200 p-2 rounded-lg'>
              <Briefcase className=' stroke-red-500 stroke-2' />
            </div>
            <p className='text-[#16a34a]'>+3%</p>
          </div>
          <div>
            <h1 className='text-3xl font-bold mt-3'>0</h1>
            <p className='text-lg font-semibold text-[#64748b]'>Active Jobs</p>
            <p className='text-sm text-[#64748b]'>new this week</p>
          </div>
        </div>
        <div className='bg-white rounded-2xl flex-1 p-4 hover:shadow-xl flex flex-col gap-1 '>
          {/* Icon with percent */}
          <div className='flex items-center justify-between'>
            <div className='bg-red-200 p-2 rounded-lg'>
              <UserCheck className=' stroke-red-500 stroke-2' />
            </div>
            <p className='text-[#16a34a]'>+12%</p>
          </div>
          <div>
            <h1 className='text-3xl font-bold mt-3'>0</h1>
            <p className='text-lg font-semibold text-[#64748b]'>
              Bench Candidates
            </p>
            <p className='text-sm text-gray-500'>ready to deploy</p>
          </div>
        </div>
        <div className='bg-white rounded-2xl flex-1 p-4 hover:shadow-xl flex flex-col gap-1 '>
          {/* Icon with percent */}
          <div className='flex items-center justify-between'>
            <div className='bg-red-200 p-2 rounded-lg'>
              <Building2 className=' stroke-red-500 stroke-2' />
            </div>
            <p className='text-[#16a34a]'>+12%</p>
          </div>
          <div>
            <h1 className='text-3xl font-bold mt-3'>0</h1>
            <p className='text-lg font-semibold text-[#64748b]'>
              Partner Companies
            </p>
            <p className='text-sm text-[#64748b]'>actively hiring</p>
          </div>
        </div>
      </div>
      {/* Charts */}
      <div className='flex gap-4 md:tems-center max-md:flex-col '>
        <div className='bg-white rounded-xl w-[50%] max-md:w-full p-4 '>
          <div className='flex gap-2 text-xl font-bold'>
            <TrendingUp className='stroke-2 stroke-red-500' />
            Application Trends
          </div>
          <ResponsiveContainer height={300} width='100%'>
            <AreaChart
              data={applicationsTrend}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id='applications' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='5%' stopColor='#dc2626' stopOpacity={0.8} />
                  <stop offset='95%' stopColor='#dc2626' stopOpacity={0} />
                </linearGradient>
                <linearGradient id='interviews' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='5%' stopColor='#0da2e7' stopOpacity={0.8} />
                  <stop offset='95%' stopColor='#0da2e7' stopOpacity={0} />
                </linearGradient>
                <linearGradient id='hired' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='5%' stopColor='#16a34a' stopOpacity={0.8} />
                  <stop offset='95%' stopColor='#16a34a' stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey='month' />
              <YAxis />
              <CartesianGrid
                horizontal={false}
                vertical={false}
                strokeDasharray='3 3'
              />
              <Tooltip />
              <Area
                type='monotone'
                dataKey='applications'
                stroke='#dc2626'
                fillOpacity={1}
                fill='url(#applications)'
              />
              <Area
                type='monotone'
                dataKey='interviews'
                stroke='#0da2e7'
                fillOpacity={1}
                fill='url(#interviews)'
              />
              <Area
                type='monotone'
                dataKey='hired'
                stroke='#16a34a'
                fillOpacity={1}
                fill='url(#hired)'
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className='bg-white rounded-xl w-[50%] max-md:w-full p-4 '>
          <div className='flex gap-2 text-xl font-bold'>
            <Briefcase className='stroke-2 stroke-red-500' />
            Job Status Distribution
            <div></div>
          </div>
        </div>
      </div>
      {/* Recent Applications */}
      <div className='bg-white w-full p-4 rounded-xl'>
        {/* heading */}
        <div className='flex justify-center gap-1'>
          <UsersRound className='stroke-2 stroke-red-500' />
          <span className='text-xl font-bold '>Recent Applications</span>
        </div>
        {/* Recent Application Table */}
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='p-3 text-left text-sm font-semibold'>
                  Candidate
                </th>
                <th className='p-3 text-left text-sm font-semibold'>
                  Position
                </th>
                <th className='p-3 text-left text-sm font-semibold'>
                  Experience
                </th>
                <th className='hidden lg:table-cell p-3 text-left text-sm font-semibold'>
                  Location
                </th>
                <th className='p-3 text-left text-sm font-semibold'>Skills</th>
                <th className='hidden lg:table-cell p-3 text-left text-sm font-semibold'>
                  Phone
                </th>
                <th className='hidden lg:table-cell p-3 text-left text-sm font-semibold'>
                  Applied Date
                </th>
                <th className='p-3 text-left text-sm font-semibold'>Status</th>
                <th className='p-3 text-left text-sm font-semibold'>Action</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-100'>
              {recentApplicates.map((applicante) => {
                return (
                  <tr className='hover:bg-gray-50'>
                    <td className='p-3'>{applicante.candidate}</td>
                    <td className='p-3'>{applicante.position}</td>
                    <td className='p-3'>{applicante.Experience}</td>
                    <td className='hidden lg:table-cell p-3'>
                      {applicante.Location}
                    </td>
                    <td className='p-3'>
                      {applicante.Skills.map((skill) => {
                        return skill + ', '
                      })}
                    </td>
                    <td className='hidden lg:table-cell p-3'>
                      {applicante.Phone}
                    </td>
                    <td className='hidden lg:table-cell p-3'>
                      {applicante.AppliedDate}
                    </td>
                    <td className='p-3'>
                      <span
                        className={`px-2 py-1 text-xs rounded-full  ${
                          applicante.Status === 'Active'
                            ? 'text-green-600 bg-green-100'
                            : 'text-red-600 bg-red-100'
                        }`}>
                        {applicante.Status}
                      </span>
                    </td>
                    <td className='p-3'>
                      <button className='text-blue-600 hover:text-blue-800'>
                        View
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
