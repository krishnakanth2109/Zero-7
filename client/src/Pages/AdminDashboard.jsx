// File: src/Pages/AdminDashboard.jsx

import { useState, useEffect } from 'react'
import Cookie from 'js-cookie'
import {
  Briefcase,
  UserCheck,
  UsersRound,
  Building2,
  TrendingUp,
  BookUser,
  School,
  Award,
} from 'lucide-react'
import api from '../api/axios' // Import the central axios instance
import './AdminDashboard.css'
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import RecentActivity from '../Components/RecentActivity'

// Helper function to capitalize the first letter of a string
const capitalize = (s) => {
  if (typeof s !== 'string' || !s) return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export default function AdminDashboard() {
  const [user, setUser] = useState({})
  const [applications, setApplications] = useState([])

  // State for the dynamic graph data
  const [trendData, setTrendData] = useState([])

  const [stats, setStats] = useState({
    totalCandidates: 0,
    activeJobs: 0,
    benchRequests: 0,
    partnerCompanies: 0,
    colleges: 0,
    placements: 0,
    interviews: 0,
  })
  const [loadingStats, setLoadingStats] = useState(true)

  useEffect(() => {
    // Logic to get user info from cookie
    const userData = Cookie.get('user')
    if (userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (error) {
        console.error('Invalid user data in cookie:', error)
      }
    }

    // Main fetch function for all dashboard data
    const fetchDashboardData = async () => {
      try {
        // Fetch all required endpoints in parallel
        const [
          candidatesResponse,
          jobsResponse,
          requestsResponse,
          companiesResponse,
          interviewsResponse,
          collegeResponse,
          applicationsResponse, // Fetch applications here to coordinate graph data
        ] = await Promise.all([
          api.get('/candidates').catch((e) => ({ data: [] })),
          api.get('/jobs').catch((e) => ({ data: [] })),
          api.get('/candidates/pendings').catch((e) => ({ data: [] })),
          api.get('/company').catch((e) => ({ data: [] })),
          api.get('/interview/all').catch((e) => ({ data: [] })),
          api.get('/college-connect').catch((e) => ({ data: [] })),
          api.get('/applications').catch((e) => ({ data: [] })),
        ])

        // 1. Process Stats
        const pendingRequests = requestsResponse.data.filter(
          (req) => req.status === 'pending',
        )

        // Logic: Check status/level AND ensure approvalStatus is 'approved' to match the list view
        const placedCandidates = interviewsResponse.data.filter(
          (req) =>
            (req.status?.toLowerCase() === 'placed' || req.interviewLevel === 'placed') &&
            req.approvalStatus === 'approved'
        )

        setStats({
          totalCandidates: candidatesResponse.data.length,
          activeJobs: jobsResponse.data.length,
          benchRequests: pendingRequests.length,
          partnerCompanies: companiesResponse.data.length,
          colleges: collegeResponse.data.length,
          placements: placedCandidates.length,
          interviews: interviewsResponse.data.length,
        })

        // 2. Set Applications Table Data
        setApplications(applicationsResponse.data)

        // 3. Process Graph Data (Application Trends)
        calculateGraphTrends(applicationsResponse.data, interviewsResponse.data)

      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error)
      } finally {
        setLoadingStats(false)
      }
    }

    fetchDashboardData()
  }, [])

  // Function to process raw data into monthly trends for the chart
  const calculateGraphTrends = (appsData, interviewsData) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();

    // Initialize structure
    const monthlyStats = months.map(m => ({
      month: m,
      applications: 0,
      interviews: 0,
      hired: 0
    }));

    // Count Applications per month
    appsData.forEach(app => {
      const date = new Date(app.createdAt || app.date);
      // Optional: Filter for current year only
      if (date.getFullYear() === currentYear) {
        monthlyStats[date.getMonth()].applications += 1;
      }
    });

    // Count Interviews and Hires per month
    interviewsData.forEach(int => {
      const date = new Date(int.date || int.createdAt);
      if (date.getFullYear() === currentYear) {
        monthlyStats[date.getMonth()].interviews += 1;

        // Only count as hired if status is placed AND approved
        if (
          (int.status?.toLowerCase() === 'placed' || int.interviewLevel === 'placed') &&
          int.approvalStatus === 'approved'
        ) {
          monthlyStats[date.getMonth()].hired += 1;
        }
      }
    });

    // Determine current month index to slice the array (optional: show only up to current month)
    const currentMonthIndex = new Date().getMonth();
    // Showing data up to the current month
    const relevantData = monthlyStats.slice(0, currentMonthIndex + 1);

    setTrendData(relevantData.length > 0 ? relevantData : monthlyStats);
  };

  // Data for the Pie Chart (Job Status Distribution)
  const pieChartData = [
    { name: 'Candidates', value: stats.totalCandidates },
    { name: 'Total Jobs', value: stats.activeJobs },
    { name: 'Placements', value: stats.placements },
    { name: 'Interviews', value: stats.interviews },
  ]

  const PIE_CHART_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']
  const RADIAN = Math.PI / 180

  // Custom label renderer for the Pie Chart
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text
        x={x}
        y={y}
        fill='white'
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline='central'>
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  // Reusable StatCard component
  const StatCard = ({ title, value, subtext, icon, percentage, path }) => (
    <a href={path}>
      <div className='bg-white rounded-2xl p-4 hover:shadow-xl flex flex-col gap-1'>
        <div className='flex items-center justify-between'>
          <div className='bg-[#7eade0] p-2 rounded-lg'>{icon}</div>
          {percentage && <p className='text-[#16a34a]'>{percentage}</p>}
        </div>
        <div  >
          <h1 className='text-decoration-none text-3xl font-bold mt-3'>
            {loadingStats ? '...' : value}
          </h1>
          <p className='text-lg font-semibold text-[#267edc]'>{title}</p>
          <p className='text-sm text-[#64748b]'>{subtext}</p>
        </div>
      </div>
    </a>
  )

  return (
    <div className='flex flex-col gap-4 overflow-auto'>
      <div
        className="admin-main rounded-2xl p-6 border-border flex items-center justify-center"
        style={{
          width: '100%',
          height: '20vh',
          minHeight: '20vh',
          maxHeight: '20vh',
          maxWidth: '1200px',
          margin: '0 auto',
          flex: '0 0 auto',
        }}
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold">
            Welcome back, {capitalize(user.name) || 'Admin'}!
          </h1>
          <span>Here&apos;s your {user.role} dashboard today.</span>
        </div>
      </div>



      {/* Card Container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ">

        <StatCard
          title='Total Candidates'
          value={stats.totalCandidates}
          subtext='on bench'
          icon={<UsersRound className='stroke-[#0b325b] stroke-2' />}
          percentage='+12%'
          path='manage-candidates'
        />
        <StatCard
          title='Total Jobs'
          value={stats.activeJobs}
          subtext='new this week'
          icon={<Briefcase className='stroke-[#0b325b] stroke-2' />}
          percentage='+3%'
          path='manage-jobs'
        />
        {user.role !== 'recruiter' && (
          <StatCard
            title='Bench Requests'
            value={stats.benchRequests}
            subtext='awaiting approval'
            icon={<UserCheck className='stroke-[#0b325b] stroke-2' />}
            percentage={`+${stats.benchRequests}`}
            path='candidateList'
          />
        )}
        {user.role !== 'recruiter' && (
          <StatCard
            title='Partner Companies'
            value={stats.partnerCompanies}
            subtext='actively hiring'
            icon={<Building2 className='stroke-[#0b325b] stroke-2' />}
            percentage='+12%'
            path='companies'
          />
        )}
        <StatCard
          title='Colleges'
          value={stats.colleges}
          subtext='Colleges under us'
          icon={<School className='stroke-[#0b325b] stroke-2' />}
          percentage='+12%'
        />
        {user.role !== 'recruiter' && (<StatCard
          title='Interviews'
          value={stats.interviews}
          subtext='Interviews scheduled so far'
          icon={<BookUser className='stroke-[#0b325b] stroke-2' />}
          percentage='+12%'
          path='interviews'
        />)}
        <StatCard
          title='Placements'
          value={stats.placements}
          subtext='Candidates Placed'
          icon={<Award className='stroke-[#0b325b] stroke-2' />}
          percentage='+12%'
          path='placedcandidates'
        />
      </div>

      {/* Charts */}
      <div className='flex flex-col md:flex-row gap-4 mt-4'>
        {/* Area Chart */}
        <div className='bg-white rounded-xl w-full md:w-1/2 p-4'>
          <div className='flex gap-2 text-xl font-bold mb-4'>
            <TrendingUp className='stroke-2 stroke-[#0b325b]' />
            Application Trends (Current Year)
          </div>
          <ResponsiveContainer height={300} width='100%'>
            <BarChart
              data={trendData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id='applications' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='5%' stopColor='#d5963eff' stopOpacity={0.8} />
                  <stop offset='95%' stopColor='#d6a258ff' stopOpacity={0} />
                </linearGradient>
                <linearGradient id='interviews' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='5%' stopColor='#63bee8ff' stopOpacity={0.8} />
                  <stop offset='95%' stopColor='#63bee8ff' stopOpacity={0} />
                </linearGradient>
                <linearGradient id='hired' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='5%' stopColor='#319154ff' stopOpacity={0.8} />
                  <stop offset='95%' stopColor='#319154ff' stopOpacity={0} />
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
              <Bar
                type='monotone'
                dataKey='applications'
                stroke='#d6a258ff'
                fillOpacity={1}
                fill='url(#applications)'
              />
              <Bar
                type='monotone'
                dataKey='interviews'
                stroke='#0da2e7'
                fillOpacity={1}
                fill='url(#interviews)'
              />
              <Bar
                type='monotone'
                dataKey='hired'
                stroke='#16a34a'
                fillOpacity={1}
                fill='url(#hired)'
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className='bg-white rounded-xl w-full md:w-1/2 p-4'>
          <div className='flex gap-2 text-xl font-bold mb-4'>
            <Briefcase className='stroke-2 stroke-[#0b325b]' />
            Hiring Overview
          </div>
          <ResponsiveContainer height={300} width='100%'>
            <PieChart>
              <Pie
                data={pieChartData}
                cx='50%'
                cy='50%'
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={120}
                fill='#8884d8'
                dataKey='value'>
                {pieChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${entry.name}`}
                    fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>


      {/* <<< 2. INSERT RECENT ACTIVITY COMPONENT HERE >>> */}
      <RecentActivity />
    </div>
  )
}