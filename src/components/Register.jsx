// Register.jsx - Complete with flexible mobile number validation, optional inquiries field, POSITION field, and duplicate email allowed
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/register.css";

// Searchable Custom Select Component for dropdowns
const SearchableSelect = ({ value, onChange, options, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const [dropdownPosition, setDropdownPosition] = useState("bottom");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Calculate dropdown position to avoid overlapping
  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const spaceBelow = windowHeight - rect.bottom;
      const spaceAbove = rect.top;
      const dropdownHeight = 320;
      
      if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
        setDropdownPosition("top");
      } else {
        setDropdownPosition("bottom");
      }
    }
  }, [isOpen]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current.focus();
      }, 100);
    }
  }, [isOpen]);

  const selectedOption = options.find(opt => opt.value === value);
  
  // Filter options based on search term
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="custom-select-container" ref={dropdownRef}>
      <div 
        className={`custom-select-trigger ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={!selectedOption ? 'placeholder' : ''}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className={`custom-select-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </div>
      {isOpen && (
        <div className={`custom-select-dropdown searchable ${dropdownPosition}`}>
          <div className="search-input-wrapper">
            <input
              ref={searchInputRef}
              type="text"
              className="search-input"
              placeholder={`Search ${placeholder.toLowerCase()}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
            {searchTerm && (
              <button 
                className="search-clear"
                onClick={() => setSearchTerm("")}
                type="button"
              >
                ✕
              </button>
            )}
          </div>
          <div className="options-list">
            {filteredOptions.length > 0 ? (
              filteredOptions.map(option => (
                <div 
                  key={option.value}
                  className={`custom-select-option ${value === option.value ? 'selected' : ''}`}
                  onClick={() => handleSelect(option.value)}
                >
                  {option.label}
                </div>
              ))
            ) : (
              <div className="no-options">
                No results found for "{searchTerm}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Philippine Regions data - Using both code and full name for compatibility
const PHILIPPINE_REGIONS = [
  { value: "NCR", label: "National Capital Region (NCR)", fullName: "National Capital Region (NCR)" },
  { value: "CAR", label: "Cordillera Administrative Region (CAR)", fullName: "Cordillera Administrative Region (CAR)" },
  { value: "I", label: "Region I (Ilocos Region)", fullName: "Region I (Ilocos Region)" },
  { value: "II", label: "Region II (Cagayan Valley)", fullName: "Region II (Cagayan Valley)" },
  { value: "III", label: "Region III (Central Luzon)", fullName: "Region III (Central Luzon)" },
  { value: "IV-A", label: "Region IV-A (CALABARZON)", fullName: "Region IV-A (CALABARZON)" },
  { value: "MIMAROPA", label: "MIMAROPA Region", fullName: "MIMAROPA Region" },
  { value: "V", label: "Region V (Bicol Region)", fullName: "Region V (Bicol Region)" },
  { value: "VI", label: "Region VI (Western Visayas)", fullName: "Region VI (Western Visayas)" },
  { value: "VII", label: "Region VII (Central Visayas)", fullName: "Region VII (Central Visayas)" },
  { value: "VIII", label: "Region VIII (Eastern Visayas)", fullName: "Region VIII (Eastern Visayas)" },
  { value: "IX", label: "Region IX (Zamboanga Peninsula)", fullName: "Region IX (Zamboanga Peninsula)" },
  { value: "X", label: "Region X (Northern Mindanao)", fullName: "Region X (Northern Mindanao)" },
  { value: "XI", label: "Region XI (Davao Region)", fullName: "Region XI (Davao Region)" },
  { value: "XII", label: "Region XII (SOCCSKSARGEN)", fullName: "Region XII (SOCCSKSARGEN)" },
  { value: "XIII", label: "Region XIII (Caraga)", fullName: "Region XIII (Caraga)" },
  { value: "BARMM", label: "Bangsamoro Autonomous Region in Muslim Mindanao (BARMM)", fullName: "Bangsamoro Autonomous Region in Muslim Mindanao (BARMM)" }
];

// Complete cities organized by region code
const CITIES_BY_REGION = {
  NCR: [
    { value: "Caloocan", label: "Caloocan" },
    { value: "Las Piñas", label: "Las Piñas" },
    { value: "Makati", label: "Makati" },
    { value: "Malabon", label: "Malabon" },
    { value: "Mandaluyong", label: "Mandaluyong" },
    { value: "Manila", label: "Manila" },
    { value: "Marikina", label: "Marikina" },
    { value: "Muntinlupa", label: "Muntinlupa" },
    { value: "Navotas", label: "Navotas" },
    { value: "Parañaque", label: "Parañaque" },
    { value: "Pasay", label: "Pasay" },
    { value: "Pasig", label: "Pasig" },
    { value: "Pateros", label: "Pateros" },
    { value: "Quezon City", label: "Quezon City" },
    { value: "San Juan", label: "San Juan" },
    { value: "Taguig", label: "Taguig" },
    { value: "Valenzuela", label: "Valenzuela" }
  ],
  CAR: [
    { value: "Baguio", label: "Baguio" },
    { value: "Tabuk", label: "Tabuk" },
    { value: "Lamut", label: "Lamut" },
    { value: "Lagawe", label: "Lagawe" },
    { value: "Bontoc", label: "Bontoc" },
    { value: "La Trinidad", label: "La Trinidad" },
    { value: "Bauko", label: "Bauko" }
  ],
  I: [
    { value: "Alaminos", label: "Alaminos" },
    { value: "Dagupan", label: "Dagupan" },
    { value: "Laoag", label: "Laoag" },
    { value: "San Carlos (Pangasinan)", label: "San Carlos (Pangasinan)" },
    { value: "Urdaneta", label: "Urdaneta" },
    { value: "Vigan", label: "Vigan" },
    { value: "Batac", label: "Batac" },
    { value: "Candon", label: "Candon" }
  ],
  II: [
    { value: "Cauayan", label: "Cauayan" },
    { value: "Santiago", label: "Santiago" },
    { value: "Tuguegarao", label: "Tuguegarao" },
    { value: "Ilagan", label: "Ilagan" }
  ],
  III: [
    { value: "Angeles", label: "Angeles" },
    { value: "Balanga", label: "Balanga" },
    { value: "Cabanatuan", label: "Cabanatuan" },
    { value: "Gapan", label: "Gapan" },
    { value: "Mabalacat", label: "Mabalacat" },
    { value: "Malolos", label: "Malolos" },
    { value: "Meycauayan", label: "Meycauayan" },
    { value: "Muñoz", label: "Science City of Muñoz" },
    { value: "Olongapo", label: "Olongapo" },
    { value: "Palayan", label: "Palayan" },
    { value: "San Fernando (Pampanga)", label: "San Fernando (Pampanga)" },
    { value: "San Jose (Nueva Ecija)", label: "San Jose (Nueva Ecija)" },
    { value: "San Jose Del Monte", label: "San Jose Del Monte" },
    { value: "Tarlac", label: "Tarlac" },
    { value: "Baliwag", label: "Baliwag" }
  ],
  "IV-A": [
    { value: "Antipolo", label: "Antipolo" },
    { value: "Bacoor", label: "Bacoor" },
    { value: "Batangas", label: "Batangas" },
    { value: "Biñan", label: "Biñan" },
    { value: "Cabuyao", label: "Cabuyao" },
    { value: "Calamba", label: "Calamba" },
    { value: "Cavite", label: "Cavite" },
    { value: "Dasmariñas", label: "Dasmariñas" },
    { value: "General Trias", label: "General Trias" },
    { value: "Imus", label: "Imus" },
    { value: "Lipa", label: "Lipa" },
    { value: "Lucena", label: "Lucena" },
    { value: "San Pablo", label: "San Pablo" },
    { value: "San Pedro", label: "San Pedro" },
    { value: "Santa Rosa", label: "Santa Rosa" },
    { value: "Santo Tomas", label: "Santo Tomas" },
    { value: "Tagaytay", label: "Tagaytay" },
    { value: "Tanauan", label: "Tanauan" },
    { value: "Tayabas", label: "Tayabas" },
    { value: "Trece Martires", label: "Trece Martires" },
    { value: "Silang", label: "Silang" },
    { value: "Rosario", label: "Rosario" }
  ],
  MIMAROPA: [
    { value: "Calapan", label: "Calapan" },
    { value: "Puerto Princesa", label: "Puerto Princesa" },
    { value: "Odiongan", label: "Odiongan" },
    { value: "Roxas (Mindoro)", label: "Roxas" }
  ],
  V: [
    { value: "Iriga", label: "Iriga" },
    { value: "Legazpi", label: "Legazpi" },
    { value: "Ligao", label: "Ligao" },
    { value: "Masbate", label: "Masbate" },
    { value: "Naga (Camarines Sur)", label: "Naga (Camarines Sur)" },
    { value: "Sorsogon", label: "Sorsogon" },
    { value: "Tabaco", label: "Tabaco" },
    { value: "Daet", label: "Daet" }
  ],
  VI: [
    { value: "Bacolod", label: "Bacolod" },
    { value: "Bago", label: "Bago" },
    { value: "Cadiz", label: "Cadiz" },
    { value: "Escalante", label: "Escalante" },
    { value: "Himamaylan", label: "Himamaylan" },
    { value: "Iloilo", label: "Iloilo City" },
    { value: "Kabankalan", label: "Kabankalan" },
    { value: "La Carlota", label: "La Carlota" },
    { value: "Passi", label: "Passi" },
    { value: "Roxas (Capiz)", label: "Roxas" },
    { value: "Sagay", label: "Sagay" },
    { value: "San Carlos (Negros Occidental)", label: "San Carlos (Negros Occidental)" },
    { value: "Silay", label: "Silay" },
    { value: "Sipalay", label: "Sipalay" },
    { value: "Talisay (Negros Occidental)", label: "Talisay" },
    { value: "Victorias", label: "Victorias" },
    { value: "Kalibo", label: "Kalibo" }
  ],
  VII: [
    { value: "Bais", label: "Bais" },
    { value: "Bayawan", label: "Bayawan" },
    { value: "Bogo", label: "Bogo" },
    { value: "Canlaon", label: "Canlaon" },
    { value: "Carcar", label: "Carcar" },
    { value: "Cebu", label: "Cebu City" },
    { value: "Danao", label: "Danao" },
    { value: "Dumaguete", label: "Dumaguete" },
    { value: "Guihulngan", label: "Guihulngan" },
    { value: "Lapu-Lapu", label: "Lapu-Lapu" },
    { value: "Mandaue", label: "Mandaue" },
    { value: "Naga (Cebu)", label: "Naga (Cebu)" },
    { value: "San Carlos (Negros Oriental)", label: "San Carlos" },
    { value: "Talisay (Cebu)", label: "Talisay" },
    { value: "Tanjay", label: "Tanjay" },
    { value: "Toledo", label: "Toledo" },
    { value: "Tagbilaran", label: "Tagbilaran" }
  ],
  VIII: [
    { value: "Baybay", label: "Baybay" },
    { value: "Borongan", label: "Borongan" },
    { value: "Calbayog", label: "Calbayog" },
    { value: "Catbalogan", label: "Catbalogan" },
    { value: "Maasin", label: "Maasin" },
    { value: "Ormoc", label: "Ormoc" },
    { value: "Tacloban", label: "Tacloban" }
  ],
  IX: [
    { value: "Dapitan", label: "Dapitan" },
    { value: "Dipolog", label: "Dipolog" },
    { value: "Isabela (Basilan)", label: "Isabela (Basilan)" },
    { value: "Pagadian", label: "Pagadian" },
    { value: "Zamboanga", label: "Zamboanga City" }
  ],
  X: [
    { value: "Cagayan de Oro", label: "Cagayan de Oro" },
    { value: "El Salvador", label: "El Salvador" },
    { value: "Gingoog", label: "Gingoog" },
    { value: "Iligan", label: "Iligan" },
    { value: "Malaybalay", label: "Malaybalay" },
    { value: "Oroquieta", label: "Oroquieta" },
    { value: "Ozamiz", label: "Ozamiz" },
    { value: "Tangub", label: "Tangub" },
    { value: "Valencia (Bukidnon)", label: "Valencia" }
  ],
  XI: [
    { value: "Davao", label: "Davao City" },
    { value: "Digos", label: "Digos" },
    { value: "Mati", label: "Mati" },
    { value: "Panabo", label: "Panabo" },
    { value: "Samal", label: "Island Garden City of Samal" },
    { value: "Tagum", label: "Tagum" },
    { value: "Malita", label: "Malita" }
  ],
  XII: [
    { value: "Cotabato", label: "Cotabato City" },
    { value: "General Santos", label: "General Santos" },
    { value: "Kidapawan", label: "Kidapawan" },
    { value: "Koronadal", label: "Koronadal" },
    { value: "Tacurong", label: "Tacurong" },
    { value: "Polomolok", label: "Polomolok" }
  ],
  XIII: [
    { value: "Bayugan", label: "Bayugan" },
    { value: "Bislig", label: "Bislig" },
    { value: "Butuan", label: "Butuan" },
    { value: "Cabadbaran", label: "Cabadbaran" },
    { value: "Surigao", label: "Surigao" },
    { value: "Tandag", label: "Tandag" }
  ],
  BARMM: [
    { value: "Lamitan", label: "Lamitan" },
    { value: "Marawi", label: "Marawi" },
    { value: "Jolo", label: "Jolo" },
    { value: "Bongao", label: "Bongao" }
  ]
};

// Get all cities for a region, sorted alphabetically
const getCitiesForRegion = (regionCode) => {
  if (!regionCode || !CITIES_BY_REGION[regionCode]) {
    return [];
  }
  return [...CITIES_BY_REGION[regionCode]].sort((a, b) => 
    a.label.localeCompare(b.label)
  );
};

// Format phone number - only remove special characters and spaces
const formatPhilippineNumber = (value) => {
  // Only get digits
  let cleaned = value.replace(/\D/g, '');
  
  // Limit to 11 digits
  if (cleaned.length > 11) {
    cleaned = cleaned.slice(0, 11);
  }
  
  // Format for display: add spaces every 3-4 digits for readability
  if (cleaned.length >= 4) {
    if (cleaned.length <= 4) {
      return cleaned;
    } else if (cleaned.length <= 7) {
      return `${cleaned.slice(0, 4)} ${cleaned.slice(4)}`;
    } else if (cleaned.length <= 11) {
      return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7, 11)}`.trim();
    }
  }
  
  return cleaned;
};

// Validate phone number - only check length and that it contains digits
const validatePhilippineNumber = (phoneNumber) => {
  // Remove all non-digit characters
  let cleaned = phoneNumber.replace(/\D/g, '');
  
  // Check if empty
  if (!cleaned) {
    return { isValid: false, normalizedNumber: '', error: 'Phone number is required' };
  }
  
  // Check length (must be between 7 and 11 digits for Philippine numbers)
  if (cleaned.length < 7) {
    return { isValid: false, normalizedNumber: cleaned, error: 'Phone number must have at least 7 digits' };
  }
  
  if (cleaned.length > 11) {
    return { isValid: false, normalizedNumber: cleaned.slice(0, 11), error: 'Phone number cannot exceed 11 digits' };
  }
  
  // Valid phone number
  return { isValid: true, normalizedNumber: cleaned, error: '' };
};

// Format date range for display
const formatDateRange = (startDate, endDate) => {
  if (!startDate) return '';
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

function Register() {
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    full_name: "",
    company_name: "",
    position: "",
    phone: "",
    city: "",
    region: "",
    email: "",
    inquiry: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registeredUser, setRegisteredUser] = useState(null);
  const [error, setError] = useState("");
  const [validationError, setValidationError] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [tvPower, setTvPower] = useState(true);
  const [staticNoise, setStaticNoise] = useState(false);
  const [availableCities, setAvailableCities] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [touchedFields, setTouchedFields] = useState({});
  const [activeEvent, setActiveEvent] = useState(null);
  const [showInquiryField, setShowInquiryField] = useState(false);

  const slides = [
    { image: "/delta1.png" },
    { image: "/delta2.png" },
    { image: "/delta3.jpg" }
  ];

  // Fetch active event on component mount
  useEffect(() => {
    fetchActiveEvent();
  }, []);

  const fetchActiveEvent = async () => {
    try {
      const res = await axios.get("https://deltaplus-visitors-login-backend-ydkm.onrender.com/events/active");
      setActiveEvent(res.data);
    } catch (err) {
      console.error("Error fetching active event:", err);
    }
  };

  // Handle resize events
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update available cities when region changes
  useEffect(() => {
    if (form.region) {
      const cities = getCitiesForRegion(form.region);
      setAvailableCities(cities);
      if (form.city && !cities.some(city => city.value === form.city)) {
        setForm(prev => ({ ...prev, city: "" }));
      }
    } else {
      setAvailableCities([]);
      setForm(prev => ({ ...prev, city: "" }));
    }
  }, [form.region]);

  // Preload images
  useEffect(() => {
    slides.forEach(slide => {
      const img = new Image();
      img.src = slide.image;
    });
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showSuccessModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showSuccessModal]);

  // Validate all form fields
  const validateForm = () => {
    if (!form.full_name.trim()) {
      setValidationError("Full name is required");
      return false;
    }
    if (!form.company_name.trim()) {
      setValidationError("Company name is required");
      return false;
    }
    if (!form.position.trim()) {
      setValidationError("Position is required");
      return false;
    }
    if (!form.phone.trim()) {
      setValidationError("Phone number is required");
      return false;
    }
    if (!form.email.trim()) {
      setValidationError("Email address is required");
      return false;
    }
    if (!form.region) {
      setValidationError("Please select a region");
      return false;
    }
    if (!form.city) {
      setValidationError("Please select a city/municipality");
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setValidationError("Please enter a valid email address");
      return false;
    }
    
    const { isValid, error: phoneError, normalizedNumber } = validatePhilippineNumber(form.phone);
    if (!isValid) {
      setValidationError(phoneError);
      return false;
    }
    
    // Update form with normalized phone number (only digits)
    if (normalizedNumber !== form.phone.replace(/\D/g, '')) {
      setForm(prev => ({ ...prev, phone: normalizedNumber }));
    }
    
    setValidationError("");
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      const formatted = formatPhilippineNumber(value);
      setForm({ ...form, phone: formatted });
    } else {
      setForm({ ...form, [name]: value });
    }
    
    setTouchedFields({ ...touchedFields, [name]: true });
    setValidationError("");
    if (error) setError("");
  };

  const handleCityChange = (value) => {
    setForm({ ...form, city: value });
    setTouchedFields({ ...touchedFields, city: true });
    setValidationError("");
    if (error) setError("");
  };

  const handleRegionChange = (value) => {
    setForm({ ...form, region: value, city: "" });
    setTouchedFields({ ...touchedFields, region: true, city: true });
    setValidationError("");
    if (error) setError("");
  };

  const handleBlur = (fieldName) => {
    setTouchedFields({ ...touchedFields, [fieldName]: true });
    
    if (fieldName === 'phone' && form.phone) {
      const { isValid, error: phoneError, normalizedNumber } = validatePhilippineNumber(form.phone);
      if (isValid && normalizedNumber !== form.phone.replace(/\D/g, '')) {
        setForm(prev => ({ ...prev, phone: normalizedNumber }));
      } else if (!isValid && form.phone) {
        setValidationError(phoneError);
      }
    }
  };

  const createRipple = (event) => {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    
    ripple.style.width = ripple.style.height = `${diameter}px`;
    ripple.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
    ripple.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
    ripple.classList.add('ripple');
    
    const existingRipple = button.querySelector('.ripple');
    if (existingRipple) {
      existingRipple.remove();
    }
    
    button.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 400);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      const allTouched = {};
      Object.keys(form).forEach(key => {
        allTouched[key] = true;
      });
      setTouchedFields(allTouched);
      return;
    }
    
    setLoading(true);
    setError("");
    
    const selectedRegion = PHILIPPINE_REGIONS.find(r => r.value === form.region);
    
    // Get only digits for phone number
    const phoneDigits = form.phone.replace(/\D/g, '');
    
    const formData = {
      full_name: form.full_name,
      company_name: form.company_name,
      position: form.position,
      phone: phoneDigits,
      city: form.city,
      region: selectedRegion ? selectedRegion.fullName : form.region,
      email: form.email,
      inquiry: form.inquiry.trim() || null
    };
    
    try {
      await axios.post("https://deltaplus-visitors-login-backend-ydkm.onrender.com/register", formData);
      
      setRegisteredUser({
        full_name: form.full_name,
        company_name: form.company_name,
        position: form.position,
        email: form.email,
        phone: phoneDigits,
        event_name: activeEvent?.event_name || 'the event',
        inquiry: form.inquiry.trim() || null
      });
      
      setShowSuccessModal(true);
      
      setForm({ 
        full_name: "", 
        company_name: "",
        position: "",
        phone: "", 
        city: "", 
        region: "", 
        email: "",
        inquiry: "" 
      });
      setTouchedFields({});
      setShowInquiryField(false);
      
    } catch (err) {
      console.error("Registration error:", err);
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    setRegisteredUser(null);
  };

  // Auto-advance slides every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setStaticNoise(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setStaticNoise(false);
      }, 150);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleAdminLogin = () => {
    navigate("/login");
  };

  const toggleTV = () => {
    setTvPower(!tvPower);
  };

  const isFieldInvalid = (fieldName) => {
    if (fieldName === 'region' || fieldName === 'city') {
      return touchedFields[fieldName] && !form[fieldName];
    }
    if (fieldName === 'phone') {
      if (touchedFields[fieldName] && !form[fieldName]) return true;
      if (touchedFields[fieldName] && form[fieldName]) {
        const { isValid } = validatePhilippineNumber(form[fieldName]);
        return !isValid;
      }
      return false;
    }
    if (fieldName === 'email') {
      if (touchedFields[fieldName] && !form[fieldName]) return true;
      if (touchedFields[fieldName] && form[fieldName]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(form[fieldName]);
      }
      return false;
    }
    return touchedFields[fieldName] && !form[fieldName]?.trim();
  };

  const getPhoneValidationMessage = () => {
    if (!touchedFields.phone) return null;
    if (!form.phone) return "Phone number is required";
    
    const digits = form.phone.replace(/\D/g, '');
    if (digits.length < 7) return "Phone number must have at least 7 digits";
    if (digits.length > 11) return "Phone number cannot exceed 11 digits";
    return null;
  };

  return (
    <div className="register-page">
      <div className="register-container">
        {!isMobile && (
          <div className="tv-side">
            <div className="tv-set">
              <div className="tv-antenna">
                <div className="antenna-left"></div>
                <div className="antenna-right"></div>
                <div className="antenna-base"></div>
              </div>
              
              <div className="tv-body">
                <div className="tv-screen-container">
                  <div className="tv-screen">
                    {tvPower ? (
                      <>
                        <div className={`tv-static ${staticNoise ? 'active' : ''}`}></div>
                        <div className="tv-scanlines"></div>
                        <div className="tv-content">
                          {slides.map((slide, index) => (
                            <div
                              key={index}
                              className={`tv-slide ${index === currentSlide ? 'active' : ''}`}
                            >
                              <img 
                                src={slide.image} 
                                alt={`Slide ${index + 1}`}
                                className="tv-image"
                              />
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="tv-off">
                        <span className="tv-off-text">NO SIGNAL</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="tv-controls">
                  <div className="tv-power-button" onClick={toggleTV}>
                    <span className={`power-led ${tvPower ? 'on' : 'off'}`}></span>
                    <span className="power-text">POWER</span>
                  </div>
                  <div className="tv-channel-indicator">
                    <span className="channel-label">CH</span>
                    <span className="channel-number">{currentSlide + 1}</span>
                  </div>
                  <div className="tv-knobs">
                    <div className="tv-knob volume-knob">
                      <div className="knob-indicator"></div>
                    </div>
                    <div className="tv-knob channel-knob">
                      <div className="knob-indicator"></div>
                    </div>
                  </div>
                </div>
                
                <div className="tv-speaker">
                  <div className="speaker-grill"></div>
                  <div className="speaker-grill"></div>
                  <div className="speaker-grill"></div>
                </div>
                
                <div className="tv-brand">RETROVISION</div>
              </div>
            </div>
          </div>
        )}

        <div className={`form-side ${isMobile ? 'mobile-full' : ''}`}>
          <div className="logo-section">
            <img 
              src="/deltaplus.png" 
              alt="Deltaplus" 
              className="register-logo"
            />
          </div>

          <div className="form-section">
            <div className="form-header">
              <h2 className="form-title">Visitor's Registration</h2>
              <p className="form-subtitle">Please fill in your details below</p>
            </div>

            {activeEvent && activeEvent.event_name && (
              <div className="active-event-banner">
                <div className="active-event-icon">📢</div>
                <div className="active-event-content">
                  <div className="active-event-name">{activeEvent.event_name}</div>
                  {activeEvent.event_location && (
                    <div className="active-event-location">
                      <span className="location-icon">📍</span> {activeEvent.event_location}
                    </div>
                  )}
                  {activeEvent.event_start_date && activeEvent.event_end_date && (
                    <div className="active-event-date">
                      <span className="date-icon">📅</span> {formatDateRange(activeEvent.event_start_date, activeEvent.event_end_date)}
                    </div>
                  )}
                </div>
              </div>
            )}

            {validationError && (
              <div className="error-message">
                <span className="error-icon">!</span>
                <div className="error-content">
                  <strong>Validation Error</strong>
                  <p>{validationError}</p>
                </div>
              </div>
            )}

            {error && !validationError && (
              <div className="error-message">
                <span className="error-icon">!</span>
                <div className="error-content">
                  <strong>Registration Failed</strong>
                  <p>{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="registration-form" noValidate>
              <div className="form-group">
                <label htmlFor="full_name">Full Name *</label>
                <input
                  id="full_name"
                  type="text"
                  name="full_name"
                  placeholder="Enter your full name"
                  value={form.full_name}
                  onChange={handleChange}
                  onBlur={() => handleBlur('full_name')}
                  required
                  className={`form-input ${isFieldInvalid('full_name') ? 'error' : ''}`}
                />
                {isFieldInvalid('full_name') && (
                  <small className="error-text">Full name is required</small>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="company_name">Company Name *</label>
                <input
                  id="company_name"
                  type="text"
                  name="company_name"
                  placeholder="Enter your company name"
                  value={form.company_name}
                  onChange={handleChange}
                  onBlur={() => handleBlur('company_name')}
                  required
                  className={`form-input ${isFieldInvalid('company_name') ? 'error' : ''}`}
                />
                {isFieldInvalid('company_name') && (
                  <small className="error-text">Company name is required</small>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="position">Position *</label>
                <input
                  id="position"
                  type="text"
                  name="position"
                  placeholder="e.g., Manager, Director, Sales Representative"
                  value={form.position}
                  onChange={handleChange}
                  onBlur={() => handleBlur('position')}
                  required
                  className={`form-input ${isFieldInvalid('position') ? 'error' : ''}`}
                />
                {isFieldInvalid('position') && (
                  <small className="error-text">Position is required</small>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Mobile Number *</label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    placeholder="09123456789"
                    value={form.phone}
                    onChange={handleChange}
                    onBlur={() => handleBlur('phone')}
                    required
                    className={`form-input ${isFieldInvalid('phone') ? 'error' : ''}`}
                  />
                  {getPhoneValidationMessage() && (
                    <small className="error-text">{getPhoneValidationMessage()}</small>
                  )}
                  {!isFieldInvalid('phone') && form.phone && getPhoneValidationMessage() === null && (
                    <small className="field-note">✓ Valid phone number format</small>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    onBlur={() => handleBlur('email')}
                    required
                    className={`form-input ${isFieldInvalid('email') ? 'error' : ''}`}
                  />
                  {isFieldInvalid('email') && !form.email && (
                    <small className="error-text">Email address is required</small>
                  )}
                  {isFieldInvalid('email') && form.email && (
                    <small className="error-text">Please enter a valid email address</small>
                  )}
                </div>
              </div>

              <div className="address-section">
                <h3 className="address-title">Location Details</h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="region">Region *</label>
                    <SearchableSelect
                      value={form.region}
                      onChange={handleRegionChange}
                      options={PHILIPPINE_REGIONS}
                      placeholder="Select Region"
                    />
                    {touchedFields.region && !form.region && (
                      <small className="error-text">Please select a region</small>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="city">City / Municipality *</label>
                    <SearchableSelect
                      value={form.city}
                      onChange={handleCityChange}
                      options={availableCities}
                      placeholder={form.region ? "Select City/Municipality" : "Select Region First"}
                    />
                    {!form.region && (
                      <small className="field-note">Please select a region first</small>
                    )}
                    {touchedFields.city && form.region && !form.city && (
                      <small className="error-text">Please select a city/municipality</small>
                    )}
                  </div>
                </div>
              </div>

              {/* Optional Inquiries Section */}
              <div className="inquiry-section">
                <div className="inquiry-header">
                  <button
                    type="button"
                    className={`inquiry-toggle-btn ${showInquiryField ? 'active' : ''}`}
                    onClick={() => setShowInquiryField(!showInquiryField)}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <span>Have a question or inquiry? <span className="optional-tag">Optional</span></span>
                    <span className={`toggle-icon ${showInquiryField ? 'open' : ''}`}>▼</span>
                  </button>
                </div>
                
                {showInquiryField && (
                  <div className="inquiry-content">
                    <div className="form-group">
                      <label htmlFor="inquiry">Your Inquiry / Question</label>
                      <textarea
                        id="inquiry"
                        name="inquiry"
                        rows="4"
                        placeholder="Please type your questions or inquiries here... (e.g., event details, registration concerns, special requests, etc.)"
                        value={form.inquiry}
                        onChange={handleChange}
                        className="form-textarea"
                      ></textarea>
                      <small className="field-note">This field is optional. Your inquiry will be sent to our team for assistance.</small>
                    </div>
                  </div>
                )}
              </div>

              <div className="form-footer">
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={loading}
                  onMouseDown={createRipple}
                >
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      Registering...
                    </>
                  ) : (
                    'Register Now'
                  )}
                </button>
                
                <div className="admin-login-container">
                  <button 
                    type="button"
                    onClick={handleAdminLogin}
                    className="admin-login-link"
                  >
                    Login as Administrator
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {showSuccessModal && registeredUser && (
        <div className="success-modal-overlay" onClick={closeSuccessModal}>
          <div className="success-modal" onClick={(e) => e.stopPropagation()}>
            <div className="success-modal-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="success-modal-title">Registration Successful!</h3>
            <p className="success-modal-message">
              Thank you for registering for <strong>{registeredUser.event_name}</strong>.
            </p>
            <div className="success-modal-details">
              <div className="success-modal-detail-item">
                <span className="detail-label">Name:</span>
                <span className="detail-value">{registeredUser.full_name}</span>
              </div>
              <div className="success-modal-detail-item">
                <span className="detail-label">Company:</span>
                <span className="detail-value">{registeredUser.company_name}</span>
              </div>
              <div className="success-modal-detail-item">
                <span className="detail-label">Position:</span>
                <span className="detail-value">{registeredUser.position}</span>
              </div>
              <div className="success-modal-detail-item">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{registeredUser.email}</span>
              </div>
              <div className="success-modal-detail-item">
                <span className="detail-label">Phone:</span>
                <span className="detail-value">{registeredUser.phone}</span>
              </div>
              {registeredUser.inquiry && (
                <div className="success-modal-detail-item inquiry-item">
                  <span className="detail-label">Inquiry Sent:</span>
                  <span className="detail-value inquiry-value">✓ Your question has been submitted</span>
                </div>
              )}
            </div>
            {registeredUser.inquiry && (
              <div className="inquiry-confirmation">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <span>Our team will contact you regarding your inquiry within 24-48 hours.</span>
              </div>
            )}
            <button className="success-modal-button" onClick={closeSuccessModal}>
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Register;
