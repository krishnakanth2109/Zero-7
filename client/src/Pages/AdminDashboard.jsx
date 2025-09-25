import { Calendar, UsersRound } from 'lucide-react'
import './AdminDashboard.css'

export default function AdminDashboard() {
  return (
    <div className='flex flex-col gap-4'>
      <div className='admin-main flex-1 rounded-2xl p-6 border-border flex flex-col md:flex-row items-start md:items-center justify-between'>
        <div>
          <h2 className='text-2xl'>Welcome back!</h2>
          <span>Here&apos;s your recruitment dashboard today.</span>
        </div>
        <div className='flex items-center gap-2'>
          <button className='schedule-button flex items-center text-sm'>
            <Calendar className='icons mr-3 ' /> Schedule Interview
          </button>
          <button className='add-candidate flex items-center text-sm'>
            <UsersRound className='icons mr-3 ' /> Add Candidate
          </button>
        </div>
      </div>
      {/* Card Container */}
      <div className='flex gap-3'>
        <div className='bg-white rounded-2xl'>
          <h1>First Card</h1>
        </div>
        <div className='bg-white rounded-2xl'>
          <h1>Second Card</h1>
        </div>
        <div className='bg-white rounded-2xl'>
          <h1>Third Card</h1>
        </div>
        <div className='bg-white rounded-2xl'>
          <h1>Fourth Card</h1>
        </div>
      </div>
    </div>
  )
}
