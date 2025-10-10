import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
    Edit, 
    Trash2, 
    UserPlus, 
    XCircle, 
    Loader2, 
    Search,
    Download,
    Upload,
    Shield,
    Mail,
    IdCard,
    Key,
    FileText,
    Table,
    ChevronDown, // Added for dropdown indicator
    ChevronUp // Added for dropdown indicator
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import api from '../api/axios';
// No need to import './AdminManageRecruiters.css' anymore

export default function AdminManageRecruiters() {
    const [recruiters, setRecruiters] = useState([]);
    const [filteredRecruiters, setFilteredRecruiters] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        employeeID: '',
        email: '',
        password: ''
    });
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [importing, setImporting] = useState(false);
    const [showExportMenu, setShowExportMenu] = useState(false);
    
    const fileInputRef = useRef(null);
    const exportMenuRef = useRef(null);

    const fetchRecruiters = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/recruiters');
            setRecruiters(data);
            setFilteredRecruiters(data);
            setError('');
        } catch (error) {
            console.error("Failed to fetch recruiters:", error);
            setError('Failed to fetch recruiters. Please ensure the backend is running.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRecruiters();
    }, [fetchRecruiters]);

    // Close export menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (exportMenuRef.current && !exportMenuRef.current.contains(event.target)) {
                setShowExportMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Filter recruiters based on search term
    useEffect(() => {
        const filtered = recruiters.filter(recruiter =>
            recruiter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            recruiter.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            recruiter.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredRecruiters(filtered);
    }, [searchTerm, recruiters]);

    // Sort functionality
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });

        const sorted = [...filteredRecruiters].sort((a, b) => {
            if (a[key] < b[key]) {
                return direction === 'asc' ? -1 : 1;
            }
            if (a[key] > b[key]) {
                return direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
        setFilteredRecruiters(sorted);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setSubmitting(true);
        
        try {
            if (editingId) {
                await api.put(`/recruiters/${editingId}`, formData);
                setSuccess('Recruiter updated successfully!');
            } else {
                await api.post('/recruiters/register', formData);
                setSuccess('Recruiter added successfully!');
            }
            resetForm();
            await fetchRecruiters();
            
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            console.error("Failed to submit recruiter:", error);
            setError(error.response?.data?.error || 'Failed to save recruiter.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (recruiter) => {
        setFormData({ 
            name: recruiter.name,
            email: recruiter.email,
            employeeID: recruiter.employeeId,
            password: '' 
        });
        setEditingId(recruiter._id);
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this recruiter? This action cannot be undone.")) {
            setDeletingId(id);
            setError('');
            setSuccess('');
            try {
                await api.delete(`/recruiters/${id}`);
                setSuccess('Recruiter deleted successfully!');
                await fetchRecruiters();
                
                setTimeout(() => setSuccess(''), 3000);
            } catch (error) {
                console.error("Failed to delete recruiter:", error);
                setError(error.response?.data?.error || 'Failed to delete recruiter.');
            } finally {
                setDeletingId(null);
            }
        }
    };

    const resetForm = () => {
        setEditingId(null);
        setFormData({
            name: '',
            employeeID: '',
            email: '',
            password: ''
        });
    };

    // Export to Excel
    const exportToExcel = () => {
        try {
            const excelData = recruiters.map(recruiter => ({
                'Name': recruiter.name,
                'Email': recruiter.email,
                'Employee ID': recruiter.employeeId,
                'Status': 'Active',
                'Created Date': new Date(recruiter.createdAt).toLocaleDateString()
            }));

            const worksheet = XLSX.utils.json_to_sheet(excelData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Recruiters');
            
            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            const data = new Blob([excelBuffer], { 
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
            });
            
            saveAs(data, `recruiters-export-${new Date().toISOString().split('T')[0]}.xlsx`);
            
            setSuccess('Recruiters exported to Excel successfully!');
            setShowExportMenu(false);
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            console.error('Export to Excel error:', error);
            setError('Failed to export to Excel. Please try again.');
        }
    };

    // Export to JSON
    const exportToJSON = () => {
        const dataStr = JSON.stringify(recruiters, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `recruiters-export-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
        
        setSuccess('Recruiters exported to JSON successfully!');
        setShowExportMenu(false);
        setTimeout(() => setSuccess(''), 3000);
    };

    // Import from Excel
    const handleImportExcel = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Check file type
        if (!file.name.match(/\.(xlsx|xls)$/)) {
            setError('Please select a valid Excel file (.xlsx or .xls)');
            return;
        }

        setImporting(true);
        setError('');
        setSuccess('');

        const reader = new FileReader();
        
        reader.onload = async (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                
                const worksheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[worksheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);
                
                if (jsonData.length === 0) {
                    throw new Error('The Excel file is empty or has no data.');
                }

                const processedData = jsonData.map((row, index) => {
                    if (!row['Name'] || !row['Email'] || !row['Employee ID']) {
                        throw new Error(`Row ${index + 2}: Missing required fields (Name, Email, Employee ID)`);
                    }
                    
                    return {
                        name: row['Name'].toString().trim(),
                        email: row['Email'].toString().trim().toLowerCase(),
                        employeeID: row['Employee ID'].toString().trim(),
                        password: 'DefaultPassword123!' // You can modify this
                    };
                });

                let successCount = 0;
                let errorCount = 0;
                const errors = [];

                for (const [index, recruiterData] of processedData.entries()) {
                    try {
                        await api.post('/recruiters/register', recruiterData);
                        successCount++;
                    } catch (error) {
                        errorCount++;
                        errors.push(`Row ${index + 2}: ${recruiterData.email} - ${error.response?.data?.message || 'Failed to create'}`);
                    }
                }

                await fetchRecruiters();

                if (errorCount === 0) {
                    setSuccess(`✅ Successfully imported ${successCount} recruiters!`);
                } else {
                    setSuccess(`📊 Import completed: ${successCount} successful, ${errorCount} failed`);
                    if (errors.length > 0) {
                        console.error('Import errors:', errors);
                    }
                }

                setTimeout(() => setSuccess(''), 5000);

            } catch (error) {
                console.error('Import error:', error);
                setError(`❌ Import failed: ${error.message}`);
            } finally {
                setImporting(false);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            }
        };

        reader.onerror = () => {
            setError('❌ Failed to read the file. Please try again.');
            setImporting(false);
        };

        reader.readAsArrayBuffer(file);
    };

    // Download Excel Template
    const downloadTemplate = () => {
        const templateData = [
            {
                'Name': 'John Doe',
                'Email': 'john.doe@example.com',
                'Employee ID': 'EMP001'
            },
            {
                'Name': 'Jane Smith',
                'Email': 'jane.smith@example.com',
                'Employee ID': 'EMP002'
            }
        ];

        const worksheet = XLSX.utils.json_to_sheet(templateData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');
        
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { 
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
        });
        
        saveAs(data, 'recruiters-import-template.xlsx');
        
        setSuccess('📋 Template downloaded successfully!');
        setTimeout(() => setSuccess(''), 3000);
    };


    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 font-sans">
            <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8">
                {/* Header Section */}
                <div className="mb-8 p-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-500 rounded-full">
                            <Shield className="w-8 h-8 sm:w-10 sm:h-10" />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold">Manage Recruiters</h1>
                            <p className="text-blue-200 text-sm sm:text-base">
                                Add, update, or remove recruiter accounts from the system
                            </p>
                        </div>
                    </div>
                    <div className="bg-blue-700/50 backdrop-blur-sm px-5 py-2 rounded-lg text-center shadow-inner">
                        <div className="text-3xl sm:text-4xl font-extrabold">{recruiters.length}</div>
                        <div className="text-blue-200 text-sm">Total Recruiters</div>
                    </div>
                </div>

                {/* Alert Messages */}
                {error && (
                    <div className="mb-6 p-4 flex items-center bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-sm animate-fade-in" role="alert">
                        <XCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                        <span className="text-sm font-medium">{error}</span>
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-4 flex items-center bg-green-100 border border-green-400 text-green-700 rounded-lg shadow-sm animate-fade-in" role="alert">
                        <div className="w-5 h-5 mr-3 flex-shrink-0 text-lg font-bold">✓</div>
                        <span className="text-sm font-medium">{success}</span>
                    </div>
                )}

                {/* Add/Edit Form */}
                <form onSubmit={handleSubmit} className="mb-10 p-6 bg-gray-50 rounded-lg shadow-md border border-gray-200">
                    <div className="mb-6 pb-4 border-b border-gray-200 flex items-center justify-between">
                        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                            {editingId ? 'Edit Recruiter' : 'Add New Recruiter'}
                        </h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="relative">
                           
                            <input 
                                name="name" 
                                value={formData.name} 
                                onChange={handleChange} 
                                placeholder="Full Name" 
                                required 
                                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-700"
                            />
                        </div>

                        <div className="relative">
                            
                            <input 
                                name="email" 
                                type="email" 
                                value={formData.email} 
                                onChange={handleChange} 
                                placeholder="Email Address" 
                                required 
                                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-700"
                            />
                        </div>

                        <div className="relative">
                            
                            <input 
                                name="employeeID" 
                                value={formData.employeeID} 
                                onChange={handleChange} 
                                placeholder="Employee ID" 
                                required 
                                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-700"
                            />
                        </div>

                        <div className="relative">
                           
                            <input 
                                name="password" 
                                type="password" 
                                value={formData.password} 
                                onChange={handleChange} 
                                placeholder={editingId ? "New Password (Optional)" : "Password"} 
                                required={!editingId} 
                                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-700"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4">
                        {editingId && (
                            <button 
                                type="button" 
                                onClick={resetForm} 
                                className="flex items-center px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 transition duration-200 text-sm font-medium"
                            >
                                <XCircle className="w-4 h-4 mr-2" />
                                Cancel Edit
                            </button>
                        )}
                        <button 
                            type="submit" 
                            disabled={submitting} 
                            className="flex items-center px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    {editingId ? 'Updating...' : 'Adding...'}
                                </>
                            ) : (
                                <>
                                    <UserPlus className="w-4 h-4 mr-2" />
                                    {editingId ? 'Update Recruiter' : 'Add Recruiter'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
 <br />
                {/* Recruiters Table Section */}
                <div className="bg-white rounded-lg shadow-md border border-gray-200">
                    <div className="p-5 border-b border-gray-200">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">All Recruiters</h2>
                            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                                <div className="relative w-full sm:w-auto">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Search recruiters..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 pr-4 py-2 w-full sm:w-64 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-700 text-sm"
                                    />
                                </div>
                                
                                <div className="flex flex-wrap items-center gap-3">
                                    {/* Import Excel */}
                                    <div className="relative">
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleImportExcel}
                                            accept=".xlsx, .xls"
                                            className="hidden"
                                            id="excel-import"
                                        />
                                        <button 
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={importing}
                                            className="flex items-center px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                                        >
                                            {importing ? (
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            ) : (
                                                <Upload className="w-4 h-4 mr-2" />
                                            )}
                                            {importing ? 'Importing...' : 'Import Excel'}
                                        </button>
                                    </div>

                                    {/* Download Template */}
                                    <button 
                                        onClick={downloadTemplate}
                                        className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition duration-200 text-sm font-medium"
                                    >
                                        <FileText className="w-4 h-4 mr-2" />
                                        Template
                                    </button>

                                    {/* Export Dropdown */}
                                    <div className="relative" ref={exportMenuRef}>
                                        <button 
                                            className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200 text-sm font-medium"
                                            onClick={() => setShowExportMenu(!showExportMenu)}
                                        >
                                            <Download className="w-4 h-4 mr-2" />
                                            Export {showExportMenu ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
                                        </button>
                                        {showExportMenu && (
                                            <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-xl py-1 z-10 border border-gray-200">
                                                <button 
                                                    onClick={exportToExcel}
                                                    className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                    <Table className="w-4 h-4 mr-2" />
                                                    Export Excel
                                                </button>
                                                <button 
                                                    onClick={exportToJSON}
                                                    className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                    <FileText className="w-4 h-4 mr-2" />
                                                    Export JSON
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th 
                                        scope="col" 
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                                        onClick={() => handleSort('name')}
                                    >
                                        <div className="flex items-center">
                                            Name
                                            {sortConfig.key === 'name' && (
                                                <span className="ml-2">
                                                    {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                                </span>
                                            )}
                                        </div>
                                    </th>
                                    <th 
                                        scope="col" 
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                                        onClick={() => handleSort('email')}
                                    >
                                        <div className="flex items-center">
                                            Email
                                            {sortConfig.key === 'email' && (
                                                <span className="ml-2">
                                                    {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                                </span>
                                            )}
                                        </div>
                                    </th>
                                    <th 
                                        scope="col" 
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                                        onClick={() => handleSort('employeeId')}
                                    >
                                        <div className="flex items-center">
                                            Employee ID
                                            {sortConfig.key === 'employeeId' && (
                                                <span className="ml-2">
                                                    {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                                </span>
                                            )}
                                        </div>
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {loading ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-10 text-center text-gray-500">
                                            <div className="flex flex-col items-center justify-center">
                                                <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-3" />
                                                <span className="text-lg font-medium">Loading recruiters...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredRecruiters.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-10 text-center text-gray-500">
                                            <div className="flex flex-col items-center justify-center">
                                                <UserPlus className="w-10 h-10 text-gray-400 mb-3" />
                                                <span className="text-lg font-medium">No recruiters found</span>
                                                {searchTerm && (
                                                    <button 
                                                        onClick={() => setSearchTerm('')}
                                                        className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200 text-sm"
                                                    >
                                                        Clear search
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredRecruiters.map(recruiter => (
                                        <tr key={recruiter._id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {recruiter.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {recruiter.email}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                    {recruiter.employeeId}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex items-center space-x-3">
                                                    <button 
                                                        onClick={() => handleEdit(recruiter)} 
                                                        className="flex items-center text-blue-600 hover:text-blue-900 transition duration-150 ease-in-out hover:scale-105"
                                                        title="Edit Recruiter"
                                                    >
                                                        <Edit className="w-4 h-4 mr-1" />
                                                        Edit
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(recruiter._id)} 
                                                        disabled={deletingId === recruiter._id}
                                                        className="flex items-center text-red-600 hover:text-red-900 transition duration-150 ease-in-out hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                                        title="Delete Recruiter"
                                                    >
                                                        {deletingId === recruiter._id ? (
                                                            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                                        ) : (
                                                            <Trash2 className="w-4 h-4 mr-1" />
                                                        )}
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Table Footer */}
                    <div className="p-5 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-600">
                        <div className="mb-2 sm:mb-0">
                            Showing <strong className="font-semibold">{filteredRecruiters.length}</strong> of{' '}
                            <strong className="font-semibold">{recruiters.length}</strong> recruiters
                            {searchTerm && (
                                <span className="ml-1">
                                    {' '}for "<strong className="font-semibold">{searchTerm}</strong>"
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Export the component as before
export { AdminManageRecruiters };
