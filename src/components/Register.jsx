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

// Philippine Regions data
const PHILIPPINE_REGIONS = [
  { value: "NCR", label: "National Capital Region (NCR)" },
  { value: "CAR", label: "Cordillera Administrative Region (CAR)" },
  { value: "I", label: "Region I (Ilocos Region)" },
  { value: "II", label: "Region II (Cagayan Valley)" },
  { value: "III", label: "Region III (Central Luzon)" },
  { value: "IV-A", label: "Region IV-A (CALABARZON)" },
  { value: "MIMAROPA", label: "MIMAROPA Region" },
  { value: "V", label: "Region V (Bicol Region)" },
  { value: "VI", label: "Region VI (Western Visayas)" },
  { value: "VII", label: "Region VII (Central Visayas)" },
  { value: "VIII", label: "Region VIII (Eastern Visayas)" },
  { value: "IX", label: "Region IX (Zamboanga Peninsula)" },
  { value: "X", label: "Region X (Northern Mindanao)" },
  { value: "XI", label: "Region XI (Davao Region)" },
  { value: "XII", label: "Region XII (SOCCSKSARGEN)" },
  { value: "XIII", label: "Region XIII (Caraga)" },
  { value: "BARMM", label: "Bangsamoro Autonomous Region in Muslim Mindanao (BARMM)" }
];

// Cities organized by region
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
    { value: "Tabuk", label: "Tabuk" }
  ],

  // Region I - Ilocos Region
  I: [
    { value: "Alaminos", label: "Alaminos" },
    { value: "Dagupan", label: "Dagupan" },
    { value: "Laoag", label: "Laoag" },
    { value: "San Carlos", label: "San Carlos" },
    { value: "Urdaneta", label: "Urdaneta" },
    { value: "Vigan", label: "Vigan" }
  ],

  // Region II - Cagayan Valley
  II: [
    { value: "Cauayan", label: "Cauayan" },
    { value: "Santiago", label: "Santiago" },
    { value: "Tuguegarao", label: "Tuguegarao" }
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
    { value: "San Fernando", label: "San Fernando" },
    { value: "San Jose", label: "San Jose" },
    { value: "San Jose Del Monte", label: "San Jose Del Monte" },
    { value: "Tarlac", label: "Tarlac" }
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
    { value: "Trece Martires", label: "Trece Martires" }
  ],

  // MIMAROPA
  MIMAROPA: [
    { value: "Calapan", label: "Calapan" },
    { value: "Puerto Princesa", label: "Puerto Princesa" }
  ],

  // Region V - Bicol Region
  V: [
    { value: "Iriga", label: "Iriga" },
    { value: "Legazpi", label: "Legazpi" },
    { value: "Ligao", label: "Ligao" },
    { value: "Masbate", label: "Masbate" },
    { value: "Naga", label: "Naga" },
    { value: "Sorsogon", label: "Sorsogon" },
    { value: "Tabaco", label: "Tabaco" }
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
    { value: "Roxas", label: "Roxas" },
    { value: "Sagay", label: "Sagay" },
    { value: "San Carlos", label: "San Carlos" },
    { value: "Silay", label: "Silay" },
    { value: "Sipalay", label: "Sipalay" },
    { value: "Talisay", label: "Talisay" },
    { value: "Victorias", label: "Victorias" }
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
    { value: "Naga", label: "Naga (Cebu)" },
    { value: "San Carlos", label: "San Carlos" },
    { value: "Talisay", label: "Talisay" },
    { value: "Tanjay", label: "Tanjay" },
    { value: "Toledo", label: "Toledo" }
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
    { value: "Isabela", label: "Isabela (Basilan)" },
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
    { value: "Valencia", label: "Valencia (Bukidnon)" }
  ],

  // Region XI - Davao Region
  XI: [
    { value: "Davao", label: "Davao" },
    { value: "Digos", label: "Digos" },
    { value: "Mati", label: "Mati" },
    { value: "Panabo", label: "Panabo" },
    { value: "Samal", label: "Island Garden City of Samal" },
    { value: "Tagum", label: "Tagum" }
  ],

  // Region XII - SOCCSKSARGEN
  XII: [
    { value: "Cotabato", label: "Cotabato" },
    { value: "General Santos", label: "General Santos" },
    { value: "Kidapawan", label: "Kidapawan" },
    { value: "Koronadal", label: "Koronadal" },
    { value: "Tacurong", label: "Tacurong" }
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
    { value: "Marawi", label: "Marawi" }
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
    house_number: "",
    street_name: "",
    barangay: "",
    city: "",
    region: "",
    email: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [tvPower, setTvPower] = useState(true);
  const [staticNoise, setStaticNoise] = useState(false);
  const [availableCities, setAvailableCities] = useState([]);

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleCityChange = (value) => {
    setForm({ ...form, city: value });
    if (error) setError("");
  };

  const handleRegionChange = (value) => {
    setForm({ ...form, region: value, city: "" });
    if (error) setError("");
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
    setLoading(true);
    setError("");
    
    try {
      await axios.post("http://localhost:8000/register", form);
      setSuccess(true);
      setForm({ 
        full_name: "", 
        company_name: "", 
        phone: "", 
        house_number: "", 
        street_name: "", 
        barangay: "", 
        city: "", 
        region: "", 
        email: "" 
      });
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

  return (
    <div className="register-page">
      <div className="register-container">
        {/* Left Side - Mini TV Carousel */}
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

        {/* Right Side - Registration Form */}
        <div className="form-side">
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

            {/* Error Message */}
            {error && (
              <div className="error-message">
                <span className="error-icon">!</span>
                <div className="error-content">
                  <strong>Registration Failed</strong>
                  <p>{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="registration-form">
              <div className="form-group">
                <label htmlFor="full_name">Full Name *</label>
                <input
                  id="full_name"
                  type="text"
                  name="full_name"
                  placeholder="Enter your full name"
                  value={form.full_name}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
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
                  required
                  className="form-input"
                />
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
                    required
                    className="form-input"
                  />
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
                    required
                    className="form-input"
                  />
                </div>
              </div>

              {/* Address Fields */}
              <div className="address-section">
                <h3 className="address-title">Address Details</h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="house_number">House/Building Number *</label>
                    <input
                      id="house_number"
                      type="text"
                      name="house_number"
                      placeholder="e.g., 123, Unit 4B"
                      value={form.house_number}
                      onChange={handleChange}
                      required
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="street_name">Street Name *</label>
                    <input
                      id="street_name"
                      type="text"
                      name="street_name"
                      placeholder="e.g., Rizal Avenue"
                      value={form.street_name}
                      onChange={handleChange}
                      required
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="barangay">Barangay *</label>
                    <input
                      id="barangay"
                      type="text"
                      name="barangay"
                      placeholder="Enter barangay"
                      value={form.barangay}
                      onChange={handleChange}
                      required
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="region">Region *</label>
                    <CustomSelect
                      value={form.region}
                      onChange={handleRegionChange}
                      options={PHILIPPINE_REGIONS}
                      placeholder="Select Region First"
                    />
                  </div>
                </div>

                <div className="form-row">
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