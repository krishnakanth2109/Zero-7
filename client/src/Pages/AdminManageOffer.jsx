// File: src/Pages/AdminManageOffer.jsx

import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { Gift, Loader2, Save, Eye, CheckCircle, XCircle } from "lucide-react";

const AdminManageOffer = () => {
  const [formData, setFormData] = useState({ heading: '', paragraph: '', imageUrl: '', isActive: true });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const fetchCurrentOffer = async () => {
      try {
        setLoading(true);
        // We fetch the latest offer regardless of status for the admin panel
        const response = await api.get("/offers/latest-admin"); 
        if (response.data) {
          setFormData(response.data);
        }
      } catch (e) {
        console.error("No existing offer found, using defaults.", e);
      } finally {
        setLoading(false);
      }
    };
    fetchCurrentOffer();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage('');
    try {
      await api.post("/offers", formData);
      setStatusMessage("Offer updated successfully!");
      setTimeout(() => setStatusMessage(''), 4000);
    } catch (err) {
      console.error("Error saving offer:", err);
      setStatusMessage("Failed to update offer. Please try again.");
      setTimeout(() => setStatusMessage(''), 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Loader2 className="animate-spin text-[#1976d2]" size={48} />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen font-sans">
      
      {/* ============ BLUE HEADER SECTION ============ */}
      <div className="bg-[#1976d2] rounded-xl shadow-lg p-6 mb-8 flex flex-col md:flex-row items-center justify-between text-white">
        
        {/* Left Side: Icon & Text */}
        <div className="flex items-center space-x-5 w-full md:w-auto mb-6 md:mb-0">
          <div className="bg-white p-4 rounded-full flex items-center justify-center shadow-md">
            <Gift className="text-[#1976d2]" size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Manage Homepage Offer</h1>
            <p className="text-blue-100 opacity-90 text-sm font-medium mt-1">
              Update the special offer section displayed on the public homepage
            </p>
          </div>
        </div>

        {/* Right Side: Status Card */}
        <div className="flex items-center justify-center w-full md:w-auto">
          <div className="bg-white text-gray-800 rounded-lg py-3 px-8 min-w-[160px] flex flex-col items-center shadow-md transform hover:-translate-y-1 transition-transform duration-300">
            <div className={`flex items-center space-x-2 mb-1 ${formData.isActive ? 'text-green-600' : 'text-red-500'}`}>
              {formData.isActive ? <CheckCircle size={16} /> : <XCircle size={16} />}
              <span className="text-xs font-bold uppercase tracking-wider">STATUS</span>
            </div>
            <span className={`text-2xl font-extrabold ${formData.isActive ? 'text-green-700' : 'text-red-700'}`}>
              {formData.isActive ? "ACTIVE" : "HIDDEN"}
            </span>
          </div>
        </div>
      </div>
      {/* =========================================== */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Column: Edit Form */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center space-x-2 border-b border-gray-100 pb-4 mb-6">
             <h2 className="text-xl font-bold text-gray-800">Edit Offer Details</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Toggle Switch */}
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-100">
              <label htmlFor="isActive" className="text-base font-semibold text-gray-800">
                Show Offer on Homepage
              </label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  id="isActive"
                  className="sr-only peer"
                  checked={formData.isActive}
                  onChange={handleChange}
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1976d2]"></div>
              </label>
            </div>

            <div>
              <label htmlFor="heading" className="block text-sm font-bold text-gray-700 mb-1">Heading</label>
              <input 
                type="text" 
                name="heading" 
                id="heading" 
                value={formData.heading} 
                onChange={handleChange} 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1976d2] focus:border-[#1976d2] outline-none transition-all"  
                placeholder="e.g., Summer Sale 50% Off"
              />
            </div>

            <div>
              <label htmlFor="paragraph" className="block text-sm font-bold text-gray-700 mb-1">Description</label>
              <textarea 
                name="paragraph" 
                id="paragraph" 
                rows="5" 
                value={formData.paragraph} 
                onChange={handleChange} 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1976d2] focus:border-[#1976d2] outline-none transition-all" 
                placeholder="Enter details about the offer..."
              ></textarea>
            </div>

            <div>
              <label htmlFor="imageUrl" className="block text-sm font-bold text-gray-700 mb-1">Image URL</label>
              <input 
                type="url" 
                name="imageUrl" 
                id="imageUrl" 
                value={formData.imageUrl} 
                onChange={handleChange} 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1976d2] focus:border-[#1976d2] outline-none transition-all" 
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button 
                type="submit" 
                disabled={isSubmitting} 
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-bold rounded-lg text-white bg-[#1976d2] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 transition-colors shadow-sm"
              >
                {isSubmitting ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : <Save className="h-5 w-5 mr-2" />}
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
              
              {statusMessage && (
                <span className={`text-sm font-semibold px-3 py-1 rounded-md ${statusMessage.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {statusMessage}
                </span>
              )}
            </div>
          </form>
        </div>

        {/* Right Column: Live Preview */}
        <div className={`bg-white rounded-xl shadow-md p-6 border border-gray-100 transition-opacity duration-300 ${formData.isActive ? 'opacity-100' : 'opacity-60 grayscale'}`}>
            <div className="flex items-center space-x-2 border-b border-gray-100 pb-4 mb-4">
               <Eye size={20} className="text-gray-500"/>
               <h4 className="text-lg font-bold text-gray-800">
                 Live Preview <span className="text-sm font-normal text-gray-500">({formData.isActive ? "Visible" : "Hidden on site"})</span>
               </h4>
            </div>

            {formData.imageUrl ? (
                <img 
                  src={formData.imageUrl} 
                  alt="Offer Preview" 
                  className="w-full h-56 object-cover rounded-lg mb-6 shadow-sm border border-gray-100" 
                  onError={(e) => {e.target.src='https://via.placeholder.com/400x200?text=Invalid+Image+URL'}}
                />
            ) : (
                <div className="w-full h-56 bg-gray-100 rounded-lg flex flex-col items-center justify-center text-gray-400 mb-6 border-2 border-dashed border-gray-200">
                    <Gift size={48} className="mb-2 opacity-50" />
                    <span>No Image Provided</span>
                </div>
            )}
            
            <h2 className="text-2xl font-extrabold text-gray-900 mb-3 leading-tight">
              {formData.heading || "Your Heading Here"}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {formData.paragraph || "Your descriptive paragraph will appear here."}
            </p>
        </div>
      </div>
    </div>
  );
};

export default AdminManageOffer;