import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, Ticket, MessageSquare, Lock, Save, Plus, Trash2, RefreshCw, CheckCircle,
  LayoutDashboard, LogOut, Building2, Briefcase, Upload, X, Image as ImageIcon,
  Monitor, Phone, ShieldAlert, Fingerprint, Clock, Server, Calendar, Eye, EyeOff,
  Palette, Moon, Sun, Mail, Bell, Link as LinkIcon, ArrowRight, Search, Settings, Key
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken,
  signInWithPopup, OAuthProvider
} from 'firebase/auth';
import { 
  getFirestore, doc, onSnapshot, setDoc, collection, getDocs, deleteDoc 
} from 'firebase/firestore';

// --- Firebase Configuration & Initialization ---
const firebaseConfig = {
  apiKey: "AIzaSyBhm90CmJUhVevcebyZ3MzfTguIt-xN4_g",
  authDomain: "msp-client-portal.firebaseapp.com",
  projectId: "msp-client-portal",
  storageBucket: "msp-client-portal.firebasestorage.app",
  messagingSenderId: "762817959762",
  appId: "1:762817959762:web:c10f22a402c3c5b0650c8b",
  measurementId: "G-1WXPD859SN"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = "msp-client-portal";

// --- Utils ---
const generateId = () => Math.random().toString(36).substr(2, 9);

// --- Components ---

// 1. Stat Card Component
const StatCard = ({ icon: Icon, label, value, colorClass, subtext, brandColor, isDarkMode }) => (
  <div className={`overflow-hidden shadow-lg rounded-xl border transition-all duration-300 h-full ${
    isDarkMode 
      ? 'bg-slate-900 border-slate-800 hover:shadow-slate-900/50' 
      : 'bg-white border-slate-100 hover:shadow-xl'
  }`}>
    <div className="p-6">
      <div className="flex items-center">
        <div className={`flex-shrink-0 rounded-md p-3 bg-opacity-10 ${colorClass}`}>
          <Icon 
            className={`h-8 w-8 ${colorClass === 'brand' ? '' : colorClass.replace('bg-', 'text-')}`} 
            style={colorClass === 'brand' ? { color: brandColor } : {}}
          />
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className={`text-sm font-medium truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{label}</dt>
            <dd>
              <div className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {typeof value === 'object' ? JSON.stringify(value) : value}
              </div>
            </dd>
          </dl>
        </div>
      </div>
    </div>
    <div className={`px-6 py-3 mt-auto border-t ${isDarkMode ? 'bg-slate-800/50 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
      <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">
        {subtext}
      </div>
    </div>
  </div>
);

// 2. Talking Points Component
const TalkingPointsList = ({ points, brandColor, isDarkMode }) => (
  <div className={`shadow-lg rounded-xl border h-full mb-10 ${
    isDarkMode 
      ? 'bg-slate-900 border-slate-800' 
      : 'bg-white border-slate-100'
  }`}>
    <div className={`px-6 py-5 border-b flex items-center gap-2 ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
      <div className="p-2 rounded-lg bg-opacity-10" style={{ backgroundColor: `${brandColor}20` }}>
        <Bell className="h-5 w-5" style={{ color: brandColor }} />
      </div>
      <h3 className={`text-lg font-bold leading-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
        Announcements & Reminders
      </h3>
    </div>
    <ul className={`divide-y ${isDarkMode ? 'divide-slate-800' : 'divide-slate-100'}`}>
      {(!points || points.length === 0) ? (
        <li className={`px-6 py-8 text-center italic ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
          No pending items at this time.
        </li>
      ) : (
        points.map((point, index) => (
          <li key={index} className={`px-6 py-5 transition-colors ${isDarkMode ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}`}>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 mt-1">
                <div 
                  className="h-2.5 w-2.5 rounded-full ring-4"
                  style={{ backgroundColor: brandColor, '--tw-ring-color': `${brandColor}20` }}
                ></div>
              </div>
              <p className={`text-base leading-relaxed font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                {typeof point === 'string' ? point : 'Invalid content format'}
              </p>
            </div>
          </li>
        ))
      )}
    </ul>
  </div>
);

// 3. Contact Section Component
const ContactSection = ({ contactName, contactInfo, supportPhone, brandColor, isDarkMode }) => {
  return (
    <div className={`rounded-2xl border shadow-lg p-6 mb-8 relative overflow-hidden ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
      <div 
        className="absolute -right-10 -top-10 w-64 h-64 rounded-full opacity-5 pointer-events-none blur-3xl"
        style={{ backgroundColor: brandColor }}
      ></div>

      <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5 w-full md:w-auto">
          <div 
            className="h-16 w-16 rounded-2xl flex items-center justify-center shadow-md flex-shrink-0"
            style={{ backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }}
          >
             <div className="h-12 w-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${brandColor}20` }}>
                <Building2 className="h-6 w-6" style={{ color: brandColor }} />
             </div>
          </div>
          <div>
            <h3 className={`text-xs font-bold uppercase tracking-wider mb-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              Your Dedicated Support Team
            </h3>
            <p className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {contactName}
            </p>
            <div className="flex items-center gap-4 mt-1">
               <div className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-slate-500" />
                  <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{contactInfo}</span>
               </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:items-end gap-1 w-full md:w-auto border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-8">
           <span className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
             Support Line
           </span>
           <div className="flex items-center gap-3">
             <Phone className="h-6 w-6" style={{ color: brandColor }} />
             <span className={`text-2xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
               {supportPhone || "555-0123"}
             </span>
           </div>
        </div>
      </div>
    </div>
  );
};

// 4. Admin Login Modal (UPDATED for Branding & Text Password)
const AdminLogin = ({ onLogin, onCancel, brandColor, isDarkMode, mspSettings, currentPassword }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const actualPassword = currentPassword || 'access';
    
    if (password === actualPassword) {
      onLogin();
    } else {
      setError('Invalid Password');
    }
  };

  return (
    <div className={`fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4 ${isDarkMode ? 'bg-slate-950/80' : 'bg-slate-900/50'}`}>
      <div className={`rounded-2xl shadow-2xl p-8 w-full max-w-md ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white'}`}>
        <div className="text-center mb-6">
          {mspSettings?.logoUrl ? (
             <img 
               src={mspSettings.logoUrl} 
               alt="Logo" 
               className="mx-auto h-16 w-auto object-contain mb-4" 
             />
          ) : (
             <div className="mx-auto h-12 w-12 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: `${brandColor}20` }}>
               <Lock className="h-6 w-6" style={{ color: brandColor }} />
             </div>
          )}
          
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            {mspSettings?.companyName || "MSP"} Admin
          </h2>
          <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-500'} mt-2 text-sm`}>Enter your password to manage dashboards.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full text-center text-lg tracking-wide border rounded-lg p-3 focus:ring-2 focus:outline-none transition-all ${
                isDarkMode 
                  ? 'bg-slate-950 border-slate-700 text-white placeholder-slate-600' 
                  : 'bg-white border-slate-300 text-slate-900'
              }`}
              style={{ '--tw-ring-color': brandColor, borderColor: password ? brandColor : undefined }}
              placeholder="Password"
              autoFocus
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className={`flex-1 px-4 py-2 border rounded-lg transition-colors ${
                isDarkMode 
                  ? 'border-slate-700 text-slate-300 hover:bg-slate-800' 
                  : 'border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-white rounded-lg hover:opacity-90 transition-colors font-medium"
              style={{ backgroundColor: brandColor }}
            >
              Access Backend
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 5. Global Settings Modal (UPDATED with Password Field)
const GlobalSettingsModal = ({ settings, adminSettings, onSave, onClose, isDarkMode }) => {
  const [formData, setFormData] = useState(settings);
  const [password, setPassword] = useState(adminSettings?.password || 'access');
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 500 * 1024) {
        alert("Image is too large! Please choose an image under 500KB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, logoUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setFormData({ ...formData, logoUrl: '' });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className={`fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4 ${isDarkMode ? 'bg-slate-950/80' : 'bg-slate-900/50'}`}>
      <div className={`rounded-2xl shadow-2xl p-8 w-full max-w-2xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white'}`}>
        <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-4">
          <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} flex items-center gap-2`}>
            <Palette className="h-5 w-5" /> Global Settings
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="h-5 w-5" /></button>
        </div>

        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
          {/* MSP Identity */}
          <div className="space-y-4">
             <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">MSP Identity</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                   <label className="block text-xs text-slate-400">MSP Company Name</label>
                   <input
                     type="text"
                     value={formData.companyName || ''}
                     onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                     className={`block w-full text-sm bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500`}
                   />
                </div>
                <div className="space-y-1">
                   <label className="block text-xs text-slate-400">MSP Logo</label>
                   {!formData.logoUrl ? (
                      <div 
                        className="border-2 border-dashed border-slate-700 rounded-lg p-2 hover:bg-slate-800 cursor-pointer flex flex-col items-center justify-center text-center"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="h-4 w-4 text-slate-500" />
                        <span className="text-[10px] text-slate-500 mt-1">Upload Logo</span>
                      </div>
                    ) : (
                      <div className="relative group inline-block border border-slate-700 rounded-lg p-2 bg-white w-full flex justify-center">
                        <img src={formData.logoUrl} alt="Logo Preview" className="h-8 w-auto object-contain" />
                        <button onClick={removeLogo} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-sm hover:bg-red-600"><X className="h-3 w-3" /></button>
                      </div>
                    )}
                    <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                </div>
             </div>
          </div>

          {/* Colors */}
          <div className="space-y-4">
             <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Brand Colors</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs text-slate-400">Primary Accent Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.primaryColor || '#82baff'}
                      onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                      className="h-10 w-10 p-0 border border-slate-700 rounded-lg cursor-pointer bg-slate-900"
                    />
                    <input
                      type="text"
                      value={formData.primaryColor || '#82baff'}
                      onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                      className="block flex-1 text-sm bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="block text-xs text-slate-400">Sidebar / Footer Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.secondaryColor || '#1e293b'}
                      onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                      className="h-10 w-10 p-0 border border-slate-700 rounded-lg cursor-pointer bg-slate-900"
                    />
                    <input
                      type="text"
                      value={formData.secondaryColor || '#1e293b'}
                      onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                      className="block flex-1 text-sm bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                    />
                  </div>
                </div>
             </div>
          </div>

          {/* Admin Security (NEW) */}
           <div className="space-y-4 pt-2 border-t border-slate-700">
             <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider flex items-center gap-2">
               <Lock className="h-3 w-3" /> Admin Security
             </h3>
             <div className="space-y-1">
                <label className="block text-xs text-slate-400">Admin Password</label>
                <div className="relative">
                  <Key className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`block w-full pl-10 text-sm bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-red-500`}
                    placeholder="access"
                  />
                </div>
                <p className="text-[10px] text-slate-500">This password is required to access the dashboard manager.</p>
             </div>
           </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
           <button onClick={onClose} className="px-4 py-2 text-slate-400 hover:text-white">Cancel</button>
           <button 
             onClick={() => onSave(formData, password)} 
             className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium"
           >
             Save Global Settings
           </button>
        </div>
      </div>
    </div>
  );
};

// 6. Metric Edit Card (Admin)
const MetricEditCard = ({ icon: Icon, label, value, onChange, type = "text", isVisible, onToggle, brandColor, isDarkMode }) => (
  <div className={`relative p-4 rounded-xl border transition-all duration-200 group ${
    isVisible 
      ? (isDarkMode ? 'bg-slate-800 border-slate-700 shadow-sm' : 'bg-white border-slate-200 shadow-sm') 
      : (isDarkMode ? 'bg-slate-900 border-slate-800 opacity-60' : 'bg-slate-50 border-slate-200 opacity-75')
  }`}>
    <div className="flex items-start justify-between mb-3">
      <div className={`p-2 rounded-lg transition-colors ${
        isVisible 
          ? 'bg-opacity-10' 
          : (isDarkMode ? 'bg-slate-800' : 'bg-slate-200')
      }`} style={isVisible ? { backgroundColor: `${brandColor}20` } : {}}>
        <Icon className="h-5 w-5" style={isVisible ? { color: brandColor } : { color: isDarkMode ? '#64748b' : '#94a3b8' }} />
      </div>
      <button 
        onClick={onToggle}
        className={`p-1.5 rounded-md transition-all ${
          isVisible 
            ? (isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-700' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100')
            : (isDarkMode ? 'text-slate-600 hover:text-slate-400 bg-slate-800' : 'text-slate-400 hover:text-slate-600 bg-slate-200')
        }`}
        title={isVisible ? "Hide from Dashboard" : "Show on Dashboard"}
      >
        {isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
      </button>
    </div>
    
    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{label}</label>
    
    <input
      type={type}
      value={value}
      onChange={onChange}
      disabled={!isVisible}
      className={`block w-full text-lg font-bold bg-transparent p-0 border-0 border-b-2 focus:ring-0 focus:outline-none transition-colors ${
        isVisible 
          ? (isDarkMode ? 'text-white border-slate-600' : 'text-slate-900 border-slate-100') 
          : (isDarkMode ? 'text-slate-600 border-slate-800 cursor-not-allowed' : 'text-slate-400 border-slate-200 cursor-not-allowed')
      }`}
      placeholder="--" 
    />
     <div className={`h-0.5 w-0 bg-current transition-all duration-300 group-focus-within:w-full`} style={{ backgroundColor: brandColor }}></div>
  </div>
);

// 7. Admin Dashboard Editor
const AdminEditor = ({ data, mspSettings, onSave, onExit, isDarkMode }) => {
  const [formData, setFormData] = useState(data);
  const [newPoint, setNewPoint] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleSave = async () => {
    setIsSaving(true);
    await onSave(formData);
    setIsSaving(false);
    onExit(); // Navigate back to the list view after saving
  };

  const addPoint = (e) => {
    e.preventDefault();
    if (!newPoint.trim()) return;
    setFormData({
      ...formData,
      talkingPoints: [...(formData.talkingPoints || []), newPoint.trim()]
    });
    setNewPoint('');
  };

  const removePoint = (index) => {
    const updatedPoints = [...formData.talkingPoints];
    updatedPoints.splice(index, 1);
    setFormData({ ...formData, talkingPoints: updatedPoints });
  };

  const toggleVisibility = (key) => {
    setFormData(prev => ({
      ...prev,
      widgetVisibility: {
        ...prev.widgetVisibility,
        [key]: !prev.widgetVisibility?.[key]
      }
    }));
  };

  const brandColor = mspSettings?.primaryColor || '#82baff';

  // Dynamic classes based on mode
  const bgMain = isDarkMode ? 'bg-slate-950' : 'bg-slate-50';
  const textMain = isDarkMode ? 'text-slate-200' : 'text-slate-900';
  const cardBg = isDarkMode ? 'bg-slate-900' : 'bg-white';
  const cardBorder = isDarkMode ? 'border-slate-800' : 'border-slate-200';
  const inputBg = isDarkMode ? 'bg-slate-950' : 'bg-white';
  const inputBorder = isDarkMode ? 'border-slate-700' : 'border-slate-300';

  return (
    <div className={`${bgMain} min-h-screen p-4 md:p-8 pb-24 ${textMain}`}>
      <div className="max-w-4xl mx-auto">
        <div className={`${cardBg} rounded-2xl shadow-xl overflow-hidden border ${cardBorder}`}>
          {/* Header */}
          <div className={`px-6 py-4 flex justify-between items-center border-b ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-900 border-slate-800'}`}>
            <h2 className="text-white font-bold text-xl flex items-center gap-2">
              <LayoutDashboard className="h-5 w-5 text-slate-400" />
              Editing: {formData.clientName || "Client Dashboard"}
            </h2>
            <button onClick={onExit} className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 text-sm">
              <LogOut className="h-4 w-4" />
              Close Editor
            </button>
          </div>

          <div className="p-6 space-y-8">
            
            {/* Branding & Details */}
            <div className="grid grid-cols-1 gap-8">
              {/* Client Details Section */}
              <div className={`${isDarkMode ? 'bg-slate-950' : 'bg-slate-50'} p-5 rounded-xl border ${cardBorder} space-y-4`}>
                <h3 className={`font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  <Building2 className="h-4 w-4" style={{ color: brandColor }} />
                  Client Details
                </h3>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Client Company Name</label>
                    <input
                      type="text"
                      value={formData.clientName || ''}
                      onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                      className={`block w-full text-sm ${inputBg} border ${inputBorder} rounded-lg p-2.5 focus:ring-2 focus:outline-none shadow-sm placeholder-slate-500`}
                      style={{ '--tw-ring-color': brandColor }}
                      placeholder="e.g. Globex Corporation"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Contact Name</label>
                      <input
                        type="text"
                        value={formData.contactName || ''}
                        onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                        className={`block w-full text-sm ${inputBg} border ${inputBorder} rounded-lg p-2.5 focus:ring-2 focus:outline-none shadow-sm placeholder-slate-500`}
                        style={{ '--tw-ring-color': brandColor }}
                        placeholder="e.g. John Doe"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Contact Email</label>
                      <input
                        type="text"
                        value={formData.contactInfo || ''}
                        onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
                        className={`block w-full text-sm ${inputBg} border ${inputBorder} rounded-lg p-2.5 focus:ring-2 focus:outline-none shadow-sm placeholder-slate-500`}
                        style={{ '--tw-ring-color': brandColor }}
                        placeholder="e.g. john@example.com"
                      />
                    </div>
                  </div>
                   
                   {/* Support Phone Input */}
                   <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Support Phone Number</label>
                      <input
                        type="text"
                        value={formData.supportPhone || ''}
                        onChange={(e) => setFormData({ ...formData, supportPhone: e.target.value })}
                        className={`block w-full text-sm ${inputBg} border ${inputBorder} rounded-lg p-2.5 focus:ring-2 focus:outline-none shadow-sm placeholder-slate-500`}
                        style={{ '--tw-ring-color': brandColor }}
                        placeholder="e.g. 1-800-555-0123"
                      />
                    </div>
                </div>
              </div>
            </div>

            <hr className={isDarkMode ? "border-slate-800" : "border-slate-200"} />

            {/* Talking Points Section (MOVED UP IN ADMIN TOO) */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-400">Announcements & Reminders</label>
              
              {/* Add New Point */}
              <form onSubmit={addPoint} className="flex gap-2">
                <input
                  type="text"
                  value={newPoint}
                  onChange={(e) => setNewPoint(e.target.value)}
                  placeholder="Type a new announcement and press Enter..."
                  className={`flex-1 block w-full sm:text-sm border rounded-lg p-3 focus:ring-2 focus:outline-none placeholder-slate-500 ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'}`}
                  style={{ '--tw-ring-color': brandColor }}
                />
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white hover:opacity-90 focus:outline-none"
                  style={{ backgroundColor: brandColor }}
                >
                  <Plus className="h-5 w-5" />
                </button>
              </form>

              {/* List */}
              <div className={`rounded-lg border divide-y max-h-64 overflow-y-auto ${isDarkMode ? 'bg-slate-950 border-slate-800 divide-slate-800' : 'bg-slate-50 border-slate-200 divide-slate-200'}`}>
                {(!formData.talkingPoints || formData.talkingPoints.length === 0) && (
                  <div className="p-4 text-center text-slate-500 text-sm">No points added yet.</div>
                )}
                {formData.talkingPoints?.map((point, idx) => (
                  <div key={idx} className={`p-3 flex justify-between items-center group transition-colors ${isDarkMode ? 'bg-slate-900 hover:bg-slate-800/50' : 'bg-white hover:bg-slate-50'}`}>
                    <span className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      {typeof point === 'string' ? point : ''}
                    </span>
                    <button
                      onClick={() => removePoint(idx)}
                      className="text-slate-500 hover:text-red-400 transition-colors p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <hr className={isDarkMode ? "border-slate-800" : "border-slate-200"} />

            {/* MODERNIZED Metrics Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                 <h3 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Metrics Dashboard</h3>
                 <span className={`text-xs font-medium px-2 py-1 rounded border ${isDarkMode ? 'text-slate-500 bg-slate-950 border-slate-800' : 'text-slate-500 bg-slate-50 border-slate-200'}`}>Toggle eye icon to show/hide</span>
              </div>
              
              {/* 1. Operational */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-bold uppercase border ${isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>Operational</span>
                  <div className={`h-px flex-1 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <MetricEditCard 
                    icon={Users} 
                    label="Active Users" 
                    value={formData.activeUsers}
                    onChange={(e) => setFormData({ ...formData, activeUsers: parseInt(e.target.value) || 0 })}
                    isVisible={formData.widgetVisibility?.activeUsers !== false}
                    onToggle={() => toggleVisibility('activeUsers')}
                    brandColor={brandColor}
                    type="number"
                    isDarkMode={isDarkMode}
                  />
                  <MetricEditCard 
                    icon={Monitor} 
                    label="Managed Devices" 
                    value={formData.managedDevices || 0}
                    onChange={(e) => setFormData({ ...formData, managedDevices: parseInt(e.target.value) || 0 })}
                    isVisible={formData.widgetVisibility?.managedDevices !== false}
                    onToggle={() => toggleVisibility('managedDevices')}
                    brandColor={brandColor}
                    type="number"
                    isDarkMode={isDarkMode}
                  />
                  <MetricEditCard 
                    icon={Ticket} 
                    label="Open Tickets" 
                    value={formData.openTickets}
                    onChange={(e) => setFormData({ ...formData, openTickets: parseInt(e.target.value) || 0 })}
                    isVisible={formData.widgetVisibility?.openTickets !== false}
                    onToggle={() => toggleVisibility('openTickets')}
                    brandColor={brandColor}
                    type="number"
                    isDarkMode={isDarkMode}
                  />
                </div>
              </div>

              {/* 2. Security */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-bold uppercase border ${isDarkMode ? 'bg-slate-950 border-red-900/30 text-red-400' : 'bg-red-50 border-red-100 text-red-600'}`}>Security</span>
                  <div className={`h-px flex-1 ${isDarkMode ? 'bg-red-900/30' : 'bg-red-50'}`}></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <MetricEditCard 
                    icon={ShieldAlert} 
                    label="Phishing Rate" 
                    value={formData.phishingRate || ''}
                    onChange={(e) => setFormData({ ...formData, phishingRate: e.target.value })}
                    isVisible={formData.widgetVisibility?.phishingRate !== false}
                    onToggle={() => toggleVisibility('phishingRate')}
                    brandColor={brandColor}
                    isDarkMode={isDarkMode}
                  />
                   <MetricEditCard 
                    icon={Fingerprint} 
                    label="MFA Adoption" 
                    value={formData.mfaAdoption || ''}
                    onChange={(e) => setFormData({ ...formData, mfaAdoption: e.target.value })}
                    isVisible={formData.widgetVisibility?.mfaAdoption !== false}
                    onToggle={() => toggleVisibility('mfaAdoption')}
                    brandColor={brandColor}
                    isDarkMode={isDarkMode}
                  />
                </div>
              </div>

              {/* 3. Lifecycle */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                   <span className={`px-2 py-1 rounded text-xs font-bold uppercase border ${isDarkMode ? 'bg-slate-950 border-blue-900/30 text-blue-400' : 'bg-blue-50 border-blue-100 text-blue-600'}`}>Lifecycle</span>
                   <div className={`h-px flex-1 ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50'}`}></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <MetricEditCard 
                    icon={Clock} 
                    label="Response Time" 
                    value={formData.avgResponseTime || ''}
                    onChange={(e) => setFormData({ ...formData, avgResponseTime: e.target.value })}
                    isVisible={formData.widgetVisibility?.avgResponseTime !== false}
                    onToggle={() => toggleVisibility('avgResponseTime')}
                    brandColor={brandColor}
                    isDarkMode={isDarkMode}
                  />
                  <MetricEditCard 
                    icon={Server} 
                    label="HW EOL Risk" 
                    value={formData.hardwareEol || 0}
                    onChange={(e) => setFormData({ ...formData, hardwareEol: parseInt(e.target.value) || 0 })}
                    isVisible={formData.widgetVisibility?.hardwareEol !== false}
                    onToggle={() => toggleVisibility('hardwareEol')}
                    brandColor={brandColor}
                    type="number"
                    isDarkMode={isDarkMode}
                  />
                  <MetricEditCard 
                    icon={Calendar} 
                    label="License Renewal (Days)" 
                    value={formData.licenseRenewalDays || 0}
                    onChange={(e) => setFormData({ ...formData, licenseRenewalDays: parseInt(e.target.value) || 0 })}
                    isVisible={formData.widgetVisibility?.licenseRenewal !== false}
                    onToggle={() => toggleVisibility('licenseRenewal')}
                    brandColor={brandColor}
                    type="number"
                    isDarkMode={isDarkMode}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className={`px-6 py-4 flex justify-end gap-3 border-t ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <button
              onClick={onExit}
              className={`px-4 py-2 border shadow-sm text-sm font-medium rounded-lg ${isDarkMode ? 'border-slate-700 text-slate-300 bg-slate-900 hover:bg-slate-800' : 'border-slate-300 text-slate-700 bg-white hover:bg-slate-50'}`}
            >
              Cancel Changes
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              {isSaving ? (
                <RefreshCw className="animate-spin h-4 w-4 mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save & Publish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- PAGE COMPONENTS ---

// A. Landing Page (No Client ID selected) - UPDATED BRANDING
const LandingPage = ({ onAdminLogin, mspSettings }) => {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 rounded-2xl border border-slate-800 p-8 text-center">
        {mspSettings?.logoUrl ? (
           <img 
             src={mspSettings.logoUrl} 
             alt="Logo" 
             className="mx-auto h-20 w-auto object-contain mb-6" 
           />
        ) : (
           <div className="mx-auto h-16 w-16 bg-indigo-900/30 rounded-2xl flex items-center justify-center mb-6">
             <LayoutDashboard className="h-8 w-8 text-indigo-500" />
           </div>
        )}
        
        <h1 className="text-2xl font-bold text-white mb-2">
           {mspSettings?.companyName || "MSP Client Portal"}
        </h1>
        <p className="text-slate-400 mb-8 text-sm leading-relaxed">
          Please use the specific dashboard link provided by your Managed Service Provider to access your metrics.
        </p>
        
        <div className="border-t border-slate-800 pt-6">
          <p className="text-xs text-slate-600 mb-4 uppercase tracking-widest font-bold">For Administrators</p>
          <button 
            onClick={onAdminLogin}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors border border-slate-700"
          >
            <Lock className="h-4 w-4" />
            Login to Dashboard Manager
          </button>
        </div>
      </div>
    </div>
  );
};

// B. Dashboard List (Admin Command Center) - Updated to show Branding Modal
const DashboardList = ({ onSelect, onLogout, onOpenSettings, onPreview }) => {
  const [dashboards, setDashboards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newClientName, setNewClientName] = useState('');

  // Fetch list
  useEffect(() => {
    const fetchList = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'artifacts', appId, 'public', 'data', 'dashboards'));
        const list = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setDashboards(list);
      } catch (e) {
        console.error("Error listing dashboards:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchList();
  }, []);

  const createDashboard = async (e) => {
    e.preventDefault();
    if (!newClientName.trim()) return;
    
    const newId = 'client_' + generateId();
    const newDash = {
      id: newId,
      clientName: newClientName,
      created: new Date().toISOString(),
      // Defaults
      activeUsers: 0,
      managedDevices: 0,
      openTickets: 0,
      phishingRate: "0%",
      mfaAdoption: "0%",
      avgResponseTime: "N/A",
      hardwareEol: 0,
      licenseRenewalDays: 0,
      talkingPoints: ["Welcome to your new dashboard!"],
      contactName: "MSP Support Team",
      contactInfo: "support@msp.com",
      supportPhone: "1-800-555-0199",
      widgetVisibility: {},
    };

    // Optimistic UI update
    setDashboards([...dashboards, newDash]);
    setNewClientName('');

    // Save to DB
    await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'dashboards', newId), newDash);
  };

  const copyLink = (id) => {
    const url = `${window.location.origin}${window.location.pathname}?client=${id}`;
    try {
       navigator.clipboard.writeText(url);
       alert("Copied link: " + url);
    } catch(e) {
       prompt("Copy this link:", url);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <LayoutDashboard className="h-8 w-8 text-indigo-500" />
              Dashboard Command Center
            </h1>
            <p className="text-slate-400 text-sm mt-1">Manage all your client portals in one place.</p>
          </div>
          <div className="flex items-center gap-4">
             <button 
               onClick={onOpenSettings}
               className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors border border-slate-700"
             >
                <Palette className="h-4 w-4" /> Global Branding
             </button>
             <button onClick={onLogout} className="text-slate-400 hover:text-white flex items-center gap-2 text-sm">
               <LogOut className="h-4 w-4" /> Sign Out
             </button>
          </div>
        </div>

        {/* Create New Bar */}
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 mb-8 flex flex-col md:flex-row gap-4 items-center shadow-lg">
          <div className="p-3 bg-indigo-500/10 rounded-lg text-indigo-400">
            <Plus className="h-6 w-6" />
          </div>
          <div className="flex-1 w-full">
             <label className="block text-xs font-bold text-slate-500 uppercase mb-1">New Client Portal</label>
             <form onSubmit={createDashboard} className="flex gap-3">
               <input 
                 value={newClientName}
                 onChange={(e) => setNewClientName(e.target.value)}
                 placeholder="Enter Client Company Name..."
                 className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
               />
               <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg font-bold transition-colors">
                 Create Dashboard
               </button>
             </form>
          </div>
        </div>

        {/* List */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
             <h3 className="font-bold text-slate-300">Active Dashboards ({dashboards.length})</h3>
             <div className="relative">
               <Search className="h-4 w-4 text-slate-500 absolute left-3 top-2.5" />
               <input placeholder="Search clients..." className="bg-slate-950 border border-slate-800 rounded-lg py-1.5 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-slate-600" />
             </div>
          </div>
          
          {loading ? (
            <div className="p-8 text-center text-slate-500">Loading dashboards...</div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-slate-950 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Client Name</th>
                  <th className="px-6 py-4">Unique ID</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {dashboards.map(dash => (
                  <tr key={dash.id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-white">{dash.clientName || "Untitled"}</div>
                      <div className="text-xs text-slate-500">Last updated: {new Date().toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <code className="bg-slate-950 px-2 py-1 rounded text-xs text-indigo-400 font-mono">{dash.id}</code>
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <button 
                        onClick={() => onPreview(dash.id)}
                        className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg" 
                        title="Preview Dashboard"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => copyLink(dash.id)}
                        className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg" 
                        title="Copy Link"
                      >
                        <LinkIcon className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => onSelect(dash.id)} 
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg flex items-center gap-2"
                      >
                        Manage <ArrowRight className="h-3 w-3" />
                      </button>
                    </td>
                  </tr>
                ))}
                {dashboards.length === 0 && (
                  <tr>
                    <td colSpan="3" className="px-6 py-12 text-center text-slate-500 italic">
                      No dashboards found. Create your first one above.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

// --- MAIN APP ---

export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('loading'); 
  const [dashboardId, setDashboardId] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [mspSettings, setMspSettings] = useState({
    companyName: "Managed Service Provider",
    logoUrl: "",
    primaryColor: '#82baff',
    secondaryColor: '#1e293b'
  });
  const [adminSettings, setAdminSettings] = useState({ password: 'access' });
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [isAdminPreview, setIsAdminPreview] = useState(false);

  // 1. Auth & Routing Init
  useEffect(() => {
    const init = async () => {
      // Auth logic
      if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
        await signInWithCustomToken(auth, __initial_auth_token);
      } else {
        await signInAnonymously(auth);
      }

      const params = new URLSearchParams(window.location.search);
      const clientId = params.get('client');

      if (clientId) {
        setDashboardId(clientId);
        setView('client');
      } else {
        setView('landing');
      }
    };
    
    init();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  // 2. Fetch Global Settings (Including Admin Password)
  useEffect(() => {
    if (!user) return;

    // Branding Settings
    const settingsRef = doc(db, 'artifacts', appId, 'public', 'data', 'settings', 'global');
    const unsubSettings = onSnapshot(settingsRef, (snap) => {
      if (snap.exists()) {
        setMspSettings(snap.data());
      }
    });

    // Admin Security Settings
    const adminRef = doc(db, 'artifacts', appId, 'public', 'data', 'settings', 'admin');
    const unsubAdmin = onSnapshot(adminRef, (snap) => {
      if (snap.exists()) {
        setAdminSettings(snap.data());
      }
    });

    return () => {
        unsubSettings();
        unsubAdmin();
    };
  }, [user]);

  // 3. Data Fetching
  useEffect(() => {
    if (!dashboardId || !user) return;
    if (view === 'admin-list') return;

    const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'dashboards', dashboardId);

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (!data.talkingPoints) data.talkingPoints = [];
        if (!data.widgetVisibility) data.widgetVisibility = {};
        setDashboardData(data);
      } else {
        console.log("Dashboard not found");
      }
    });

    return () => unsubscribe();
  }, [dashboardId, user, view]);

  // 4. Save Handlers
  const handleSaveData = async (newData) => {
    if (!user || !dashboardId) return;
    try {
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'dashboards', dashboardId);
      await setDoc(docRef, newData);
    } catch (e) {
      console.error("Error saving:", e);
      alert("Save failed");
    }
  };

  const handleSaveSettings = async (newSettings, newPassword) => {
    if (!user) return;
    try {
      // Save Branding
      await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'settings', 'global'), newSettings);
      
      // Save Admin Password separately
      if (newPassword) {
         await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'settings', 'admin'), { password: newPassword });
      }
      
      setShowSettingsModal(false);
    } catch (e) {
       console.error("Error saving settings:", e);
       alert("Failed to save settings");
    }
  };

  const primaryColor = mspSettings.primaryColor || '#82baff';
  const secondaryColor = mspSettings.secondaryColor || '#1e293b';
  const appBg = isDarkMode ? 'bg-slate-950' : 'bg-slate-50';
  
  if (view === 'loading') {
    return (
      <div className={`min-h-screen flex items-center justify-center ${appBg}`}>
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="h-10 w-10 animate-spin" style={{ color: primaryColor }} />
          <p className="text-slate-400 font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  const settingsModal = showSettingsModal && (
    <GlobalSettingsModal 
      settings={mspSettings} 
      adminSettings={adminSettings}
      onSave={handleSaveSettings} 
      onClose={() => setShowSettingsModal(false)}
      isDarkMode={true} 
    />
  );

  if (view === 'admin-login') {
    return (
      <AdminLogin 
        brandColor="#6366f1" 
        isDarkMode={true}
        mspSettings={mspSettings}
        currentPassword={adminSettings?.password}
        onCancel={() => setView('landing')}
        onLogin={() => setView('admin-list')} 
      />
    );
  }

  if (view === 'admin-list') {
    return (
      <>
        {settingsModal}
        <DashboardList 
          onLogout={() => setView('landing')} 
          onSelect={(id) => {
            setDashboardId(id);
            setView('admin-edit');
          }}
          onPreview={(id) => {
            setDashboardId(id);
            setIsAdminPreview(true);
            setView('client');
          }}
          onOpenSettings={() => setShowSettingsModal(true)}
        />
      </>
    );
  }

  if (view === 'admin-edit') {
    if (!dashboardData) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-500">Loading Dashboard Data...</div>;
    return (
      <AdminEditor 
        data={dashboardData} 
        mspSettings={mspSettings}
        onSave={handleSaveData} 
        onExit={() => {
           setDashboardId(null); 
           setView('admin-list');
        }}
        isDarkMode={true}
      />
    );
  }

  const isVisible = (key) => {
    return dashboardData?.widgetVisibility?.[key] !== false;
  };

  if (view === 'landing') {
    return <LandingPage onAdminLogin={() => setView('admin-login')} mspSettings={mspSettings} />;
  }

  if (view === 'client') {
      if (!dashboardData) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-500">Connecting to secure dashboard...</div>;
      
      return (
        <div className={`min-h-screen font-sans transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-900'}`}>
          
          {isAdminPreview && (
             <div className="fixed bottom-6 right-6 z-50">
               <button 
                 onClick={() => {
                   setIsAdminPreview(false);
                   setView('admin-list');
                   setDashboardId(null);
                 }}
                 className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg font-bold transition-all transform hover:scale-105 border border-indigo-400"
               >
                 <LogOut className="h-4 w-4" /> Exit Preview
               </button>
             </div>
           )}

          <header className={`border-b sticky top-0 z-30 transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-20">
                <div className="flex items-center gap-3">
                  {mspSettings.logoUrl ? (
                    <img src={mspSettings.logoUrl} alt="MSP Logo" className="h-10 w-auto object-contain max-w-[150px]" onError={(e) => e.target.style.display = 'none'} />
                  ) : (
                    <div className="rounded-lg p-2 shadow-sm" style={{ backgroundColor: primaryColor }}>
                      <LayoutDashboard className="h-6 w-6 text-white" />
                    </div>
                  )}
                  <div>
                    <h1 className={`text-xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      {mspSettings.companyName || "MSP Dashboard"}
                    </h1>
                    <p className="text-xs text-slate-500 font-medium">Client Portal</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                   <button 
                     onClick={() => setIsDarkMode(!isDarkMode)}
                     className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                     title="Toggle Theme"
                   >
                     {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                   </button>
                </div>
              </div>
            </div>
          </header>

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            
            <div className="mb-4">
              <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Executive Summary for {dashboardData.clientName || "Valued Client"}
              </h2>
              <p className="text-slate-500 mt-1">Real-time overview of your managed IT infrastructure.</p>
            </div>

            <ContactSection 
               contactName={dashboardData.contactName || "MSP Support"}
               contactInfo={dashboardData.contactInfo || "support@msp.com"}
               supportPhone={dashboardData.supportPhone}
               brandColor={primaryColor}
               isDarkMode={isDarkMode}
            />

            <TalkingPointsList points={dashboardData.talkingPoints} brandColor={primaryColor} isDarkMode={isDarkMode} />

            <div className="mb-10">
              <div className="flex items-center gap-2 mb-4">
                <span className={`px-2 py-1 rounded border text-xs font-bold uppercase ${isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>Operational</span>
                <div className={`h-px flex-1 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}></div>
              </div>
              
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {isVisible('activeUsers') && <StatCard icon={Users} label="Active Managed Users" value={dashboardData.activeUsers} colorClass='brand' brandColor={primaryColor} subtext="Total seats currently supported" isDarkMode={isDarkMode} />}
                {isVisible('managedDevices') && <StatCard icon={Monitor} label="Managed Devices" value={dashboardData.managedDevices} colorClass="bg-indigo-500" brandColor={primaryColor} subtext="Workstations & Servers" isDarkMode={isDarkMode} />}
                {isVisible('openTickets') && <StatCard icon={Ticket} label="Open Tickets" value={dashboardData.openTickets} colorClass="bg-orange-500" brandColor={primaryColor} subtext="Current active support requests" isDarkMode={isDarkMode} />}
                {isVisible('slaCompliance') && <StatCard icon={CheckCircle} label="SLA Compliance" value="100%" colorClass="bg-emerald-500" brandColor={primaryColor} subtext="Last 30 Days Performance" isDarkMode={isDarkMode} />}
              </div>
            </div>

            <div className="mb-10">
              <div className="flex items-center gap-2 mb-4">
                <span className={`px-2 py-1 rounded border text-xs font-bold uppercase ${isDarkMode ? 'bg-slate-950 border-red-900/30 text-red-400' : 'bg-red-50 border-red-100 text-red-600'}`}>Security</span>
                <div className={`h-px flex-1 ${isDarkMode ? 'bg-red-900/30' : 'bg-red-50'}`}></div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {isVisible('mfaAdoption') && <StatCard icon={Fingerprint} label="MFA Adoption" value={dashboardData.mfaAdoption} colorClass="bg-teal-500" brandColor={primaryColor} subtext="Security Policy Coverage" isDarkMode={isDarkMode} />}
                {isVisible('phishingRate') && <StatCard icon={ShieldAlert} label="Phishing Click Rate" value={dashboardData.phishingRate} colorClass="bg-red-500" brandColor={primaryColor} subtext="Simulated Campaign Results" isDarkMode={isDarkMode} />}
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                 <span className={`px-2 py-1 rounded border text-xs font-bold uppercase ${isDarkMode ? 'bg-slate-950 border-blue-900/30 text-blue-400' : 'bg-blue-50 border-blue-100 text-blue-600'}`}>Lifecycle</span>
                 <div className={`h-px flex-1 ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50'}`}></div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {isVisible('avgResponseTime') && <StatCard icon={Clock} label="Avg. Response Time" value={dashboardData.avgResponseTime} colorClass="bg-blue-600" brandColor={primaryColor} subtext="Average time to first response" isDarkMode={isDarkMode} />}
                {isVisible('hardwareEol') && <StatCard icon={Server} label="Hardware EOL Risk" value={dashboardData.hardwareEol} colorClass="bg-amber-500" brandColor={primaryColor} subtext="Devices approaching end of life" isDarkMode={isDarkMode} />}
                {isVisible('licenseRenewal') && <StatCard icon={Calendar} label="License Renewal In" value={`${dashboardData.licenseRenewalDays} Days`} colorClass="bg-purple-500" brandColor={primaryColor} subtext="Days until next 365 renewal" isDarkMode={isDarkMode} />}
              </div>
            </div>

          </main>

          <footer className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mt-8 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
            <div className="flex justify-between items-center">
              <p className="text-xs text-slate-500">
                &copy; {new Date().getFullYear()} {mspSettings.companyName || "Managed Service Provider"}. All rights reserved.
              </p>
            </div>
          </footer>

        </div>
      );
    }

    return null;
}