// Database.jsx
import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import * as XLSX from 'xlsx';
import "../styles/database.css";

// Custom Select Component for Region dropdown
const CustomSelect = ({ value, onChange, options, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="custom-select-container" ref={dropdownRef}>
      <div 
        className="custom-select-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <span className="custom-select-arrow">▼</span>
      </div>
      {isOpen && (
        <div className="custom-select-dropdown">
          <div 
            className={`custom-select-option ${value === 'all' ? 'selected' : ''}`}
            onClick={() => {
              onChange('all');
              setIsOpen(false);
            }}
          >
            All Regions
          </div>
          {options.map(option => (
            <div 
              key={option.value}
              className={`custom-select-option ${value === option.value ? 'selected' : ''}`}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Philippine Regions data with codes and full names
const PHILIPPINE_REGIONS = [
  { code: "NCR", name: "National Capital Region (NCR)" },
  { code: "CAR", name: "Cordillera Administrative Region (CAR)" },
  { code: "I", name: "Region I (Ilocos Region)" },
  { code: "II", name: "Region II (Cagayan Valley)" },
  { code: "III", name: "Region III (Central Luzon)" },
  { code: "IV-A", name: "Region IV-A (CALABARZON)" },
  { code: "MIMAROPA", name: "MIMAROPA Region" },
  { code: "V", name: "Region V (Bicol Region)" },
  { code: "VI", name: "Region VI (Western Visayas)" },
  { code: "VII", name: "Region VII (Central Visayas)" },
  { code: "VIII", name: "Region VIII (Eastern Visayas)" },
  { code: "IX", name: "Region IX (Zamboanga Peninsula)" },
  { code: "X", name: "Region X (Northern Mindanao)" },
  { code: "XI", name: "Region XI (Davao Region)" },
  { code: "XII", name: "Region XII (SOCCSKSARGEN)" },
  { code: "XIII", name: "Region XIII (Caraga)" },
  { code: "BARMM", name: "Bangsamoro Autonomous Region in Muslim Mindanao (BARMM)" }
];

// Helper function to extract region code from full region name
const extractRegionCode = (regionName) => {
  if (!regionName) return '';
  
  // Direct match for special regions
  if (regionName.includes('NCR')) return 'NCR';
  if (regionName.includes('CAR')) return 'CAR';
  if (regionName.includes('MIMAROPA')) return 'MIMAROPA';
  if (regionName.includes('BARMM')) return 'BARMM';
  
  // Match patterns like "Region I", "Region VI", "Region IV-A", etc.
  const match = regionName.match(/Region\s+([IVXLCDM]+(?:-[A-Z]+)?)/i);
  if (match) {
    return match[1];
  }
  
  // If no match, return the original (for backward compatibility)
  return regionName;
};

const Database = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [activeEvent, setActiveEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("users");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmData, setConfirmData] = useState(null);
  
  // Filter states
  const [searchName, setSearchName] = useState("");
  const [searchCompany, setSearchCompany] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const [filterRegion, setFilterRegion] = useState("all");
  const [filterEvent, setFilterEvent] = useState("all");
  const [filterDate, setFilterDate] = useState("");
  
  // Auto-refresh state
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [showRefreshToast, setShowRefreshToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  
  // Event form state
  const [showEventForm, setShowEventForm] = useState(false);
  const [eventName, setEventName] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventStartDate, setEventStartDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const [editingEvent, setEditingEvent] = useState(null);
  
  // Refs to prevent blinking
  const usersRef = useRef(users);
  const isFirstLoad = useRef(true);
  const pollingIntervalRef = useRef(null);
  
  const navigate = useNavigate();

  // Update ref when users change
  useEffect(() => {
    usersRef.current = users;
  }, [users]);

  // Define applyFilters with useCallback to prevent unnecessary re-renders
  const applyFilters = useCallback(() => {
    let filtered = [...usersRef.current];

    // Filter by name
    if (searchName.trim() !== "") {
      filtered = filtered.filter(user => 
        user.full_name.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    // Filter by company
    if (searchCompany.trim() !== "") {
      filtered = filtered.filter(user => 
        user.company_name.toLowerCase().includes(searchCompany.toLowerCase())
      );
    }

    // Filter by city
    if (searchCity.trim() !== "") {
      filtered = filtered.filter(user => 
        user.city && user.city.toLowerCase().includes(searchCity.toLowerCase())
      );
    }

    // Filter by region - IMPROVED VERSION
    if (filterRegion !== "all") {
      const selectedRegionName = filterRegion;
      const selectedCode = extractRegionCode(selectedRegionName);
      
      filtered = filtered.filter(user => {
        const userRegion = user.region || '';
        const userCode = extractRegionCode(userRegion);
        
        // Exact match of region codes
        return userCode === selectedCode;
      });
    }

    // Filter by event
    if (filterEvent !== "all") {
      filtered = filtered.filter(user => user.event_name === filterEvent);
    }

    // Filter by date
    if (filterDate) {
      const selectedDate = new Date(filterDate).toDateString();
      filtered = filtered.filter(user => {
        const userDate = new Date(user.created_at).toDateString();
        return userDate === selectedDate;
      });
    }

    setFilteredUsers(filtered);
  }, [searchName, searchCompany, searchCity, filterRegion, filterEvent, filterDate]);

  // Initial data fetch
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    fetchAllData();
  }, [navigate]);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  // Auto-refresh with polling (every 3 seconds) - OPTIMIZED to prevent blinking
  useEffect(() => {
    // Clear existing interval
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }

    if (activeTab === "users") {
      // Start new polling interval
      pollingIntervalRef.current = setInterval(() => {
        checkForUpdates();
      }, 3000);
    }

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [activeTab]);

  // Apply filters only when users reference changes
  useEffect(() => {
    applyFilters();
  }, [users, applyFilters]);

  // Check for updates and auto-refresh - OPTIMIZED to prevent blinking
  const checkForUpdates = async () => {
    try {
      const res = await axios.get("https://deltaplus-visitors-login-backend-ydkm.onrender.com/users");
      const newUsers = res.data;
      const currentUsers = usersRef.current;
      
      // Check if data has changed (by comparing length or content)
      const hasChanges = newUsers.length !== currentUsers.length || 
                        JSON.stringify(newUsers) !== JSON.stringify(currentUsers);
      
      if (hasChanges) {
        // Update users state (this will trigger applyFilters via useEffect)
        setUsers(newUsers);
        setLastUpdate(Date.now());
        
        // Show toast notification
        if (newUsers.length > currentUsers.length) {
          const newCount = newUsers.length - currentUsers.length;
          setToastMessage(`${newCount} new ${newCount === 1 ? 'visitor' : 'visitors'} registered!`);
        } else {
          setToastMessage("Visitor data updated");
        }
        setShowRefreshToast(true);
        
        // Auto-hide toast after 3 seconds
        setTimeout(() => {
          setShowRefreshToast(false);
        }, 3000);
      }
    } catch (err) {
      console.error("Error checking for updates:", err);
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchUsers(),
        fetchEvents(),
        fetchActiveEvent()
      ]);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
      isFirstLoad.current = false;
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get("https://deltaplus-visitors-login-backend-ydkm.onrender.com/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to fetch users");
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await axios.get("https://deltaplus-visitors-login-backend-ydkm.onrender.com/events");
      setEvents(res.data);
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  const fetchActiveEvent = async () => {
    try {
      const res = await axios.get("https://deltaplus-visitors-login-backend-ydkm.onrender.com/events/active");
      setActiveEvent(res.data);
    } catch (err) {
      console.error("Error fetching active event:", err);
    }
  };

  const clearFilters = () => {
    setSearchName("");
    setSearchCompany("");
    setSearchCity("");
    setFilterRegion("all");
    setFilterEvent("all");
    setFilterDate("");
  };

  // Format location for display
  const formatLocation = (user) => {
    const parts = [];
    if (user.city) parts.push(user.city);
    if (user.region) parts.push(user.region);
    
    return parts.length > 0 ? parts.join(', ') : 'No location provided';
  };

  // Format date range for display
  const formatDateRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const startMonth = start.toLocaleDateString('en-US', { month: 'short' });
    const endMonth = end.toLocaleDateString('en-US', { month: 'short' });
    
    if (startMonth === endMonth) {
      return `${startMonth} ${start.getDate()} - ${end.getDate()}, ${end.getFullYear()}`;
    } else {
      return `${startMonth} ${start.getDate()} - ${endMonth} ${end.getDate()}, ${end.getFullYear()}`;
    }
  };

  // Excel Download Function
  const exportToExcel = () => {
    const dataToExport = (searchName || searchCompany || searchCity || filterRegion !== "all" || filterEvent !== "all" || filterDate) ? filteredUsers : users;
    
    const excelData = dataToExport.map(user => ({
      'Name': user.full_name,
      'Company': user.company_name,
      'Phone': user.phone,
      'Email': user.email,
      'City/Municipality': user.city || '',
      'Region': user.region || '',
      'Location': formatLocation(user),
      'Event': user.event_name || 'No Event',
      'Registered': formatDate(user.created_at)
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);
    
    const colWidths = [
      { wch: 20 }, { wch: 20 }, { wch: 15 }, { wch: 25 },
      { wch: 20 }, { wch: 30 }, { wch: 40 }, { wch: 20 }, { wch: 20 }
    ];
    ws['!cols'] = colWidths;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Visitors');

    let filename = 'visitors';
    if (searchName || searchCompany || searchCity || filterRegion !== "all" || filterEvent !== "all" || filterDate) {
      filename += '_filtered';
    }
    filename += `_${new Date().toISOString().split('T')[0]}.xlsx`;

    XLSX.writeFile(wb, filename);
  };

  const handleSetActiveEvent = async (eventId) => {
    const event = events.find(e => e.id === eventId);
    setConfirmData({ eventId, eventName: event.event_name });
    setConfirmAction('activate');
    setShowConfirmDialog(true);
  };

  const confirmSetActiveEvent = async () => {
    try {
      await axios.post(`https://deltaplus-visitors-login-backend-ydkm.onrender.com/events/${confirmData.eventId}/set-active`);
      await fetchEvents();
      await fetchActiveEvent();
      setShowConfirmDialog(false);
      setConfirmData(null);
      setConfirmAction(null);
    } catch (err) {
      console.error("Error setting active event:", err);
      setError("Failed to set active event");
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    setConfirmData({ userId, userName });
    setConfirmAction('deleteUser');
    setShowConfirmDialog(true);
  };

  const confirmDeleteUser = async () => {
    try {
      await axios.delete(`https://deltaplus-visitors-login-backend-ydkm.onrender.com/users/${confirmData.userId}`);
      await fetchUsers();
      setShowConfirmDialog(false);
      setConfirmData(null);
      setConfirmAction(null);
    } catch (err) {
      console.error("Error deleting user:", err);
      setError("Failed to delete user");
    }
  };

  const handleLogout = () => {
    setConfirmAction('logout');
    setShowConfirmDialog(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  const cancelConfirm = () => {
    setShowConfirmDialog(false);
    setConfirmData(null);
    setConfirmAction(null);
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const eventData = {
        event_name: eventName,
        event_location: eventLocation,
        event_start_date: eventStartDate,
        event_end_date: eventEndDate
      };
      
      if (editingEvent) {
        await axios.put(`https://deltaplus-visitors-login-backend-ydkm.onrender.com/events/${editingEvent.id}`, eventData);
      } else {
        await axios.post("https://deltaplus-visitors-login-backend-ydkm.onrender.com/events", eventData);
      }
      
      // Reset form
      setEventName("");
      setEventLocation("");
      setEventStartDate("");
      setEventEndDate("");
      setShowEventForm(false);
      setEditingEvent(null);
      
      // Refresh data
      await fetchEvents();
      await fetchActiveEvent();
    } catch (err) {
      console.error("Error saving event:", err);
      setError("Failed to save event");
    }
  };

  const handleEditEvent = (event) => {
    // Set editing event
    setEditingEvent(event);
    
    // Populate form fields
    setEventName(event.event_name);
    setEventLocation(event.event_location || "");
    
    // Format dates for input fields (YYYY-MM-DD)
    const startDate = event.event_start_date ? new Date(event.event_start_date) : null;
    const endDate = event.event_end_date ? new Date(event.event_end_date) : null;
    
    if (startDate) {
      const year = startDate.getFullYear();
      const month = String(startDate.getMonth() + 1).padStart(2, '0');
      const day = String(startDate.getDate()).padStart(2, '0');
      setEventStartDate(`${year}-${month}-${day}`);
    }
    
    if (endDate) {
      const year = endDate.getFullYear();
      const month = String(endDate.getMonth() + 1).padStart(2, '0');
      const day = String(endDate.getDate()).padStart(2, '0');
      setEventEndDate(`${year}-${month}-${day}`);
    }
    
    // Show the form
    setShowEventForm(true);
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await axios.delete(`https://deltaplus-visitors-login-backend-ydkm.onrender.com/events/${eventId}`);
        await fetchEvents();
        await fetchActiveEvent();
        await fetchUsers();
      } catch (err) {
        console.error("Error deleting event:", err);
        setError("Failed to delete event");
      }
    }
  };

  const cancelEventForm = () => {
    setShowEventForm(false);
    setEditingEvent(null);
    setEventName("");
    setEventLocation("");
    setEventStartDate("");
    setEventEndDate("");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && isFirstLoad.current) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard">
      {/* Fixed Header */}
      <header className="dashboard-header fixed-header">
        <div className="dashboard-container header-container">
          <div className="header-left">
            <div className="logo">
              <img 
                src="/deltaplus.png" 
                alt="Deltaplus" 
                className="logo-image"
              />
            </div>
            
            <div className="header-nav">
              <button 
                className={`nav-btn ${activeTab === "users" ? "active" : ""}`}
                onClick={() => setActiveTab("users")}
              >
                Visitors
              </button>
              <button 
                className={`nav-btn ${activeTab === "events" ? "active" : ""}`}
                onClick={() => setActiveTab("events")}
              >
                Events
              </button>
            </div>
          </div>

          <div className="header-right">
            <span className="user-email">{localStorage.getItem("userEmail")}</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content - Scrollable */}
      <main className="main-content">
        <div className="dashboard-container">
          {error && (
            <div className="error-alert">
              {error}
            </div>
          )}

          {/* Auto-refresh Toast Notification */}
          {showRefreshToast && (
            <div className="refresh-toast">
              <span className="refresh-icon">🔄</span>
              <span className="refresh-message">{toastMessage}</span>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <div>
              <div className="section-header">
                <h2>Registered Visitors</h2>
                <button onClick={exportToExcel} className="export-btn" title="Export to Excel">
                  <span className="export-icon">📊</span>
                  Export to Excel
                </button>
              </div>

              {/* Active Event Card */}
              {activeEvent && activeEvent.event_name && (
                <div className="active-event-card">
                  <span className="card-dot"></span>
                  <div className="card-content">
                    <span className="card-label">Current Active Event</span>
                    <span className="card-event">{activeEvent.event_name}</span>
                    <span className="card-location">{activeEvent.event_location}</span>
                    <span className="card-schedule">
                      {formatDateRange(activeEvent.event_start_date, activeEvent.event_end_date)}
                    </span>
                  </div>
                </div>
              )}

              {/* Filters Section */}
              <div className="filters-container">
                <div className="filters-row">
                  <div className="filter-group">
                    <label>Name</label>
                    <input
                      type="text"
                      placeholder="Search name..."
                      value={searchName}
                      onChange={(e) => setSearchName(e.target.value)}
                      className="filter-input"
                    />
                  </div>

                  <div className="filter-group">
                    <label>Company</label>
                    <input
                      type="text"
                      placeholder="Search company..."
                      value={searchCompany}
                      onChange={(e) => setSearchCompany(e.target.value)}
                      className="filter-input"
                    />
                  </div>

                  <div className="filter-group">
                    <label>City</label>
                    <input
                      type="text"
                      placeholder="Search city..."
                      value={searchCity}
                      onChange={(e) => setSearchCity(e.target.value)}
                      className="filter-input"
                    />
                  </div>

                  <div className="filter-group">
                    <label>Region</label>
                    <CustomSelect
                      value={filterRegion}
                      onChange={setFilterRegion}
                      options={PHILIPPINE_REGIONS.map(region => ({ 
                        value: region.name,
                        label: region.name 
                      }))}
                      placeholder="Select Region"
                    />
                  </div>

                  <div className="filter-group">
                    <label>Event</label>
                    <select 
                      value={filterEvent} 
                      onChange={(e) => setFilterEvent(e.target.value)}
                      className="filter-select"
                    >
                      <option value="all">All Events</option>
                      {events.map(event => (
                        <option key={event.id} value={event.event_name}>
                          {event.event_name} {event.is_active ? '(Active)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="filter-group">
                    <label>Date</label>
                    <input
                      type="date"
                      value={filterDate}
                      onChange={(e) => setFilterDate(e.target.value)}
                      className="filter-input"
                    />
                  </div>

                  <div className="filter-group filter-clear-group">
                    <label>&nbsp;</label>
                    <button 
                      onClick={clearFilters} 
                      className="clear-filters-icon-btn"
                      title="Clear all filters"
                    >
                      ✕
                    </button>
                  </div>
                </div>
                
                <div className="filter-results">
                  Showing {filteredUsers.length} of {users.length} visitors
                </div>
              </div>

              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Company</th>
                      <th>Phone</th>
                      <th>Email</th>
                      <th>City</th>
                      <th>Region</th>
                      <th>Event</th>
                      <th>Registered</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <tr key={user.id}>
                          <td>{user.full_name}</td>
                          <td>
                            <span className="company-badge">
                              {user.company_name}
                            </span>
                          </td>
                          <td>{user.phone}</td>
                          <td>{user.email}</td>
                          <td>{user.city || '—'}</td>
                          <td>{user.region || '—'}</td>
                          <td>
                            {user.event_name ? (
                              <span className={`event-badge ${user.event_name === activeEvent?.event_name ? 'active' : ''}`}>
                                {user.event_name}
                              </span>
                            ) : (
                              <span className="event-badge">—</span>
                            )}
                          </td>
                          <td>{formatDate(user.created_at)}</td>
                          <td>
                            <div className="action-group">
                              <button
                                onClick={() => handleDeleteUser(user.id, user.full_name)}
                                className="icon-btn delete"
                                title="Delete user"
                              >
                                ×
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="9" className="empty-state">
                          No visitors match your filters
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Events Tab */}
          {activeTab === "events" && (
            <div>
              <div className="section-header">
                <h2>Events</h2>
                <button
                  onClick={() => setShowEventForm(true)}
                  className="primary-btn small"
                >
                  + New Event
                </button>
              </div>

              {/* Active Event Card */}
              {activeEvent && activeEvent.event_name && (
                <div className="active-event-card">
                  <span className="card-dot"></span>
                  <div className="card-content">
                    <span className="card-label">Currently Active</span>
                    <span className="card-event">{activeEvent.event_name}</span>
                    <span className="card-location">{activeEvent.event_location}</span>
                    <span className="card-schedule">
                      {formatDateRange(activeEvent.event_start_date, activeEvent.event_end_date)}
                    </span>
                    <span className="card-badge">Active</span>
                  </div>
                </div>
              )}

              {/* Event Form */}
              {showEventForm && (
                <div className="form-container">
                  <form onSubmit={handleCreateEvent}>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Event Name</label>
                        <input
                          type="text"
                          value={eventName}
                          onChange={(e) => setEventName(e.target.value)}
                          placeholder="e.g., Tech Conference 2024"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Location</label>
                        <input
                          type="text"
                          value={eventLocation}
                          onChange={(e) => setEventLocation(e.target.value)}
                          placeholder="e.g., SMX Convention Center"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Start Date</label>
                        <input
                          type="date"
                          value={eventStartDate}
                          onChange={(e) => setEventStartDate(e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>End Date</label>
                        <input
                          type="date"
                          value={eventEndDate}
                          onChange={(e) => setEventEndDate(e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-actions">
                        <button type="submit" className="primary-btn">
                          {editingEvent ? "Update Event" : "Create Event"}
                        </button>
                        <button type="button" onClick={cancelEventForm} className="cancel-btn">
                          Cancel
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              )}

              {/* Events Table */}
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Event Name</th>
                      <th>Location</th>
                      <th>Date Range</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.length > 0 ? (
                      events.map((event) => (
                        <tr key={event.id}>
                          <td>#{event.id.slice(-6)}</td>
                          <td>
                            <span className={`event-badge ${event.is_active ? 'active' : ''}`}>
                              {event.event_name}
                            </span>
                          </td>
                          <td>{event.event_location}</td>
                          <td>{formatDateRange(event.event_start_date, event.event_end_date)}</td>
                          <td>
                            <span className={`status-badge ${event.is_active ? 'active' : 'inactive'}`}>
                              {event.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td>{formatDate(event.created_at)}</td>
                          <td>
                            <div className="action-group">
                              {!event.is_active && (
                                <button
                                  onClick={() => handleSetActiveEvent(event.id)}
                                  className="icon-btn set-active"
                                  title="Set as active"
                                >
                                  ✓
                                </button>
                              )}
                              <button
                                onClick={() => handleEditEvent(event)}
                                className="icon-btn edit"
                                title="Edit"
                              >
                                ✎
                              </button>
                              <button
                                onClick={() => handleDeleteEvent(event.id)}
                                className="icon-btn delete"
                                title="Delete"
                              >
                                ×
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="empty-state">
                          No events created
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Confirmation Modal */}
          {showConfirmDialog && (
            <div className="modal-overlay">
              <div className="modal">
                <div className="modal-header">
                  <h3 className="modal-title">
                    {confirmAction === 'activate' && 'Activate Event'}
                    {confirmAction === 'logout' && 'Confirm Logout'}
                    {confirmAction === 'deleteUser' && 'Delete Visitor'}
                  </h3>
                </div>
                <div className="modal-body">
                  {confirmAction === 'activate' && (
                    <p>Are you sure you want to activate <span className="highlight">{confirmData?.eventName}</span>?</p>
                  )}
                  {confirmAction === 'logout' && (
                    <p>Are you sure you want to log out?</p>
                  )}
                  {confirmAction === 'deleteUser' && (
                    <p>Are you sure you want to delete <span className="highlight">{confirmData?.userName}</span>? This action cannot be undone.</p>
                  )}
                </div>
                <div className="modal-footer">
                  <button onClick={cancelConfirm} className="modal-btn modal-btn-secondary">
                    Cancel
                  </button>
                  <button 
                    onClick={
                      confirmAction === 'activate' ? confirmSetActiveEvent :
                      confirmAction === 'logout' ? confirmLogout :
                      confirmAction === 'deleteUser' ? confirmDeleteUser : null
                    } 
                    className={`modal-btn modal-btn-primary ${
                      confirmAction === 'activate' ? 'activate' : 
                      confirmAction === 'logout' ? 'logout' : 
                      'delete'
                    }`}
                  >
                    {confirmAction === 'activate' ? 'Activate' : 
                     confirmAction === 'logout' ? 'Logout' : 
                     'Delete'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Database;