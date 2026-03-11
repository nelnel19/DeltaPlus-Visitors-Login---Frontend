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

// Philippine Regions data with codes and names
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

// Simple direct mapping for region filtering
const REGION_DIRECT_MATCH = {
  "National Capital Region (NCR)": "NCR",
  "Cordillera Administrative Region (CAR)": "CAR",
  "Region I (Ilocos Region)": "I",
  "Region II (Cagayan Valley)": "II",
  "Region III (Central Luzon)": "III",
  "Region IV-A (CALABARZON)": "IV-A",
  "MIMAROPA Region": "MIMAROPA",
  "Region V (Bicol Region)": "V",
  "Region VI (Western Visayas)": "VI",
  "Region VII (Central Visayas)": "VII",
  "Region VIII (Eastern Visayas)": "VIII",
  "Region IX (Zamboanga Peninsula)": "IX",
  "Region X (Northern Mindanao)": "X",
  "Region XI (Davao Region)": "XI",
  "Region XII (SOCCSKSARGEN)": "XII",
  "Region XIII (Caraga)": "XIII",
  "Bangsamoro Autonomous Region in Muslim Mindanao (BARMM)": "BARMM"
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
  
  // State for expanded address rows
  const [expandedRows, setExpandedRows] = useState(new Set());
  
  // Filter states
  const [searchName, setSearchName] = useState("");
  const [searchCompany, setSearchCompany] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const [filterRegion, setFilterRegion] = useState("all");
  const [filterEvent, setFilterEvent] = useState("all");
  const [filterDate, setFilterDate] = useState("");
  
  // Event form state
  const [showEventForm, setShowEventForm] = useState(false);
  const [eventName, setEventName] = useState("");
  const [eventSchedule, setEventSchedule] = useState("");
  const [editingEvent, setEditingEvent] = useState(null);
  
  const navigate = useNavigate();

  // Define applyFilters with useCallback to prevent unnecessary re-renders
  const applyFilters = useCallback(() => {
    let filtered = [...users];

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

    // Filter by region - SIMPLIFIED AND RELIABLE VERSION
    if (filterRegion !== "all") {
      // Get the selected region name from the filter
      const selectedRegionName = filterRegion;
      
      filtered = filtered.filter(user => {
        const userRegion = user.region || '';
        
        // Direct string comparison - check if user region exactly matches or contains the selected region name
        // This works because the registration form stores the full region name
        if (userRegion === selectedRegionName) {
          return true;
        }
        
        // For partial matches, check if the user region contains the selected region name
        // or if the selected region name contains the user region (for variations)
        return userRegion.includes(selectedRegionName) || 
               selectedRegionName.includes(userRegion);
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
  }, [users, searchName, searchCompany, searchCity, filterRegion, filterEvent, filterDate]);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    fetchUsers();
    fetchEvents();
    fetchActiveEvent();
  }, [navigate]);

  useEffect(() => {
    // Apply filters whenever users or filter states change
    applyFilters();
  }, [applyFilters]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8000/users");
      setUsers(res.data);
      setFilteredUsers(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to fetch users");
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await axios.get("http://localhost:8000/events");
      setEvents(res.data);
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  const fetchActiveEvent = async () => {
    try {
      const res = await axios.get("http://localhost:8000/events/active");
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

  // Toggle row expansion
  const toggleRowExpansion = (userId) => {
    const newExpandedRows = new Set(expandedRows);
    if (expandedRows.has(userId)) {
      newExpandedRows.delete(userId);
    } else {
      newExpandedRows.add(userId);
    }
    setExpandedRows(newExpandedRows);
  };

  // Format full address for display
  const formatAddress = (user) => {
    const parts = [];
    if (user.house_number) parts.push(user.house_number);
    if (user.street_name) parts.push(user.street_name);
    if (user.barangay) parts.push(user.barangay);
    if (user.city) parts.push(user.city);
    if (user.region) parts.push(user.region);
    
    return parts.length > 0 ? parts.join(', ') : 'No address provided';
  };

  // Format address lines for expanded view
  const formatAddressLines = (user) => {
    const lines = [];
    if (user.house_number) lines.push({ label: 'House/Bldg', value: user.house_number });
    if (user.street_name) lines.push({ label: 'Street', value: user.street_name });
    if (user.barangay) lines.push({ label: 'Barangay', value: user.barangay });
    if (user.city) lines.push({ label: 'City', value: user.city });
    if (user.region) lines.push({ label: 'Region', value: user.region });
    
    return lines;
  };

  // Excel Download Function
  const exportToExcel = () => {
    const dataToExport = (searchName || searchCompany || searchCity || filterRegion !== "all" || filterEvent !== "all" || filterDate) ? filteredUsers : users;
    
    const excelData = dataToExport.map(user => ({
      'Name': user.full_name,
      'Company': user.company_name,
      'Phone': user.phone,
      'Email': user.email,
      'House/Bldg #': user.house_number || '',
      'Street': user.street_name || '',
      'Barangay': user.barangay || '',
      'City': user.city || '',
      'Region': user.region || '',
      'Full Address': formatAddress(user),
      'Event': user.event_name || 'No Event',
      'Registered': formatDate(user.created_at)
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);
    
    const colWidths = [
      { wch: 20 }, { wch: 20 }, { wch: 15 }, { wch: 25 },
      { wch: 12 }, { wch: 15 }, { wch: 15 }, { wch: 15 },
      { wch: 15 }, { wch: 40 }, { wch: 20 }, { wch: 20 }
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
      await axios.post(`http://localhost:8000/events/${confirmData.eventId}/set-active`);
      fetchEvents();
      fetchActiveEvent();
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
      await axios.delete(`http://localhost:8000/users/${confirmData.userId}`);
      fetchUsers();
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
      const localDate = new Date(eventSchedule);
      
      const year = localDate.getFullYear();
      const month = String(localDate.getMonth() + 1).padStart(2, '0');
      const day = String(localDate.getDate()).padStart(2, '0');
      const hours = String(localDate.getHours()).padStart(2, '0');
      const minutes = String(localDate.getMinutes()).padStart(2, '0');
      
      const localDateTimeString = `${year}-${month}-${day} ${hours}:${minutes}:00`;
      
      const eventData = {
        event_name: eventName,
        event_schedule: localDateTimeString
      };
      
      if (editingEvent) {
        await axios.put(`http://localhost:8000/events/${editingEvent.id}`, eventData);
      } else {
        await axios.post("http://localhost:8000/events", eventData);
      }
      
      setEventName("");
      setEventSchedule("");
      setShowEventForm(false);
      setEditingEvent(null);
      fetchEvents();
      fetchActiveEvent();
    } catch (err) {
      console.error("Error saving event:", err);
      setError("Failed to save event");
    }
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setEventName(event.event_name);
    
    const eventDate = new Date(event.event_schedule);
    
    const year = eventDate.getFullYear();
    const month = String(eventDate.getMonth() + 1).padStart(2, '0');
    const day = String(eventDate.getDate()).padStart(2, '0');
    const hours = String(eventDate.getHours()).padStart(2, '0');
    const minutes = String(eventDate.getMinutes()).padStart(2, '0');
    
    setEventSchedule(`${year}-${month}-${day}T${hours}:${minutes}`);
    setShowEventForm(true);
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await axios.delete(`http://localhost:8000/events/${eventId}`);
        fetchEvents();
        fetchActiveEvent();
        fetchUsers();
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
    setEventSchedule("");
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

  if (loading) {
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
                    <span className="card-schedule">
                      {formatDate(activeEvent.event_schedule)}
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
                      <th>Address</th>
                      <th>Event</th>
                      <th>Registered</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <React.Fragment key={user.id}>
                          <tr>
                            <td>{user.full_name}</td>
                            <td>
                              <span className="company-badge">
                                {user.company_name}
                              </span>
                            </td>
                            <td>{user.phone}</td>
                            <td>{user.email}</td>
                            <td>
                              <div className="address-cell">
                                <span className="address-preview">
                                  {formatAddress(user).substring(0, 25)}
                                  {formatAddress(user).length > 25 ? '...' : ''}
                                </span>
                                <button 
                                  className={`expand-address-btn ${expandedRows.has(user.id) ? 'expanded' : ''}`}
                                  onClick={() => toggleRowExpansion(user.id)}
                                  title={expandedRows.has(user.id) ? "Hide full address" : "Show full address"}
                                >
                                  ▼
                                </button>
                              </div>
                            </td>
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
                          {expandedRows.has(user.id) && (
                            <tr className="expanded-row">
                              <td colSpan="8">
                                <div className="expanded-address">
                                  <div className="expanded-address-title">Full Address</div>
                                  <div className="expanded-address-content">
                                    {formatAddressLines(user).map((line, index) => (
                                      <div key={index} className="expanded-address-line">
                                        <span className="expanded-address-label">{line.label}:</span>
                                        <span className="expanded-address-value">{line.value}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="empty-state">
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
                    <span className="card-schedule">
                      {formatDate(activeEvent.event_schedule)}
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
                        <label>Schedule</label>
                        <input
                          type="datetime-local"
                          value={eventSchedule}
                          onChange={(e) => setEventSchedule(e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-actions">
                        <button type="submit" className="primary-btn">
                          {editingEvent ? "Update" : "Create"}
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
                      <th>Schedule</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.length > 0 ? (
                      events.map((event) => (
                        <tr key={event.id}>
                          <td>#{event.id}</td>
                          <td>
                            <span className={`event-badge ${event.is_active ? 'active' : ''}`}>
                              {event.event_name}
                            </span>
                          </td>
                          <td>{formatDate(event.event_schedule)}</td>
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
                        <td colSpan="6" className="empty-state">
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