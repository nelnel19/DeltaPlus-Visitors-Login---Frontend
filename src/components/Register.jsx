// Register.jsx
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/register.css";

// Custom Select Component for dropdowns
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
        className={`custom-select-trigger ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={!selectedOption ? 'placeholder' : ''}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className={`custom-select-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </div>
      {isOpen && (
        <div className="custom-select-dropdown">
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
  // NCR - National Capital Region
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

  // CAR - Cordillera Administrative Region
  CAR: [
    { value: "Baguio", label: "Baguio" },
    { value: "Tabuk", label: "Tabuk" },
    { value: "Lamut", label: "Lamut" },
    { value: "Lagawe", label: "Lagawe" },
    { value: "Bontoc", label: "Bontoc" },
    { value: "La Trinidad", label: "La Trinidad" },
    { value: "Bauko", label: "Bauko" }
  ],

  // Region I - Ilocos Region
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

  // Region II - Cagayan Valley
  II: [
    { value: "Cauayan", label: "Cauayan" },
    { value: "Santiago", label: "Santiago" },
    { value: "Tuguegarao", label: "Tuguegarao" },
    { value: "Ilagan", label: "Ilagan" }
  ],

  // Region III - Central Luzon
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

  // Region IV-A - CALABARZON
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

  // MIMAROPA
  MIMAROPA: [
    { value: "Calapan", label: "Calapan" },
    { value: "Puerto Princesa", label: "Puerto Princesa" },
    { value: "Odiongan", label: "Odiongan" },
    { value: "Roxas (Mindoro)", label: "Roxas" }
  ],

  // Region V - Bicol Region
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

  // Region VI - Western Visayas
  VI: [
    { value: "Bacolod", label: "Bacolod" },
    { value: "Bago", label: "Bago" },
    { value: "Cadiz", label: "Cadiz" },
    { value: "Escalante", label: "Escalante" },
    { value: "Himamaylan", label: "Himamaylan" },
    { value: "Iloilo", label: "Iloilo" },
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

  // Region VII - Central Visayas
  VII: [
    { value: "Bais", label: "Bais" },
    { value: "Bayawan", label: "Bayawan" },
    { value: "Bogo", label: "Bogo" },
    { value: "Canlaon", label: "Canlaon" },
    { value: "Carcar", label: "Carcar" },
    { value: "Cebu", label: "Cebu" },
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

  // Region VIII - Eastern Visayas
  VIII: [
    { value: "Baybay", label: "Baybay" },
    { value: "Borongan", label: "Borongan" },
    { value: "Calbayog", label: "Calbayog" },
    { value: "Catbalogan", label: "Catbalogan" },
    { value: "Maasin", label: "Maasin" },
    { value: "Ormoc", label: "Ormoc" },
    { value: "Tacloban", label: "Tacloban" }
  ],

  // Region IX - Zamboanga Peninsula
  IX: [
    { value: "Dapitan", label: "Dapitan" },
    { value: "Dipolog", label: "Dipolog" },
    { value: "Isabela (Basilan)", label: "Isabela (Basilan)" },
    { value: "Pagadian", label: "Pagadian" },
    { value: "Zamboanga", label: "Zamboanga" }
  ],

  // Region X - Northern Mindanao
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

  // Region XI - Davao Region
  XI: [
    { value: "Davao", label: "Davao" },
    { value: "Digos", label: "Digos" },
    { value: "Mati", label: "Mati" },
    { value: "Panabo", label: "Panabo" },
    { value: "Samal", label: "Island Garden City of Samal" },
    { value: "Tagum", label: "Tagum" },
    { value: "Malita", label: "Malita" }
  ],

  // Region XII - SOCCSKSARGEN
  XII: [
    { value: "Cotabato", label: "Cotabato" },
    { value: "General Santos", label: "General Santos" },
    { value: "Kidapawan", label: "Kidapawan" },
    { value: "Koronadal", label: "Koronadal" },
    { value: "Tacurong", label: "Tacurong" },
    { value: "Polomolok", label: "Polomolok" }
  ],

  // Region XIII - Caraga
  XIII: [
    { value: "Bayugan", label: "Bayugan" },
    { value: "Bislig", label: "Bislig" },
    { value: "Butuan", label: "Butuan" },
    { value: "Cabadbaran", label: "Cabadbaran" },
    { value: "Surigao", label: "Surigao" },
    { value: "Tandag", label: "Tandag" }
  ],

  // BARMM
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

function Register() {
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    full_name: "",
    company_name: "",
    phone: "",
    city: "",
    region: "",
    email: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [validationError, setValidationError] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [tvPower, setTvPower] = useState(true);
  const [staticNoise, setStaticNoise] = useState(false);
  const [availableCities, setAvailableCities] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [touchedFields, setTouchedFields] = useState({});

  const slides = [
    {
      image: "/delta1.png",
    },
    {
      image: "/delta2.png",
    },
    {
      image: "/delta3.jpg",
    }
  ];

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
      // Clear city if current city is not in the new region
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
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setValidationError("Please enter a valid email address");
      return false;
    }
    
    // Phone validation (basic - at least 10 digits)
    const phoneDigits = form.phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      setValidationError("Please enter a valid phone number with at least 10 digits");
      return false;
    }
    
    setValidationError("");
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
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
    
    // Validate all fields before submission
    if (!validateForm()) {
      // Mark all fields as touched to show validation errors
      const allTouched = {};
      Object.keys(form).forEach(key => {
        allTouched[key] = true;
      });
      setTouchedFields(allTouched);
      return;
    }
    
    setLoading(true);
    setError("");
    
    // Find the full region name from the selected code
    const selectedRegion = PHILIPPINE_REGIONS.find(r => r.value === form.region);
    
    // Prepare form data with full region name for database compatibility
    const formData = {
      ...form,
      region: selectedRegion ? selectedRegion.fullName : form.region // Send full name to database
    };
    
    try {
      await axios.post("https://deltaplus-visitors-login-backend-ydkm.onrender.com/register", formData);
      setSuccess(true);
      setForm({ 
        full_name: "", 
        company_name: "", 
        phone: "", 
        city: "", 
        region: "", 
        email: "" 
      });
      setTouchedFields({});
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError("Registration failed: Email already registered.");
    } finally {
      setLoading(false);
    }
  };

  const goToSlide = (index) => {
    setStaticNoise(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setStaticNoise(false);
    }, 150);
  };

  // Auto-advance slides every 4 seconds with TV channel change effect
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

  // Check if a field is invalid (touched and empty)
  const isFieldInvalid = (fieldName) => {
    if (fieldName === 'region' || fieldName === 'city') {
      return touchedFields[fieldName] && !form[fieldName];
    }
    return touchedFields[fieldName] && !form[fieldName]?.trim();
  };

  return (
    <div className="register-page">
      <div className="register-container">
        {/* Left Side - Mini TV Carousel - Hidden on mobile */}
        {!isMobile && (
          <div className="tv-side">
            <div className="tv-set">
              {/* TV Antenna */}
              <div className="tv-antenna">
                <div className="antenna-left"></div>
                <div className="antenna-right"></div>
                <div className="antenna-base"></div>
              </div>
              
              {/* TV Body */}
              <div className="tv-body">
                {/* TV Screen */}
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
                
                {/* TV Controls */}
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
                
                {/* TV Speaker */}
                <div className="tv-speaker">
                  <div className="speaker-grill"></div>
                  <div className="speaker-grill"></div>
                  <div className="speaker-grill"></div>
                </div>
                
                {/* TV Brand */}
                <div className="tv-brand">RETROVISION</div>
              </div>
            </div>
          </div>
        )}

        {/* Right Side - Registration Form */}
        <div className={`form-side ${isMobile ? 'mobile-full' : ''}`}>
          {/* Logo at top */}
          <div className="logo-section">
            <img 
              src="/deltaplus.png" 
              alt="Deltaplus" 
              className="register-logo"
            />
          </div>

          <div className="form-section">
            <div className="form-header">
              <h2 className="form-title">Visitor's Login</h2>
              <p className="form-subtitle">Please fill in your details below</p>
            </div>

            {/* Success Message */}
            {success && (
              <div className="success-message">
                <span className="success-icon">✓</span>
                <div className="success-content">
                  <strong>Registration Successful!</strong>
                  <p>You have been registered for the event.</p>
                </div>
              </div>
            )}

            {/* Validation Error Message */}
            {validationError && (
              <div className="error-message">
                <span className="error-icon">!</span>
                <div className="error-content">
                  <strong>Validation Error</strong>
                  <p>{validationError}</p>
                </div>
              </div>
            )}

            {/* API Error Message */}
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

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    placeholder="Enter phone number"
                    value={form.phone}
                    onChange={handleChange}
                    onBlur={() => handleBlur('phone')}
                    required
                    className={`form-input ${isFieldInvalid('phone') ? 'error' : ''}`}
                  />
                  {isFieldInvalid('phone') && (
                    <small className="error-text">Phone number is required</small>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Enter email address"
                    value={form.email}
                    onChange={handleChange}
                    onBlur={() => handleBlur('email')}
                    required
                    className={`form-input ${isFieldInvalid('email') ? 'error' : ''}`}
                  />
                  {isFieldInvalid('email') && (
                    <small className="error-text">Email address is required</small>
                  )}
                </div>
              </div>

              {/* Address Fields - Simplified to only Region and City */}
              <div className="address-section">
                <h3 className="address-title">Location Details</h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="region">Region *</label>
                    <CustomSelect
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
                    <CustomSelect
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
                    'Sign In'
                  )}
                </button>
                
                {/* Admin Login Link */}
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
    </div>
  );
}

export default Register;