// File: src/Pages/AdminViewRequests.jsx (Updated with centered alignment)

import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Eye } from 'lucide-react';
import api from '../api/axios';
import './AdminViewRequests.css';

export default function AdminViewRequests() {
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [actionLoading, setActionLoading] = useState(null);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const { data } = await api.get('/request-info');
                setRequests(data);
            } catch (err) {
                setError("Failed to fetch requests. Please try again.");
                console.error("Fetch requests error:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchRequests();
    }, []);

    const handleApprove = async (requestId) => {
        setActionLoading(requestId);
        try {
            await api.put(`/request-info/${requestId}`, { status: 'approved' });
            setRequests(requests.map(req => 
                req._id === requestId ? { ...req, status: 'approved' } : req
            ));
            alert('Request approved successfully!');
        } catch (err) {
            console.error("Approve request error:", err);
            alert('Failed to approve request. Please try again.');
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (requestId) => {
        setActionLoading(requestId);
        try {
            await api.put(`/request-info/${requestId}`, { status: 'rejected' });
            setRequests(requests.map(req => 
                req._id === requestId ? { ...req, status: 'rejected' } : req
            ));
            alert('Request rejected successfully!');
        } catch (err) {
            console.error("Reject request error:", err);
            alert('Failed to reject request. Please try again.');
        } finally {
            setActionLoading(null);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'approved':
                return { class: 'status-approved', text: 'Approved' };
            case 'rejected':
                return { class: 'status-rejected', text: 'Rejected' };
            default:
                return { class: 'status-pending', text: 'Pending' };
        }
    };

    if (isLoading) return <p>Loading requests...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div className="requests-container">
            <h2>Candidate Information Requests</h2>

            <div className="requests-table-wrapper">
                <table className="requests-table">
                    <thead>
                        <tr>
                            <th className="text-center">Date Received</th>
                            <th className="text-center">Status</th>
                            <th className="text-center">Candidate Name</th>
                            <th className="text-center">Company</th>
                            <th className="text-center">Contact Person</th>
                            <th className="text-center">Requirement</th>
                            <th className="text-center">Details</th>
                            <th className="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.length === 0 ? (
                            <tr>
                                <td colSpan="8" style={{ textAlign: 'center' }}>No requests found.</td>
                            </tr>
                        ) : (
                            requests.map(req => {
                                const statusBadge = getStatusBadge(req.status);
                                const isApproved = req.status === 'approved';
                                const isRejected = req.status === 'rejected';
                                const isPending = !req.status || req.status === 'pending';
                                
                                return (
                                    <tr key={req._id} className={isApproved ? 'row-approved' : isRejected ? 'row-rejected' : ''}>
                                        <td className="text-center">{new Date(req.createdAt).toLocaleDateString()}</td>
                                        <td className="text-center">
                                            <span className={`status-badge ${statusBadge.class}`}>
                                                {statusBadge.text}
                                            </span>
                                        </td>
                                        <td className="text-center">{req.candidateName}</td>
                                        <td className="text-center">{req.companyName}</td>
                                        <td className="text-center">{req.contactPerson}</td>
                                        <td className="text-center requirement-cell" title={req.requirementDetails}>
                                            {req.requirementDetails}
                                        </td>
                                        <td className="text-center">
                                            {/* DETAILS COLUMN: Full width View Details button */}
                                            <button 
                                                className="view-details-btn full-width"
                                                style={{width:'150px'}}
                                                onClick={() => setSelectedRequest(req)}
                                            >
                                                <Eye size={16} />
                                                View Details
                                            </button>
                                        </td>
                                        <td className="text-center">
                                            {/* ACTIONS COLUMN: Approve/Reject buttons */}
                                            {isPending ? (
                                                <div className="approve-reject-buttons">
                                                    <button 
                                                        className={`approve-btn ${actionLoading === req._id ? 'loading' : ''}`}
                                                        onClick={() => handleApprove(req._id)}
                                                        disabled={actionLoading === req._id}
                                                    >
                                                        <CheckCircle size={16} />
                                                        {actionLoading === req._id ? '...' : 'Approve'}
                                                    </button>
                                                    <button 
                                                        className={`reject-btn ${actionLoading === req._id ? 'loading' : ''}`}
                                                        onClick={() => handleReject(req._id)}
                                                        disabled={actionLoading === req._id}
                                                    >
                                                        <XCircle size={16} />
                                                        {actionLoading === req._id ? '...' : 'Reject'}
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="action-completed-buttons">
                                                    <button 
                                                        className={`approve-btn ${isApproved ? 'active' : 'disabled'}`}
                                                        disabled
                                                    >
                                                        <CheckCircle size={16} />
                                                        Approve
                                                    </button>
                                                    <button 
                                                        className={`reject-btn ${isRejected ? 'active' : 'disabled'}`}
                                                        disabled
                                                    >
                                                        <XCircle size={16} />
                                                        Reject
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal for displaying full details */}
            {selectedRequest && (
                <div className="modal-overlay" onClick={() => setSelectedRequest(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="modal-close-btn" onClick={() => setSelectedRequest(null)}>&times;</button>
                        <h3>Request for: {selectedRequest.candidateName}</h3>
                        <p><strong>Status:</strong> 
                            <span className={`status-badge ${getStatusBadge(selectedRequest.status).class}`}>
                                {getStatusBadge(selectedRequest.status).text}
                            </span>
                        </p>
                        <p><strong>Company:</strong> {selectedRequest.companyName}</p>
                        <p><strong>Contact Person:</strong> {selectedRequest.contactPerson} ({selectedRequest.designation})</p>
                        <p><strong>Email:</strong> <a href={`mailto:${selectedRequest.email}`}>{selectedRequest.email}</a></p>
                        <p><strong>Phone:</strong> <a href={`tel:${selectedRequest.phone}`}>{selectedRequest.phone}</a></p>
                        <p><strong>Website:</strong> <a href={selectedRequest.website} target="_blank" rel="noopener noreferrer">{selectedRequest.website || 'N/A'}</a></p>
                        <hr />
                        <p><strong>Requirement Details:</strong> {selectedRequest.requirementDetails}</p>
                        <p><strong>Number of Positions:</strong> {selectedRequest.numberOfPositions}</p>
                        <p><strong>Budget / CTC:</strong> {selectedRequest.budget || 'N/A'}</p>
                        <p><strong>Additional Notes:</strong> {selectedRequest.notes || 'N/A'}</p>
                        <small>Received on: {new Date(selectedRequest.createdAt).toLocaleString()}</small>
                        
                        {(!selectedRequest.status || selectedRequest.status === 'pending') && (
                            <div className="modal-actions">
                                <button 
                                    className="approve-btn"
                                    onClick={() => {
                                        handleApprove(selectedRequest._id);
                                        setSelectedRequest(null);
                                    }}
                                >
                                    <CheckCircle size={16} />
                                    Approve Request
                                </button>
                                <button
                                    className="reject-btn"
                                    onClick={() => {
                                        handleReject(selectedRequest._id);
                                        setSelectedRequest(null);
                                    }}
                                >
                                    <XCircle size={16} />
                                    Reject Request
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}