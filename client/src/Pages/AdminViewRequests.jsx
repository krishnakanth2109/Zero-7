import React, { useState, useEffect } from 'react';
import api from '../api/axios'; // <-- IMPORT THE CENTRAL API

export default function AdminViewRequests() {
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const { data } = await api.get('/request-info'); // <-- Simplified API call
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

    if (isLoading) return <p>Loading requests...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div>
            <h2>Candidate Information Requests</h2>
            {requests.length === 0 ? (
                <p>No requests found.</p>
            ) : (
                requests.map(req => (
                    <div key={req._id} style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem' }}>
                        <h3>Request for: {req.candidateName}</h3>
                        <p><strong>Company:</strong> {req.companyName}</p>
                        <p><strong>Contact:</strong> {req.contactPerson} ({req.designation})</p>
                        <p><strong>Email:</strong> <a href={`mailto:${req.email}`}>{req.email}</a></p>
                        <p><strong>Phone:</strong> <a href={`tel:${req.phone}`}>{req.phone}</a></p>
                        <p><strong>Website:</strong> <a href={req.website} target="_blank" rel="noopener noreferrer">{req.website}</a></p>
                        <hr />
                        <p><strong>Requirement:</strong> {req.requirementDetails}</p>
                        <p><strong>Positions:</strong> {req.numberOfPositions}</p>
                        <p><strong>Budget:</strong> {req.budget || 'N/A'}</p>
                        <p><strong>Notes:</strong> {req.notes || 'N/A'}</p>
                        <small>Received on: {new Date(req.createdAt).toLocaleString()}</small>
                    </div>
                ))
            )}
        </div>
    );
}