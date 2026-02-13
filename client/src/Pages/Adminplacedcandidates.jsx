import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import * as XLSX from 'xlsx';
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet, // Better export icon
  Loader2
} from 'lucide-react';

const PlacedCandidates = () => {
  const [placedCandidates, setPlacedCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchPlacedCandidates = async () => {
    try {
      setLoading(true);
      const response = await api.get('/interview');
      // Filter only placed candidates
      const placed = response.data.filter(
        (interview) => interview.status?.toLowerCase() === 'placed'
      );
      setPlacedCandidates(placed);
    } catch (error) {
      console.error('Error fetching placed candidates:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlacedCandidates();
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(placedCandidates.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCandidates = placedCandidates.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const exportToExcel = () => {
    const exportData = placedCandidates.map((candidate) => ({
      'Candidate Name': candidate.candidateName,
      Company: candidate.companyName,
      'Job Role': candidate.jobRole,
      Level: candidate.interviewLevel,
      'Date Placed': new Date(candidate.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      Status: 'PLACED',
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Placed Candidates');
    const fileName = `placed_candidates_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-gray-50'>
        <div className='text-center p-8 bg-white rounded-xl shadow-lg border border-gray-100'>
          <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className='text-lg text-gray-700 font-semibold'>
            Loading placed candidates...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 p-6 sm:p-10'>
      {/* Header */}
      <header className='flex flex-col sm:flex-row justify-between items-center mb-8 p-6 bg-white rounded-2xl shadow-sm border border-gray-200'>
        <div className='flex items-center mb-4 sm:mb-0'>
          <div className="bg-green-100 p-3 rounded-full mr-4">
            <CheckCircle className='text-green-600 w-8 h-8' />
          </div>
          <div>
            <h1 className='text-2xl sm:text-3xl font-bold text-gray-800'>
              Placed Candidates
            </h1>
            <p className="text-gray-500 text-sm mt-1">Track successful placements</p>
          </div>
        </div>
        
        <div className='flex items-center gap-4'>
          <button
            onClick={exportToExcel}
            className='flex items-center px-5 py-2.5 text-sm font-medium rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all duration-200 transform hover:-translate-y-0.5'>
            <FileSpreadsheet className='w-5 h-5 mr-2' />
            Export Excel
          </button>
          <div className='hidden sm:flex items-center bg-green-50 text-green-700 px-5 py-2.5 rounded-xl border border-green-100 shadow-sm'>
            <span className='mr-2 font-medium'>Total:</span>
            <span className='text-2xl font-bold'>{placedCandidates.length}</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className='max-w-7xl mx-auto'>
        {placedCandidates.length === 0 ? (
          <div className='text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-200'>
            <p className='text-2xl text-gray-400 font-medium'>
              No placed candidates yet.
            </p>
          </div>
        ) : (
          <>
            <div className='overflow-x-auto mb-6 bg-white rounded-2xl shadow-sm border border-gray-200'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className="bg-gray-50">
                  <tr>
                    {['Candidate Name', 'Company', 'Job Role', 'Salary', 'Date of Joining', 'Status'].map((header) => (
                      <th key={header} className='px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider'>
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {currentCandidates.map((candidate) => (
                    <tr
                      key={candidate._id}
                      className="hover:bg-blue-50/50 transition-colors duration-150"
                    >
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='text-sm font-bold text-gray-900'>
                          {candidate.candidateName}
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='text-sm text-gray-600 font-medium'>
                          {candidate.companyName}
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='px-3 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-semibold inline-block'>
                          {candidate.jobRole}
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='text-sm text-gray-600'>
                          {candidate.salary || 'N/A'}
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='text-sm text-gray-600'>
                          {new Date(candidate.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200'>
                          PLACED
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages >= 1 && (
              <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6'>
                <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
                  {/* Items per page selector */}
                  <div className='flex items-center gap-3 text-sm text-gray-600'>
                    <span>Show:</span>
                    <select
                      value={itemsPerPage}
                      onChange={handleItemsPerPageChange}
                      className='border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white'>
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                    <span className="hidden sm:inline">
                      | Showing <span className='font-bold text-gray-900'>{startIndex + 1}-{Math.min(endIndex, placedCandidates.length)}</span> of <span className='font-bold text-gray-900'>{placedCandidates.length}</span>
                    </span>
                  </div>

                  {/* Pagination Controls */}
                  <div className='flex items-center gap-2'>
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className='flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all'>
                      <ChevronLeft className='w-4 h-4 mr-1' />
                      Prev
                    </button>

                    <span className='px-4 text-sm font-medium text-gray-600'>
                      Page {currentPage} of {totalPages}
                    </span>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className='flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all'>
                      Next
                      <ChevronRight className='w-4 h-4 ml-1' />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PlacedCandidates;