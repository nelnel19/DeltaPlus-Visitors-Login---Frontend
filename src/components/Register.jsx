// Register.jsx
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Add this import
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

// Philippine Cities data (Major cities and municipalities) - Sorted Alphabetically
const PHILIPPINE_CITIES = [
  // A
  { value: "Alaminos", label: "Alaminos" },
  { value: "Angeles", label: "Angeles" },
  { value: "Antipolo", label: "Antipolo" },

  // B
  { value: "Bacolod", label: "Bacolod" },
  { value: "Bacoor", label: "Bacoor" },
  { value: "Bago", label: "Bago" },
  { value: "Baguio", label: "Baguio" },
  { value: "Bais", label: "Bais" },
  { value: "Balanga", label: "Balanga" },
  { value: "Batangas", label: "Batangas" },
  { value: "Bayawan", label: "Bayawan" },
  { value: "Baybay", label: "Baybay" },
  { value: "Bayugan", label: "Bayugan" },
  { value: "Biñan", label: "Biñan" },
  { value: "Bislig", label: "Bislig" },
  { value: "Bogo", label: "Bogo" },
  { value: "Borongan", label: "Borongan" },
  { value: "Butuan", label: "Butuan" },

  // C
  { value: "Cabadbaran", label: "Cabadbaran" },
  { value: "Cabanatuan", label: "Cabanatuan" },
  { value: "Cabuyao", label: "Cabuyao" },
  { value: "Cadiz", label: "Cadiz" },
  { value: "Cagayan de Oro", label: "Cagayan de Oro" },
  { value: "Calamba", label: "Calamba" },
  { value: "Calapan", label: "Calapan" },
  { value: "Calbayog", label: "Calbayog" },
  { value: "Caloocan", label: "Caloocan" },
  { value: "Candon", label: "Candon" },
  { value: "Canlaon", label: "Canlaon" },
  { value: "Carcar", label: "Carcar" },
  { value: "Catbalogan", label: "Catbalogan" },
  { value: "Cauayan", label: "Cauayan" },
  { value: "Cavite", label: "Cavite" },
  { value: "Cebu", label: "Cebu" },
  { value: "Cotabato", label: "Cotabato" },

  // D
  { value: "Dagupan", label: "Dagupan" },
  { value: "Danao", label: "Danao" },
  { value: "Dapitan", label: "Dapitan" },
  { value: "Dasmariñas", label: "Dasmariñas" },
  { value: "Davao", label: "Davao" },
  { value: "Digos", label: "Digos" },
  { value: "Dipolog", label: "Dipolog" },
  { value: "Dumaguete", label: "Dumaguete" },

  // E
  { value: "El Salvador", label: "El Salvador" },
  { value: "Escalante", label: "Escalante" },

  // G
  { value: "Gapan", label: "Gapan" },
  { value: "General Santos", label: "General Santos" },
  { value: "General Trias", label: "General Trias" },
  { value: "Gingoog", label: "Gingoog" },
  { value: "Guihulngan", label: "Guihulngan" },

  // H
  { value: "Himamaylan", label: "Himamaylan" },
  { value: "Iligan", label: "Iligan" },
  { value: "Iloilo", label: "Iloilo" },
  { value: "Imus", label: "Imus" },
  { value: "Iriga", label: "Iriga" },
  { value: "Isabela", label: "Isabela (Basilan)" },
  { value: "Island Garden City of Samal", label: "Island Garden City of Samal" },

  // K
  { value: "Kabankalan", label: "Kabankalan" },
  { value: "Kidapawan", label: "Kidapawan" },
  { value: "Koronadal", label: "Koronadal" },

  // L
  { value: "La Carlota", label: "La Carlota" },
  { value: "Lamitan", label: "Lamitan" },
  { value: "Laoag", label: "Laoag" },
  { value: "Lapu-Lapu", label: "Lapu-Lapu" },
  { value: "Las Piñas", label: "Las Piñas" },
  { value: "Legazpi", label: "Legazpi" },
  { value: "Ligao", label: "Ligao" },
  { value: "Lipa", label: "Lipa" },
  { value: "Lucena", label: "Lucena" },

  // M
  { value: "Maasin", label: "Maasin" },
  { value: "Mabalacat", label: "Mabalacat" },
  { value: "Makati", label: "Makati" },
  { value: "Malabon", label: "Malabon" },
  { value: "Malaybalay", label: "Malaybalay" },
  { value: "Malolos", label: "Malolos" },
  { value: "Mandaluyong", label: "Mandaluyong" },
  { value: "Mandaue", label: "Mandaue" },
  { value: "Manila", label: "Manila" },
  { value: "Marawi", label: "Marawi" },
  { value: "Marikina", label: "Marikina" },
  { value: "Masbate", label: "Masbate" },
  { value: "Mati", label: "Mati" },
  { value: "Meycauayan", label: "Meycauayan" },
  { value: "Muntinlupa", label: "Muntinlupa" },

  // N
  { value: "Naga", label: "Naga" },
  { value: "Naga (Cebu)", label: "Naga (Cebu)" },
  { value: "Navotas", label: "Navotas" },

  // O
  { value: "Olongapo", label: "Olongapo" },
  { value: "Ormoc", label: "Ormoc" },
  { value: "Oroquieta", label: "Oroquieta" },
  { value: "Ozamiz", label: "Ozamiz" },

  // P
  { value: "Pagadian", label: "Pagadian" },
  { value: "Palayan", label: "Palayan" },
  { value: "Panabo", label: "Panabo" },
  { value: "Parañaque", label: "Parañaque" },
  { value: "Pasay", label: "Pasay" },
  { value: "Pasig", label: "Pasig" },
  { value: "Passi", label: "Passi" },
  { value: "Pateros", label: "Pateros" },
  { value: "Puerto Princesa", label: "Puerto Princesa" },

  // Q
  { value: "Quezon City", label: "Quezon City" },

  // R
  { value: "Roxas", label: "Roxas" },

  // S
  { value: "Sagay", label: "Sagay" },
  { value: "Samal", label: "Island Garden City of Samal" },
  { value: "San Carlos", label: "San Carlos (Negros Occidental)" },
  { value: "San Fernando", label: "San Fernando (La Union)" },
  { value: "San Jose", label: "San Jose (Nueva Ecija)" },
  { value: "San Jose Del Monte", label: "San Jose Del Monte" },
  { value: "San Juan", label: "San Juan" },
  { value: "San Pablo", label: "San Pablo" },
  { value: "San Pedro", label: "San Pedro" },
  { value: "Santa Rosa", label: "Santa Rosa" },
  { value: "Santiago", label: "Santiago" },
  { value: "Santo Tomas", label: "Santo Tomas (Batangas)" },
  { value: "Science City of Muñoz", label: "Science City of Muñoz" },
  { value: "Silay", label: "Silay" },
  { value: "Sipalay", label: "Sipalay" },
  { value: "Sorsogon", label: "Sorsogon" },
  { value: "Surigao", label: "Surigao" },

  // T
  { value: "Tabaco", label: "Tabaco" },
  { value: "Tabuk", label: "Tabuk" },
  { value: "Tacloban", label: "Tacloban" },
  { value: "Tacurong", label: "Tacurong" },
  { value: "Tagaytay", label: "Tagaytay" },
  { value: "Tagbilaran", label: "Tagbilaran" },
  { value: "Taguig", label: "Taguig" },
  { value: "Tagum", label: "Tagum" },
  { value: "Talisay", label: "Talisay (Cebu)" },
  { value: "Talisay (Negros Occidental)", label: "Talisay (Negros Occidental)" },
  { value: "Tanauan", label: "Tanauan" },
  { value: "Tandag", label: "Tandag" },
  { value: "Tangub", label: "Tangub" },
  { value: "Tanjay", label: "Tanjay" },
  { value: "Tarlac", label: "Tarlac" },
  { value: "Tayabas", label: "Tayabas" },
  { value: "Toledo", label: "Toledo" },
  { value: "Trece Martires", label: "Trece Martires" },
  { value: "Tuguegarao", label: "Tuguegarao" },

  // U
  { value: "Urdaneta", label: "Urdaneta" },

  // V
  { value: "Valencia", label: "Valencia (Bukidnon)" },
  { value: "Valenzuela", label: "Valenzuela" },
  { value: "Victorias", label: "Victorias" },
  { value: "Vigan", label: "Vigan" },

  // Z
  { value: "Zamboanga", label: "Zamboanga" }
];

// Sort cities alphabetically by label (just to be sure)
const sortedCities = [...PHILIPPINE_CITIES].sort((a, b) => 
  a.label.localeCompare(b.label)
);

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

function Register() {
  const navigate = useNavigate(); // Add this hook
  
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

  // Preload images to prevent blurriness
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
    setForm({ ...form, region: value });
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
    setCurrentSlide(index);
  };

  // Auto-advance slides every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleAdminLogin = () => {
    navigate("/login");
  };

  return (
    <div className="register-page">
      <div className="register-container">
        {/* Left Side - Carousel */}
        <div className="carousel-side">
          <div className="carousel-container">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
              >
                <img 
                  src={slide.image} 
                  alt={`Slide ${index + 1}`}
                  className="carousel-image"
                />
              </div>
            ))}
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
                    <label htmlFor="city">City / Municipality *</label>
                    <CustomSelect
                      value={form.city}
                      onChange={handleCityChange}
                      options={sortedCities}
                      placeholder="Select City/Municipality"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="region">Region *</label>
                    <CustomSelect
                      value={form.region}
                      onChange={handleRegionChange}
                      options={PHILIPPINE_REGIONS}
                      placeholder="Select Region"
                    />
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