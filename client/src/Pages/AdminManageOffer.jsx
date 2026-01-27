// File: src/Pages/AdminManageOffer.jsx

import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { Gift, Loader2, Save, Eye, CheckCircle, XCircle } from "lucide-react";

const AdminManageOffer = () => {
  const [formData, setFormData] = useState({ 
    heading: '', 
    paragraph: '', 
    imageUrl: '', 
    isActive: true 
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const fetchCurrentOffer = async () => {
      try {
        setLoading(true);
        // Fetching the latest offer for the admin panel
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
    <div className="container mx-auto p-4 sm:p-8 bg-gray-50 min-h-screen w-[80vw]">
      
      {/* ============ BLUE HEADER SECTION (Matched to Image) ============ */}
      <div className="bg-[#267edc] rounded-xl shadow-lg p-8 mb-10 flex flex-col md:flex-row items-center justify-between text-white relative overflow-hidden">
        {/* Abstract background shape for flair */}
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-10 rounded-full"></div>
        
        {/* Left Side: Icon & Text */}
        <div className="flex items-center space-x-6 z-10">
          <div className="bg-white p-5 rounded-full flex items-center justify-center shadow-xl">
            <Gift className="text-[#267edc]" size={36} />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">Manage Homepage Offer</h1>
            <p className="text-blue-50 opacity-90 text-lg mt-1">
              Update the special offer section displayed on the public homepage
            </p>
          </div>
        </div>

        {/* Right Side: Status Card (Matched to Image) */}
        <div className="mt-6 md:mt-0 z-10">
          <div className="bg-white text-gray-800 rounded-2xl py-4 px-10 min-w-[200px] flex flex-col items-center shadow-2xl transition-all duration-300">
            <div className={`flex items-center space-x-2 mb-1 ${formData.isActive ? 'text-green-500' : 'text-red-500'}`}>
              {formData.isActive ? <CheckCircle size={18} /> : <XCircle size={18} />}
              <span className="text-xs font-bold uppercase tracking-[0.15em] text-gray-400">
                Live Preview <span className="lowercase font-normal">({formData.isActive ? "Visible" : "Hidden"})</span>
              </span>
            </div>
            <span className={`text-3xl font-black ${formData.isActive ? 'text-green-600' : 'text-red-600'}`}>
              {formData.isActive ? "ACTIVE" : "HIDDEN"}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Edit Form */}
        <div className="lg:col-span-7 bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
          <div className="flex items-center justify-between border-b border-gray-100 pb-6 mb-8">
             <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-tight">Edit Offer Details</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Toggle Switch Container */}
            <div className="flex items-center justify-between p-5 bg-[#f0f7ff] rounded-xl border border-blue-100">
              <label htmlFor="isActive" className="text-lg font-semibold text-gray-700">
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
                <div className="w-14 h-7 bg-gray-300 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-200 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-[20px] after:w-[20px] after:transition-all peer-checked:bg-[#267edc]"></div>
              </label>
            </div>

            <div className="space-y-2">
              <label htmlFor="heading" className="block text-sm font-bold text-gray-600 uppercase ml-1">Heading</label>
              <input 
                type="text" 
                name="heading" 
                id="heading" 
                value={formData.heading} 
                onChange={handleChange} 
                className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#267edc] focus:bg-white outline-none transition-all"  
                placeholder="e.g., Summer Sale 50% Off"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="paragraph" className="block text-sm font-bold text-gray-600 uppercase ml-1">Description</label>
              <textarea 
                name="paragraph" 
                id="paragraph" 
                rows="5" 
                value={formData.paragraph} 
                onChange={handleChange} 
                className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#267edc] focus:bg-white outline-none transition-all" 
                placeholder="Enter details about the offer..."
              ></textarea>
            </div>

            <div className="space-y-2">
              <label htmlFor="imageUrl" className="block text-sm font-bold text-gray-600 uppercase ml-1">Image URL</label>
              <input 
                type="url" 
                name="imageUrl" 
                id="imageUrl" 
                value={formData.imageUrl} 
                onChange={handleChange} 
                className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#267edc] focus:bg-white outline-none transition-all" 
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="pt-4 flex items-center space-x-4">
              <button 
                type="submit" 
                disabled={isSubmitting} 
                className="flex-1 inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-bold rounded-xl text-white bg-[#267edc] hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:bg-gray-400 transition-all shadow-lg active:scale-95"
              >
                {isSubmitting ? <Loader2 className="animate-spin h-6 w-6 mr-2" /> : <Save className="h-6 w-6 mr-2" />}
                {isSubmitting ? "Saving Updates..." : "Save Changes"}
              </button>
              
              {statusMessage && (
                <div className={`animate-fade-in px-4 py-4 rounded-xl font-bold flex items-center ${statusMessage.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                   {statusMessage}
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Right Column: Live Preview Card */}
        <div className="lg:col-span-5">
           <div className={`bg-white rounded-2xl shadow-xl p-8 border border-gray-100 sticky top-8 transition-all duration-500 ${formData.isActive ? 'opacity-100 translate-y-0' : 'opacity-60 grayscale scale-[0.98]'}`}>
              <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
                 <div className="flex items-center space-x-2">
                    <Eye size={22} className="text-gray-400"/>
                    <h4 className="text-xl font-bold text-gray-800 tracking-tight">Live Preview</h4>
                 </div>
                 {!formData.isActive && (
                   <span className="bg-red-100 text-red-600 text-[10px] font-black px-2 py-1 rounded uppercase">Currently Hidden</span>
                 )}
              </div>

              {formData.imageUrl ? (
                  <div className="relative group">
                    <img 
                      src={formData.imageUrl} 
                      alt="Offer Preview" 
                      className="w-full h-64 object-cover rounded-2xl mb-6 shadow-md border border-gray-100 transition-transform duration-500 group-hover:scale-[1.02]" 
                      onError={(e) => {e.target.src='https://via.placeholder.com/600x400?text=Invalid+Image+URL'}}
                    />
                  </div>
              ) : (
                  <div className="w-full h-64 bg-gray-50 rounded-2xl flex flex-col items-center justify-center text-gray-300 mb-6 border-2 border-dashed border-gray-200">
                      <Gift size={64} className="mb-4 opacity-20" />
                      <span className="font-bold uppercase tracking-widest text-sm">No Image Provided</span>
                  </div>
              )}
              
              <div className="space-y-4">
                <h2 className="text-3xl font-black text-gray-900 leading-tight">
                  {formData.heading || "Your Heading Here"}
                </h2>
                <div className="w-16 h-1 bg-[#267edc] rounded-full"></div>
                <p className="text-gray-500 text-lg leading-relaxed italic">
                  "{formData.paragraph || "Your descriptive paragraph will appear here. Provide details that entice your users to click."}"
                </p>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminManageOffer;