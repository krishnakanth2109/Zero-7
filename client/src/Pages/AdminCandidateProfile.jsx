const AdminCandidateProfile = () => {
  return (
    <div className='min-h-screen bg-gray-100 p-8'>
      <div className='max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden'>
        {/* Profile Header */}
        <div className='relative bg-gradient-to-r from-purple-600 to-blue-600 h-40 flex items-center justify-center'>
          <div className='absolute top-0 right-0 p-4'>
            <button className='bg-white text-purple-700 px-4 py-2 rounded-full shadow hover:bg-gray-100 transition duration-300'>
              Edit Profile
            </button>
          </div>
          <div className='text-center'>
            <h1 className='text-white text-3xl font-bold mt-3'>John Doe</h1>
            <p className='text-white text-lg'>Software Engineer</p>
          </div>
        </div>

        {/* Profile Content */}
        <div className='p-8 space-y-8'>
          {/* Personal Information */}
          <section className='bg-gray-50 p-6 rounded-lg shadow-sm'>
            <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
              Personal Information
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <p className='text-gray-600 font-medium'>Full Name:</p>
                <p className='text-gray-800'>John Doe</p>
              </div>
              <div>
                <p className='text-gray-600 font-medium'>Date of Birth:</p>
                <p className='text-gray-800'>January 1, 1990</p>
              </div>
              <div>
                <p className='text-gray-600 font-medium'>Location:</p>
                <p className='text-gray-800'>San Francisco, CA</p>
              </div>
              <div>
                <p className='text-gray-600 font-medium'>Availability:</p>
                <p className='text-gray-800'>Immediately</p>
              </div>
            </div>
          </section>

          {/* Contact Details */}
          <section className='bg-gray-50 p-6 rounded-lg shadow-sm'>
            <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
              Contact Details
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <p className='text-gray-600 font-medium'>Email:</p>
                <p className='text-blue-600 hover:underline'>
                  john.doe@example.com
                </p>
              </div>
              <div>
                <p className='text-gray-600 font-medium'>Phone:</p>
                <p className='text-gray-800'>+1 (555) 123-4567</p>
              </div>
              <div>
                <p className='text-gray-600 font-medium'>LinkedIn:</p>
                <a
                  href='https://linkedin.com/in/johndoe'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-blue-600 hover:underline'>
                  linkedin.com/in/johndoe
                </a>
              </div>
              <div>
                <p className='text-gray-600 font-medium'>GitHub:</p>
                <a
                  href='https://github.com/johndoe'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-blue-600 hover:underline'>
                  github.com/johndoe
                </a>
              </div>
            </div>
          </section>

          {/* Education */}
          <section className='bg-gray-50 p-6 rounded-lg shadow-sm'>
            <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
              Education
            </h2>
            <div className='space-y-4'>
              <div>
                <h3 className='text-xl font-medium text-gray-800'>
                  Master of Science in Computer Science
                </h3>
                <p className='text-gray-700'>Stanford University - 2013-2015</p>
                <p className='text-gray-600'>
                  Specialization in Artificial Intelligence
                </p>
              </div>
              <div>
                <h3 className='text-xl font-medium text-gray-800'>
                  Bachelor of Science in Computer Engineering
                </h3>
                <p className='text-gray-700'>
                  University of California, Berkeley - 2009-2013
                </p>
                <p className='text-gray-600'>Graduated with Honors</p>
              </div>
            </div>
          </section>

          {/* Work Experience */}
          <section className='bg-gray-50 p-6 rounded-lg shadow-sm'>
            <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
              Work Experience
            </h2>
            <div className='space-y-6'>
              <div>
                <h3 className='text-xl font-medium text-gray-800'>
                  Senior Software Engineer
                </h3>
                <p className='text-gray-700'>
                  Tech Solutions Inc. - March 2018 - Present
                </p>
                <ul className='list-disc list-inside text-gray-600 mt-2 space-y-1'>
                  <li>
                    Led a team of 5 engineers in developing scalable backend
                    services.
                  </li>
                  <li>
                    Designed and implemented new features, resulting in a 20%
                    increase in user engagement.
                  </li>
                  <li>
                    Mentored junior developers and conducted code reviews.
                  </li>
                </ul>
              </div>
              <div>
                <h3 className='text-xl font-medium text-gray-800'>
                  Software Developer
                </h3>
                <p className='text-gray-700'>
                  Innovate Corp. - June 2015 - February 2018
                </p>
                <ul className='list-disc list-inside text-gray-600 mt-2 space-y-1'>
                  <li>
                    Developed and maintained web applications using React and
                    Node.js.
                  </li>
                  <li>
                    Collaborated with product managers to define project
                    requirements.
                  </li>
                  <li>Contributed to database design and optimization.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Skills */}
          <section className='bg-gray-50 p-6 rounded-lg shadow-sm'>
            <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
              Skills
            </h2>
            <div className='flex flex-wrap gap-3'>
              <span className='bg-blue-200 text-blue-800 px-4 py-1 rounded-full text-sm font-medium'>
                JavaScript
              </span>
              <span className='bg-blue-200 text-blue-800 px-4 py-1 rounded-full text-sm font-medium'>
                React
              </span>
              <span className='bg-blue-200 text-blue-800 px-4 py-1 rounded-full text-sm font-medium'>
                Node.js
              </span>
              <span className='bg-blue-200 text-blue-800 px-4 py-1 rounded-full text-sm font-medium'>
                Python
              </span>
              <span className='bg-blue-200 text-blue-800 px-4 py-1 rounded-full text-sm font-medium'>
                AWS
              </span>
              <span className='bg-blue-200 text-blue-800 px-4 py-1 rounded-full text-sm font-medium'>
                SQL
              </span>
              <span className='bg-blue-200 text-blue-800 px-4 py-1 rounded-full text-sm font-medium'>
                Docker
              </span>
              <span className='bg-blue-200 text-blue-800 px-4 py-1 rounded-full text-sm font-medium'>
                Git
              </span>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default AdminCandidateProfile
