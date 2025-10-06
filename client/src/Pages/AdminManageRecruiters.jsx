// File: src/Pages/AdminManageRecruiters.jsx

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
    Table
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import api from '../api/axios';
import './AdminManageRecruiters.css';

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

    const inputFieldClass = "admin-input-field";
    const buttonPrimaryClass = "admin-btn-primary";
    const buttonSecondaryClass = "admin-btn-secondary";

    return (
        <div className="admin-recruiters-container">
            <div className="admin-recruiters-content">
                {/* Header Section */}
                <div className="admin-header">
                    <div className="header-main">
                        <div className="header-icon">
                            <Shield className="icon-large" />
                        </div>
                        <div className="header-text">
                            <h1 className="header-title">Manage Recruiters</h1>
                            <p className="header-subtitle">
                                Add, update, or remove recruiter accounts from the system
                            </p>
                        </div>
                    </div>
                    <div className="header-stats">
                        <div className="stat-card">
                            <div className="stat-number">{recruiters.length}</div>
                            <div className="stat-label">Total Recruiters</div>
                        </div>
                    </div>
                </div>

                {/* Alert Messages */}
                {error && (
                    <div className="alert alert-error animate-fade-in">
                        <XCircle className="alert-icon" />
                        <span>{error}</span>
                    </div>
                )}

                {success && (
                    <div className="alert alert-success animate-fade-in">
                        <div className="success-icon">✓</div>
                        <span>{success}</span>
                    </div>
                )}

                {/* Add/Edit Form */}
                <form onSubmit={handleSubmit} className="admin-form">
                    <div className="form-header">
                        <h2 className="form-title">
                            {editingId ? 'Edit Recruiter' : 'Add New Recruiter'}
                        </h2>
                        <div className="form-decoration"></div>
                    </div>
                    
                    <div className="form-grid">
                        <div className="input-group">
                            <div className="input-icon">
                                <UserPlus className="icon-small" />
                            </div>
                            <input 
                                name="name" 
                                value={formData.name} 
                                onChange={handleChange} 
                                placeholder="Full Name" 
                                required 
                                className={inputFieldClass}
                            />
                        </div>

                        <div className="input-group">
                            <div className="input-icon">
                                <Mail className="icon-small" />
                            </div>
                            <input 
                                name="email" 
                                type="email" 
                                value={formData.email} 
                                onChange={handleChange} 
                                placeholder="Email Address" 
                                required 
                                className={inputFieldClass}
                            />
                        </div>

                        <div className="input-group">
                            <div className="input-icon">
                                <IdCard className="icon-small" />
                            </div>
                            <input 
                                name="employeeID" 
                                value={formData.employeeID} 
                                onChange={handleChange} 
                                placeholder="Employee ID" 
                                required 
                                className={inputFieldClass}
                            />
                        </div>

                        <div className="input-group">
                            <div className="input-icon">
                                <Key className="icon-small" />
                            </div>
                            <input 
                                name="password" 
                                type="password" 
                                value={formData.password} 
                                onChange={handleChange} 
                                placeholder={editingId ? "New Password (Optional)" : "Password"} 
                                required={!editingId} 
                                className={inputFieldClass}
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        {editingId && (
                            <button 
                                type="button" 
                                onClick={resetForm} 
                                className={buttonSecondaryClass}
                            >
                                Cancel Edit
                            </button>
                        )}
                        <button 
                            type="submit" 
                            disabled={submitting} 
                            className={buttonPrimaryClass}
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="button-icon animate-spin" />
                                    {editingId ? 'Updating...' : 'Adding...'}
                                </>
                            ) : (
                                <>
                                    <UserPlus className="button-icon" />
                                    {editingId ? 'Update Recruiter' : 'Add Recruiter'}
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {/* Recruiters Table Section */}
                <div className="admin-table-section">
                    <div className="table-header">
                        <div className="table-title-section">
                            <h2 className="table-title">All Recruiters</h2>
                            <div className="table-actions">
                                <div className="search-box">
                                    <Search className="search-icon" />
                                    <input
                                        type="text"
                                        placeholder="Search recruiters..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="search-input"
                                    />
                                </div>
                                
                                <div className="import-export-actions">
                                    {/* Import Excel */}
                                    <div className="file-input-wrapper">
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleImportExcel}
                                            accept=".xlsx, .xls"
                                            style={{ display: 'none' }}
                                            id="excel-import"
                                        />
                                        <button 
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={importing}
                                            className="action-btn"
                                        >
                                            {importing ? (
                                                <Loader2 className="action-icon animate-spin" />
                                            ) : (
                                                <Upload className="action-icon" />
                                            )}
                                            {importing ? 'Importing...' : 'Import Excel'}
                                        </button>
                                    </div>

                                    {/* Download Template */}
                                    <button 
                                        onClick={downloadTemplate}
                                        className="action-btn"
                                    >
                                        <FileText className="action-icon" />
                                        Template
                                    </button>

                                    {/* Export Dropdown */}
                                    <div className="export-dropdown" ref={exportMenuRef}>
                                        <button 
                                            className="action-btn"
                                            onClick={() => setShowExportMenu(!showExportMenu)}
                                        >
                                            <Download className="action-icon" />
                                            Export
                                        </button>
                                        {showExportMenu && (
                                            <div className="export-menu">
                                                <button onClick={exportToExcel}>
                                                    <Table className="action-icon" />
                                                    Export Excel
                                                </button>
                                                <button onClick={exportToJSON}>
                                                    <FileText className="action-icon" />
                                                    Export JSON
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="table-container">
                        <table className="admin-table">
                            <thead className="table-header">
                                <tr>
                                    <th 
                                        scope="col" 
                                        className="table-header-cell sortable"
                                        onClick={() => handleSort('name')}
                                    >
                                        Name
                                        {sortConfig.key === 'name' && (
                                            <span className="sort-indicator">
                                                {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                            </span>
                                        )}
                                    </th>
                                    <th 
                                        scope="col" 
                                        className="table-header-cell sortable"
                                        onClick={() => handleSort('email')}
                                    >
                                        Email
                                        {sortConfig.key === 'email' && (
                                            <span className="sort-indicator">
                                                {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                            </span>
                                        )}
                                    </th>
                                    <th 
                                        scope="col" 
                                        className="table-header-cell sortable"
                                        onClick={() => handleSort('employeeId')}
                                    >
                                        Employee ID
                                        {sortConfig.key === 'employeeId' && (
                                            <span className="sort-indicator">
                                                {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                            </span>
                                        )}
                                    </th>
                                    <th scope="col" className="table-header-cell actions-header">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="table-body">
                                {loading ? (
                                    <tr>
                                        <td colSpan="4" className="table-loading-cell">
                                            <div className="loading-content">
                                                <Loader2 className="loading-icon animate-spin" />
                                                <span>Loading recruiters...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredRecruiters.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="table-empty-cell">
                                            <div className="empty-content">
                                                <UserPlus className="empty-icon" />
                                                <span>No recruiters found</span>
                                                {searchTerm && (
                                                    <button 
                                                        onClick={() => setSearchTerm('')}
                                                        className="clear-search-btn"
                                                    >
                                                        Clear search
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredRecruiters.map(recruiter => (
                                        <tr key={recruiter._id} className="table-row">
                                            <td className="table-cell name-cell">
                                                <div className="recruiter-name">
                                                    {recruiter.name}
                                                </div>
                                            </td>
                                            <td className="table-cell email-cell">
                                                {recruiter.email}
                                            </td>
                                            <td className="table-cell id-cell">
                                                <span className="employee-id-badge">
                                                    {recruiter.employeeId}
                                                </span>
                                            </td>
                                            <td className="table-cell actions-cell">
                                                <div className="action-buttons">
                                                    <button 
                                                        onClick={() => handleEdit(recruiter)} 
                                                        className="edit-btn"
                                                    >
                                                        <Edit className="btn-icon" />
                                                        Edit
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(recruiter._id)} 
                                                        disabled={deletingId === recruiter._id}
                                                        className="delete-btn"
                                                    >
                                                        {deletingId === recruiter._id ? (
                                                            <Loader2 className="btn-icon animate-spin" />
                                                        ) : (
                                                            <Trash2 className="btn-icon" />
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
                    <div className="table-footer">
                        <div className="footer-info">
                            Showing <strong>{filteredRecruiters.length}</strong> of{' '}
                            <strong>{recruiters.length}</strong> recruiters
                            {searchTerm && (
                                <span className="search-info">
                                    {' '}for "<strong>{searchTerm}</strong>"
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export { AdminManageRecruiters };