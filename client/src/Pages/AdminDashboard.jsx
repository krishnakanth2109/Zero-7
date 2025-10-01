// File: src/Pages/AdminDashboard.jsx

import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import {
  Briefcase,
  UserCheck,
  UsersRound,
  Building2,
  TrendingUp,
  BookUser, // New Icon for Interviews
  School,   // New Icon for Colleges
  Award     // New Icon for Placements
} from 'lucide-react';
import api from '../api/axios'; // Import the central axios instance
import './AdminDashboard.css';
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// Helper function to capitalize the first letter of a string
const capitalize = (s) => {
  if (typeof s !== 'string' || !s) return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export default function AdminDashboard() {
  const [userRole, setUserRole] = useState(null);
  
  // --- START: DYNAMIC STATE FOR ALL CARDS ---
  const [stats, setStats] = useState({
    totalCandidates: 0,
    activeJobs: 0,
    benchRequests: 0,
    partnerCompanies: 0,
    colleges: 0,
    placements: 0,
    interviews: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);
  // --- END: DYNAMIC STATE ---

  useEffect(() => {
    // Logic to get user role from token
    const token = localStorage.getItem('token'); 
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        setUserRole(decodedUser.role);
      } catch (error) {
        console.error('Invalid token:', error);
      }
    }

    // --- START: DYNAMIC DATA FETCHING LOGIC ---
    const fetchStats = async () => {
      try {
        // Fetch all data concurrently for better performance.
        // Added .catch() to each promise to prevent one failed request from stopping all others.
        const [
          candidatesResponse, 
          jobsResponse, 
          requestsResponse, 
          interviewsResponse, 
          collegeResponse
        ] = await Promise.all([
          api.get('/candidates').catch(e => ({ data: [] })),
          api.get('/jobs').catch(e => ({ data: [] })),
          api.get('/request-info').catch(e => ({ data: [] })),
          api.get('/interviews').catch(e => ({ data: [] })),      // Assumes an /interviews endpoint exists
          api.get('/college-connect').catch(e => ({ data: [] })), // Assumes a /college-connect endpoint exists
        ]);

        // Process the fetched data
        const pendingRequests = requestsResponse.data.filter(req => req.status === 'pending');
        const approvedRequests = requestsResponse.data.filter(req => req.status === 'approved');

        // Count unique company names from the requests as "Partner Companies"
        const uniqueCompanies = new Set(requestsResponse.data.map(r => r.companyName));

        setStats({
          totalCandidates: candidatesResponse.data.length,
          activeJobs: jobsResponse.data.length,
          benchRequests: pendingRequests.length,
          partnerCompanies: uniqueCompanies.size,
          colleges: collegeResponse.data.length,
          placements: approvedRequests.length, // Logic: a placement is an approved request
          interviews: interviewsResponse.data.length,
        });

      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
    // --- END: DYNAMIC DATA FETCHING LOGIC ---

  }, []); // The empty array ensures this logic runs only once on component mount

  // Hardcoded data for charts and recent applications table
  const applicationsTrend = [
    { month: 'Jan', applications: 45, interviews: 12, hired: 3 },
    { month: 'Feb', applications: 52, interviews: 18, hired: 5 },
    { month: 'Mar', applications: 78, interviews: 25, hired: 8 },
    { month: 'Apr', applications: 95, interviews: 32, hired: 12 },
    { month: 'May', applications: 115, interviews: 38, hired: 15 },
    { month: 'Jun', applications: 128, interviews: 45, hired: 18 },
  ];

  const recentApplicates = [
    { candidate: 'Joe Doe', position: 'Full Stack Developer', Experience: '3-10 years', Location: 'Hyderabad', Skills: ['React js', 'Node js', 'Docker'], Phone: 8121211111, AppliedDate: '19/09/2025', Status: 'Active', },
    { candidate: 'Sarah Smith', position: 'Frontend Developer', Experience: '2-5 years', Location: 'Bangalore', Skills: ['React js', 'TypeScript', 'CSS'], Phone: 9876543210, AppliedDate: '18/09/2025', Status: 'InActive', },
    { candidate: 'Mike Johnson', position: 'Backend Developer', Experience: '4-8 years', Location: 'Mumbai', Skills: ['Node js', 'Python', 'MongoDB'], Phone: 7654321098, AppliedDate: '17/09/2025', Status: 'Active', },
    { candidate: 'Emily Chen', position: 'DevOps Engineer', Experience: '5-7 years', Location: 'Pune', Skills: ['AWS', 'Docker', 'Kubernetes'], Phone: 8899776655, AppliedDate: '16/09/2025', Status: 'InActive', },
    { candidate: 'Alex Kumar', position: 'UI/UX Designer', Experience: '3-6 years', Location: 'Chennai', Skills: ['Figma', 'Adobe XD', 'Sketch'], Phone: 9988776655, AppliedDate: '15/09/2025', Status: 'Active', },
  ];
  
  // Reusable card component to reduce repetition
  const StatCard = ({ title, value, subtext, icon, percentage }) => (
    <div className='bg-white rounded-2xl p-4 hover:shadow-xl flex flex-col gap-1'>
      <div className='flex items-center justify-between'>
        <div className='bg-red-200 p-2 rounded-lg'>{icon}</div>
        {percentage && <p className='text-[#16a34a]'>{percentage}</p>}
      </div>
      <div>
        <h1 className='text-3xl font-bold mt-3'>{loadingStats ? '...' : value}</h1>
        <p className='text-lg font-semibold text-[#64748b]'>{title}</p>
        <p className='text-sm text-[#64748b]'>{subtext}</p>
      </div>
    </div>
  );

  return (
    <div className='flex flex-col gap-4 overflow-auto'>
      <div className='admin-main flex-1 rounded-2xl p-6 border-border flex flex-col md:flex-row items-start md:items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>
            Welcome back, {capitalize(userRole) || 'Admin'}!
          </h1>
          <span>Here&apos;s your recruitment dashboard today.</span>
        </div>
      </div>
      
      {/* Card Container */}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2'>
        <StatCard title="Total Candidates" value={stats.totalCandidates} subtext="on bench" icon={<UsersRound className='stroke-red-500 stroke-2' />} percentage="+12%" />
        <StatCard title="Active Jobs" value={stats.activeJobs} subtext="new this week" icon={<Briefcase className='stroke-red-500 stroke-2' />} percentage="+3%" />
        <StatCard title="Bench Requests" value={stats.benchRequests} subtext="awaiting approval" icon={<UserCheck className='stroke-red-500 stroke-2' />} percentage={`+${stats.benchRequests}`} />
        <StatCard title="Partner Companies" value={stats.partnerCompanies} subtext="actively hiring" icon={<Building2 className='stroke-red-500 stroke-2' />} percentage="+12%" />
        <StatCard title="Colleges" value={stats.colleges} subtext="Colleges under us" icon={<School className='stroke-red-500 stroke-2' />} percentage="+12%" />
        <StatCard title="Placements" value={stats.placements} subtext="Candidates Placed" icon={<Award className='stroke-red-500 stroke-2' />} percentage="+12%" />
        <StatCard title="Interviews" value={stats.interviews} subtext="Interviews scheduled" icon={<BookUser className='stroke-red-500 stroke-2' />} percentage="+12%" />
      </div>

      {/* Charts */}
      <div className='flex flex-col md:flex-row gap-4 mt-4'>
        <div className='bg-white rounded-xl w-full md:w-1/2 p-4'>
          <div className='flex gap-2 text-xl font-bold mb-4'>
            <TrendingUp className='stroke-2 stroke-red-500' />
            Application Trends
          </div>
          <ResponsiveContainer height={300} width='100%'>
            <AreaChart data={applicationsTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id='applications' x1='0' y1='0' x2='0' y2='1'><stop offset='5%' stopColor='#dc2626' stopOpacity={0.8} /><stop offset='95%' stopColor='#dc2626' stopOpacity={0} /></linearGradient>
                <linearGradient id='interviews' x1='0' y1='0' x2='0' y2='1'><stop offset='5%' stopColor='#0da2e7' stopOpacity={0.8} /><stop offset='95%' stopColor='#0da2e7' stopOpacity={0} /></linearGradient>
                <linearGradient id='hired' x1='0' y1='0' x2='0' y2='1'><stop offset='5%' stopColor='#16a34a' stopOpacity={0.8} /><stop offset='95%' stopColor='#16a34a' stopOpacity={0} /></linearGradient>
              </defs>
              <XAxis dataKey='month' />
              <YAxis />
              <CartesianGrid horizontal={false} vertical={false} strokeDasharray='3 3' />
              <Tooltip />
              <Area type='monotone' dataKey='applications' stroke='#dc2626' fillOpacity={1} fill='url(#applications)' />
              <Area type='monotone' dataKey='interviews' stroke='#0da2e7' fillOpacity={1} fill='url(#interviews)' />
              <Area type='monotone' dataKey='hired' stroke='#16a34a' fillOpacity={1} fill='url(#hired)' />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className='bg-white rounded-xl w-full md:w-1/2 p-4'>
          <div className='flex gap-2 text-xl font-bold'>
            <Briefcase className='stroke-2 stroke-red-500' />
            Job Status Distribution
          </div>
           {/* Placeholder for a second chart */}
        </div>
      </div>
      
      {/* Recent Applications Table */}
      <div className='bg-white w-full p-4 rounded-xl mt-4'>
        <div className='flex justify-center gap-1 mb-4'>
          <UsersRound className='stroke-2 stroke-red-500' />
          <span className='text-xl font-bold'>Recent Applications</span>
        </div>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='p-3 text-left text-sm font-semibold'>Candidate</th>
                <th className='p-3 text-left text-sm font-semibold'>Position</th>
                <th className='p-3 text-left text-sm font-semibold'>Experience</th>
                <th className='hidden lg:table-cell p-3 text-left text-sm font-semibold'>Location</th>
                <th className='p-3 text-left text-sm font-semibold'>Skills</th>
                <th className='hidden lg:table-cell p-3 text-left text-sm font-semibold'>Phone</th>
                <th className='hidden lg:table-cell p-3 text-left text-sm font-semibold'>Applied Date</th>
                <th className='p-3 text-left text-sm font-semibold'>Status</th>
                <th className='p-3 text-left text-sm font-semibold'>Action</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-100'>
              {recentApplicates.map((applicante, index) => (
                <tr key={index} className='hover:bg-gray-50'>
                  <td className='p-3'>{applicante.candidate}</td>
                  <td className='p-3'>{applicante.position}</td>
                  <td className='p-3'>{applicante.Experience}</td>
                  <td className='hidden lg:table-cell p-3'>{applicante.Location}</td>
                  <td className='p-3'>{applicante.Skills.join(', ')}</td>
                  <td className='hidden lg:table-cell p-3'>{applicante.Phone}</td>
                  <td className='hidden lg:table-cell p-3'>{applicante.AppliedDate}</td>
                  <td className='p-3'>
                    <span className={`px-2 py-1 text-xs rounded-full ${applicante.Status === 'Active' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'}`}>
                      {applicante.Status}
                    </span>
                  </td>
                  <td className='p-3'><button className='text-blue-600 hover:text-blue-800'>View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}