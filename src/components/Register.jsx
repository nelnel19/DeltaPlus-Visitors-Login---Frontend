// Register.jsx - Complete with full Philippine Regions, Cities, and Municipalities
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/register.css";

// Searchable Custom Select Component for dropdowns with auto-positioning
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

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current.focus();
      }, 100);
    }
  }, [isOpen]);

  const selectedOption = options.find(opt => opt.value === value);
  
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

// Philippine Regions data
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
  { value: "NIR", label: "Negros Island Region (NIR)", fullName: "Negros Island Region (NIR)" },
  { value: "VII", label: "Region VII (Central Visayas)", fullName: "Region VII (Central Visayas)" },
  { value: "VIII", label: "Region VIII (Eastern Visayas)", fullName: "Region VIII (Eastern Visayas)" },
  { value: "IX", label: "Region IX (Zamboanga Peninsula)", fullName: "Region IX (Zamboanga Peninsula)" },
  { value: "X", label: "Region X (Northern Mindanao)", fullName: "Region X (Northern Mindanao)" },
  { value: "XI", label: "Region XI (Davao Region)", fullName: "Region XI (Davao Region)" },
  { value: "XII", label: "Region XII (SOCCSKSARGEN)", fullName: "Region XII (SOCCSKSARGEN)" },
  { value: "XIII", label: "Region XIII (Caraga)", fullName: "Region XIII (Caraga)" },
  { value: "BARMM", label: "Bangsamoro Autonomous Region in Muslim Mindanao (BARMM)", fullName: "Bangsamoro Autonomous Region in Muslim Mindanao (BARMM)" }
];

// COMPLETE CITIES AND MUNICIPALITIES ORGANIZED BY REGION
const CITIES_BY_REGION = {
  // National Capital Region (NCR) - 16 Cities, 1 Municipality
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
  // Cordillera Administrative Region (CAR) - 2 Cities, 75 Municipalities
  CAR: [
    { value: "Baguio", label: "Baguio" },
    { value: "Tabuk", label: "Tabuk" },
    // Abra - 27 Municipalities
    { value: "Bangued", label: "Bangued" }, { value: "Boliney", label: "Boliney" }, { value: "Bucay", label: "Bucay" },
    { value: "Bucloc", label: "Bucloc" }, { value: "Daguioman", label: "Daguioman" }, { value: "Danglas", label: "Danglas" },
    { value: "Dolores", label: "Dolores" }, { value: "La Paz", label: "La Paz" }, { value: "Lacub", label: "Lacub" },
    { value: "Lagangilang", label: "Lagangilang" }, { value: "Lagayan", label: "Lagayan" }, { value: "Langiden", label: "Langiden" },
    { value: "Licuan-Baay", label: "Licuan-Baay" }, { value: "Luba", label: "Luba" }, { value: "Malibcong", label: "Malibcong" },
    { value: "Manabo", label: "Manabo" }, { value: "Peñarrubia", label: "Peñarrubia" }, { value: "Pidigan", label: "Pidigan" },
    { value: "Pilar", label: "Pilar" }, { value: "Sallapadan", label: "Sallapadan" }, { value: "San Isidro", label: "San Isidro" },
    { value: "San Juan", label: "San Juan" }, { value: "San Quintin", label: "San Quintin" }, { value: "Tayum", label: "Tayum" },
    { value: "Tineg", label: "Tineg" }, { value: "Tubo", label: "Tubo" }, { value: "Villaviciosa", label: "Villaviciosa" },
    // Apayao - 7 Municipalities
    { value: "Calanasan", label: "Calanasan" }, { value: "Conner", label: "Conner" }, { value: "Flora", label: "Flora" },
    { value: "Kabugao", label: "Kabugao" }, { value: "Luna", label: "Luna" }, { value: "Pudtol", label: "Pudtol" },
    { value: "Santa Marcela", label: "Santa Marcela" },
    // Benguet - 13 Municipalities + 1 City (Baguio already listed)
    { value: "Atok", label: "Atok" }, { value: "Bakun", label: "Bakun" }, { value: "Bokod", label: "Bokod" },
    { value: "Buguias", label: "Buguias" }, { value: "Itogon", label: "Itogon" }, { value: "Kabayan", label: "Kabayan" },
    { value: "Kapangan", label: "Kapangan" }, { value: "Kibungan", label: "Kibungan" }, { value: "La Trinidad", label: "La Trinidad" },
    { value: "Mankayan", label: "Mankayan" }, { value: "Sablan", label: "Sablan" }, { value: "Tuba", label: "Tuba" },
    { value: "Tublay", label: "Tublay" },
    // Ifugao - 11 Municipalities
    { value: "Aguinaldo", label: "Aguinaldo" }, { value: "Alfonso Lista", label: "Alfonso Lista" }, { value: "Asipulo", label: "Asipulo" },
    { value: "Banaue", label: "Banaue" }, { value: "Hingyon", label: "Hingyon" }, { value: "Hungduan", label: "Hungduan" },
    { value: "Kiangan", label: "Kiangan" }, { value: "Lagawe", label: "Lagawe" }, { value: "Lamut", label: "Lamut" },
    { value: "Mayoyao", label: "Mayoyao" }, { value: "Tinoc", label: "Tinoc" },
    // Kalinga - 8 Municipalities + 1 City (Tabuk already listed)
    { value: "Balbalan", label: "Balbalan" }, { value: "Lubuagan", label: "Lubuagan" }, { value: "Pasil", label: "Pasil" },
    { value: "Pinukpuk", label: "Pinukpuk" }, { value: "Rizal", label: "Rizal" }, { value: "Tanudan", label: "Tanudan" },
    { value: "Tinglayan", label: "Tinglayan" },
    // Mountain Province - 10 Municipalities
    { value: "Barlig", label: "Barlig" }, { value: "Bauko", label: "Bauko" }, { value: "Besao", label: "Besao" },
    { value: "Bontoc", label: "Bontoc" }, { value: "Natonin", label: "Natonin" }, { value: "Paracelis", label: "Paracelis" },
    { value: "Sabangan", label: "Sabangan" }, { value: "Sadanga", label: "Sadanga" }, { value: "Sagada", label: "Sagada" },
    { value: "Tadian", label: "Tadian" }
  ],
  // Region I - Ilocos Region (9 Cities, 116 Municipalities)
  I: [
    // Cities
    { value: "Alaminos", label: "Alaminos" }, { value: "Batac", label: "Batac" }, { value: "Candon", label: "Candon" },
    { value: "Dagupan", label: "Dagupan" }, { value: "Laoag", label: "Laoag" }, { value: "San Carlos (Pangasinan)", label: "San Carlos (Pangasinan)" },
    { value: "San Fernando (La Union)", label: "San Fernando (La Union)" }, { value: "Urdaneta", label: "Urdaneta" }, { value: "Vigan", label: "Vigan" },
    // Ilocos Norte - 21 Municipalities + 1 City (Laoag already listed)
    { value: "Adams", label: "Adams" }, { value: "Bacarra", label: "Bacarra" }, { value: "Badoc", label: "Badoc" },
    { value: "Bangui", label: "Bangui" }, { value: "Banna", label: "Banna" }, { value: "Burgos", label: "Burgos" },
    { value: "Carasi", label: "Carasi" }, { value: "Currimao", label: "Currimao" }, { value: "Dingras", label: "Dingras" },
    { value: "Dumalneg", label: "Dumalneg" }, { value: "Marcos", label: "Marcos" }, { value: "Nueva Era", label: "Nueva Era" },
    { value: "Pagudpud", label: "Pagudpud" }, { value: "Paoay", label: "Paoay" }, { value: "Pasuquin", label: "Pasuquin" },
    { value: "Piddig", label: "Piddig" }, { value: "Pinili", label: "Pinili" }, { value: "San Nicolas", label: "San Nicolas" },
    { value: "Sarrat", label: "Sarrat" }, { value: "Solsona", label: "Solsona" }, { value: "Vintar", label: "Vintar" },
    // Ilocos Sur - 32 Municipalities + 2 Cities (Candon, Vigan already listed)
    { value: "Alilem", label: "Alilem" }, { value: "Banayoyo", label: "Banayoyo" }, { value: "Bantay", label: "Bantay" },
    { value: "Burgos", label: "Burgos" }, { value: "Cabugao", label: "Cabugao" }, { value: "Caoayan", label: "Caoayan" },
    { value: "Cervantes", label: "Cervantes" }, { value: "Galimuyod", label: "Galimuyod" }, { value: "Gregorio del Pilar", label: "Gregorio del Pilar" },
    { value: "Lidlidda", label: "Lidlidda" }, { value: "Magsingal", label: "Magsingal" }, { value: "Nagbukel", label: "Nagbukel" },
    { value: "Narvacan", label: "Narvacan" }, { value: "Quirino", label: "Quirino" }, { value: "Salcedo", label: "Salcedo" },
    { value: "San Emilio", label: "San Emilio" }, { value: "San Esteban", label: "San Esteban" }, { value: "San Ildefonso", label: "San Ildefonso" },
    { value: "San Juan", label: "San Juan" }, { value: "San Vicente", label: "San Vicente" }, { value: "Santa", label: "Santa" },
    { value: "Santa Catalina", label: "Santa Catalina" }, { value: "Santa Cruz", label: "Santa Cruz" }, { value: "Santa Lucia", label: "Santa Lucia" },
    { value: "Santa Maria", label: "Santa Maria" }, { value: "Santiago", label: "Santiago" }, { value: "Santo Domingo", label: "Santo Domingo" },
    { value: "Sigay", label: "Sigay" }, { value: "Sinait", label: "Sinait" }, { value: "Sugpon", label: "Sugpon" },
    { value: "Suyo", label: "Suyo" }, { value: "Tagudin", label: "Tagudin" },
    // La Union - 19 Municipalities + 1 City (San Fernando already listed)
    { value: "Agoo", label: "Agoo" }, { value: "Aringay", label: "Aringay" }, { value: "Bacnotan", label: "Bacnotan" },
    { value: "Bagulin", label: "Bagulin" }, { value: "Balaoan", label: "Balaoan" }, { value: "Bangar", label: "Bangar" },
    { value: "Bauang", label: "Bauang" }, { value: "Burgos", label: "Burgos" }, { value: "Caba", label: "Caba" },
    { value: "Luna", label: "Luna" }, { value: "Naguilian", label: "Naguilian" }, { value: "Pugo", label: "Pugo" },
    { value: "Rosario", label: "Rosario" }, { value: "San Gabriel", label: "San Gabriel" }, { value: "San Juan", label: "San Juan" },
    { value: "Santo Tomas", label: "Santo Tomas" }, { value: "Santol", label: "Santol" }, { value: "Sudipen", label: "Sudipen" },
    { value: "Tubao", label: "Tubao" },
    // Pangasinan - 44 Municipalities + 3 Cities (Alaminos, Dagupan, San Carlos, Urdaneta already listed)
    { value: "Agno", label: "Agno" }, { value: "Aguilar", label: "Aguilar" }, { value: "Alcala", label: "Alcala" },
    { value: "Anda", label: "Anda" }, { value: "Asingan", label: "Asingan" }, { value: "Balungao", label: "Balungao" },
    { value: "Bani", label: "Bani" }, { value: "Basista", label: "Basista" }, { value: "Bautista", label: "Bautista" },
    { value: "Bayambang", label: "Bayambang" }, { value: "Binalonan", label: "Binalonan" }, { value: "Binmaley", label: "Binmaley" },
    { value: "Bolinao", label: "Bolinao" }, { value: "Bugallon", label: "Bugallon" }, { value: "Burgos", label: "Burgos" },
    { value: "Calasiao", label: "Calasiao" }, { value: "Dasol", label: "Dasol" }, { value: "Infanta", label: "Infanta" },
    { value: "Labrador", label: "Labrador" }, { value: "Laoac", label: "Laoac" }, { value: "Lingayen", label: "Lingayen" },
    { value: "Mabini", label: "Mabini" }, { value: "Malasiqui", label: "Malasiqui" }, { value: "Manaoag", label: "Manaoag" },
    { value: "Mangaldan", label: "Mangaldan" }, { value: "Mangatarem", label: "Mangatarem" }, { value: "Mapandan", label: "Mapandan" },
    { value: "Natividad", label: "Natividad" }, { value: "Pozorrubio", label: "Pozorrubio" }, { value: "Rosales", label: "Rosales" },
    { value: "San Fabian", label: "San Fabian" }, { value: "San Jacinto", label: "San Jacinto" }, { value: "San Manuel", label: "San Manuel" },
    { value: "San Nicolas", label: "San Nicolas" }, { value: "San Quintin", label: "San Quintin" }, { value: "Santa Barbara", label: "Santa Barbara" },
    { value: "Santa Maria", label: "Santa Maria" }, { value: "Santo Tomas", label: "Santo Tomas" }, { value: "Sison", label: "Sison" },
    { value: "Sual", label: "Sual" }, { value: "Tayug", label: "Tayug" }, { value: "Umingan", label: "Umingan" },
    { value: "Urbiztondo", label: "Urbiztondo" }, { value: "Villasis", label: "Villasis" }
  ],
  // Region II - Cagayan Valley (4 Cities, 89 Municipalities) - COMPLETE
  II: [
    // Cities
    { value: "Cauayan", label: "Cauayan" },
    { value: "Ilagan", label: "Ilagan" },
    { value: "Santiago", label: "Santiago" },
    { value: "Tuguegarao", label: "Tuguegarao" },
    // Batanes - 6 Municipalities
    { value: "Basco", label: "Basco" },
    { value: "Itbayat", label: "Itbayat" },
    { value: "Ivana", label: "Ivana" },
    { value: "Mahatao", label: "Mahatao" },
    { value: "Sabtang", label: "Sabtang" },
    { value: "Uyugan", label: "Uyugan" },
    // Cagayan - 28 Municipalities
    { value: "Abulug", label: "Abulug" },
    { value: "Alcala", label: "Alcala" },
    { value: "Allacapan", label: "Allacapan" },
    { value: "Amulung", label: "Amulung" },
    { value: "Aparri", label: "Aparri" },
    { value: "Baggao", label: "Baggao" },
    { value: "Ballesteros", label: "Ballesteros" },
    { value: "Buguey", label: "Buguey" },
    { value: "Calayan", label: "Calayan" },
    { value: "Camalaniugan", label: "Camalaniugan" },
    { value: "Claveria", label: "Claveria" },
    { value: "Enrile", label: "Enrile" },
    { value: "Gattaran", label: "Gattaran" },
    { value: "Gonzaga", label: "Gonzaga" },
    { value: "Iguig", label: "Iguig" },
    { value: "Lal-lo", label: "Lal-lo" },
    { value: "Lasam", label: "Lasam" },
    { value: "Pamplona", label: "Pamplona" },
    { value: "Peñablanca", label: "Peñablanca" },
    { value: "Piat", label: "Piat" },
    { value: "Rizal", label: "Rizal" },
    { value: "Sanchez-Mira", label: "Sanchez-Mira" },
    { value: "Santa Ana", label: "Santa Ana" },
    { value: "Santa Praxedes", label: "Santa Praxedes" },
    { value: "Santa Teresita", label: "Santa Teresita" },
    { value: "Santo Niño", label: "Santo Niño" },
    { value: "Solana", label: "Solana" },
    { value: "Tuao", label: "Tuao" },
    // Isabela - 34 Municipalities + 2 Cities (Ilagan, Cauayan already listed)
    { value: "Alicia", label: "Alicia" },
    { value: "Angadanan", label: "Angadanan" },
    { value: "Aurora", label: "Aurora" },
    { value: "Benito Soliven", label: "Benito Soliven" },
    { value: "Burgos", label: "Burgos" },
    { value: "Cabagan", label: "Cabagan" },
    { value: "Cabatuan", label: "Cabatuan" },
    { value: "Cordon", label: "Cordon" },
    { value: "Delfin Albano", label: "Delfin Albano" },
    { value: "Dinapigue", label: "Dinapigue" },
    { value: "Divilacan", label: "Divilacan" },
    { value: "Echague", label: "Echague" },
    { value: "Gamu", label: "Gamu" },
    { value: "Jones", label: "Jones" },
    { value: "Luna", label: "Luna" },
    { value: "Maconacon", label: "Maconacon" },
    { value: "Mallig", label: "Mallig" },
    { value: "Naguilian", label: "Naguilian" },
    { value: "Palanan", label: "Palanan" },
    { value: "Quezon", label: "Quezon" },
    { value: "Quirino", label: "Quirino" },
    { value: "Ramon", label: "Ramon" },
    { value: "Reina Mercedes", label: "Reina Mercedes" },
    { value: "Roxas", label: "Roxas" },
    { value: "San Agustin", label: "San Agustin" },
    { value: "San Guillermo", label: "San Guillermo" },
    { value: "San Isidro", label: "San Isidro" },
    { value: "San Manuel", label: "San Manuel" },
    { value: "San Mariano", label: "San Mariano" },
    { value: "San Mateo", label: "San Mateo" },
    { value: "San Pablo", label: "San Pablo" },
    { value: "Santa Maria", label: "Santa Maria" },
    { value: "Santo Tomas", label: "Santo Tomas" },
    { value: "Tumauini", label: "Tumauini" },
    // Nueva Vizcaya - 15 Municipalities
    { value: "Alfonso Castañeda", label: "Alfonso Castañeda" },
    { value: "Ambaguio", label: "Ambaguio" },
    { value: "Aritao", label: "Aritao" },
    { value: "Bagabag", label: "Bagabag" },
    { value: "Bambang", label: "Bambang" },
    { value: "Bayombong", label: "Bayombong" },
    { value: "Diadi", label: "Diadi" },
    { value: "Dupax del Norte", label: "Dupax del Norte" },
    { value: "Dupax del Sur", label: "Dupax del Sur" },
    { value: "Kasibu", label: "Kasibu" },
    { value: "Kayapa", label: "Kayapa" },
    { value: "Quezon", label: "Quezon" },
    { value: "Santa Fe", label: "Santa Fe" },
    { value: "Solano", label: "Solano" },
    { value: "Villaverde", label: "Villaverde" },
    // Quirino - 6 Municipalities
    { value: "Aglipay", label: "Aglipay" },
    { value: "Cabarroguis", label: "Cabarroguis" },
    { value: "Diffun", label: "Diffun" },
    { value: "Maddela", label: "Maddela" },
    { value: "Nagtipunan", label: "Nagtipunan" },
    { value: "Saguday", label: "Saguday" }
  ],
  // Region III - Central Luzon (15 Cities, 115 Municipalities + Subic)
  III: [
    // Cities
    { value: "Angeles", label: "Angeles" },
    { value: "Balanga", label: "Balanga" },
    { value: "Cabanatuan", label: "Cabanatuan" },
    { value: "Gapan", label: "Gapan" },
    { value: "Mabalacat", label: "Mabalacat" },
    { value: "Malolos", label: "Malolos" },
    { value: "Meycauayan", label: "Meycauayan" },
    { value: "Muñoz", label: "Muñoz" },
    { value: "Olongapo", label: "Olongapo" },
    { value: "Palayan", label: "Palayan" },
    { value: "San Fernando (Pampanga)", label: "San Fernando (Pampanga)" },
    { value: "San Jose (Nueva Ecija)", label: "San Jose (Nueva Ecija)" },
    { value: "San Jose del Monte", label: "San Jose del Monte" },
    { value: "Tarlac City", label: "Tarlac City" },
    // Aurora - 8 Municipalities
    { value: "Baler", label: "Baler" },
    { value: "Casiguran", label: "Casiguran" },
    { value: "Dilasag", label: "Dilasag" },
    { value: "Dinalungan", label: "Dinalungan" },
    { value: "Dingalan", label: "Dingalan" },
    { value: "Dipaculao", label: "Dipaculao" },
    { value: "Maria Aurora", label: "Maria Aurora" },
    { value: "San Luis", label: "San Luis" },
    // Bataan - 11 Municipalities + 1 City (Balanga already listed)
    { value: "Abucay", label: "Abucay" },
    { value: "Bagac", label: "Bagac" },
    { value: "Dinalupihan", label: "Dinalupihan" },
    { value: "Hermosa", label: "Hermosa" },
    { value: "Limay", label: "Limay" },
    { value: "Mariveles", label: "Mariveles" },
    { value: "Morong", label: "Morong" },
    { value: "Orani", label: "Orani" },
    { value: "Orion", label: "Orion" },
    { value: "Pilar", label: "Pilar" },
    { value: "Samal", label: "Samal" },
    // Bulacan - 21 Municipalities + 3 Cities (Malolos, Meycauayan, San Jose del Monte already listed)
    { value: "Angat", label: "Angat" },
    { value: "Balagtas", label: "Balagtas" },
    { value: "Baliwag", label: "Baliwag" },
    { value: "Bocaue", label: "Bocaue" },
    { value: "Bulakan", label: "Bulakan" },
    { value: "Bustos", label: "Bustos" },
    { value: "Calumpit", label: "Calumpit" },
    { value: "Doña Remedios Trinidad", label: "Doña Remedios Trinidad" },
    { value: "Guiguinto", label: "Guiguinto" },
    { value: "Hagonoy", label: "Hagonoy" },
    { value: "Marilao", label: "Marilao" },
    { value: "Norzagaray", label: "Norzagaray" },
    { value: "Obando", label: "Obando" },
    { value: "Pandi", label: "Pandi" },
    { value: "Paombong", label: "Paombong" },
    { value: "Plaridel", label: "Plaridel" },
    { value: "Pulilan", label: "Pulilan" },
    { value: "San Ildefonso", label: "San Ildefonso" },
    { value: "San Miguel", label: "San Miguel" },
    { value: "San Rafael", label: "San Rafael" },
    { value: "Santa Maria", label: "Santa Maria" },
    // Nueva Ecija - 27 Municipalities + 5 Cities (Cabanatuan, Gapan, Muñoz, Palayan, San Jose already listed)
    { value: "Aliaga", label: "Aliaga" },
    { value: "Bongabon", label: "Bongabon" },
    { value: "Cabiao", label: "Cabiao" },
    { value: "Carranglan", label: "Carranglan" },
    { value: "Cuyapo", label: "Cuyapo" },
    { value: "Gabaldon", label: "Gabaldon" },
    { value: "General Mamerto Natividad", label: "General Mamerto Natividad" },
    { value: "General Tinio", label: "General Tinio" },
    { value: "Guimba", label: "Guimba" },
    { value: "Jaen", label: "Jaen" },
    { value: "Laur", label: "Laur" },
    { value: "Licab", label: "Licab" },
    { value: "Llanera", label: "Llanera" },
    { value: "Lupao", label: "Lupao" },
    { value: "Nampicuan", label: "Nampicuan" },
    { value: "Pantabangan", label: "Pantabangan" },
    { value: "Peñaranda", label: "Peñaranda" },
    { value: "Quezon", label: "Quezon" },
    { value: "Rizal", label: "Rizal" },
    { value: "San Antonio", label: "San Antonio" },
    { value: "San Isidro", label: "San Isidro" },
    { value: "San Leonardo", label: "San Leonardo" },
    { value: "Santa Rosa", label: "Santa Rosa" },
    { value: "Santo Domingo", label: "Santo Domingo" },
    { value: "Talavera", label: "Talavera" },
    { value: "Talugtug", label: "Talugtug" },
    { value: "Zaragoza", label: "Zaragoza" },
    // Pampanga - 19 Municipalities + 2 Cities (Angeles, Mabalacat, San Fernando already listed)
    { value: "Apalit", label: "Apalit" },
    { value: "Arayat", label: "Arayat" },
    { value: "Bacolor", label: "Bacolor" },
    { value: "Candaba", label: "Candaba" },
    { value: "Floridablanca", label: "Floridablanca" },
    { value: "Guagua", label: "Guagua" },
    { value: "Lubao", label: "Lubao" },
    { value: "Macabebe", label: "Macabebe" },
    { value: "Magalang", label: "Magalang" },
    { value: "Masantol", label: "Masantol" },
    { value: "Mexico", label: "Mexico" },
    { value: "Minalin", label: "Minalin" },
    { value: "Porac", label: "Porac" },
    { value: "San Luis", label: "San Luis" },
    { value: "San Simon", label: "San Simon" },
    { value: "Santa Ana", label: "Santa Ana" },
    { value: "Santa Rita", label: "Santa Rita" },
    { value: "Santo Tomas", label: "Santo Tomas" },
    { value: "Sasmuan", label: "Sasmuan" },
    // Tarlac - 17 Municipalities + 1 City (Tarlac City already listed)
    { value: "Anao", label: "Anao" },
    { value: "Bamban", label: "Bamban" },
    { value: "Camiling", label: "Camiling" },
    { value: "Capas", label: "Capas" },
    { value: "Concepcion", label: "Concepcion" },
    { value: "Gerona", label: "Gerona" },
    { value: "La Paz", label: "La Paz" },
    { value: "Mayantoc", label: "Mayantoc" },
    { value: "Moncada", label: "Moncada" },
    { value: "Paniqui", label: "Paniqui" },
    { value: "Pura", label: "Pura" },
    { value: "Ramos", label: "Ramos" },
    { value: "San Clemente", label: "San Clemente" },
    { value: "San Jose", label: "San Jose" },
    { value: "San Manuel", label: "San Manuel" },
    { value: "Santa Ignacia", label: "Santa Ignacia" },
    { value: "Victoria", label: "Victoria" },
    // Zambales - 13 Municipalities + 1 City (Olongapo already listed)
    { value: "Botolan", label: "Botolan" },
    { value: "Cabangan", label: "Cabangan" },
    { value: "Candelaria", label: "Candelaria" },
    { value: "Castillejos", label: "Castillejos" },
    { value: "Iba", label: "Iba" },
    { value: "Masinloc", label: "Masinloc" },
    { value: "Palauig", label: "Palauig" },
    { value: "San Antonio", label: "San Antonio" },
    { value: "San Felipe", label: "San Felipe" },
    { value: "San Marcelino", label: "San Marcelino" },
    { value: "San Narciso", label: "San Narciso" },
    { value: "Santa Cruz", label: "Santa Cruz" },
    { value: "Subic", label: "Subic" }
  ],
  // Region IV-A - CALABARZON (22 Cities, 120 Municipalities)
  "IV-A": [
    // Cities
    { value: "Antipolo", label: "Antipolo" },
    { value: "Bacoor", label: "Bacoor" },
    { value: "Batangas City", label: "Batangas City" },
    { value: "Biñan", label: "Biñan" },
    { value: "Cabuyao", label: "Cabuyao" },
    { value: "Calamba", label: "Calamba" },
    { value: "Cavite City", label: "Cavite City" },
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
    // Batangas - 30 Municipalities + 3 Cities (Batangas City, Lipa, Santo Tomas, Tanauan already listed)
    { value: "Agoncillo", label: "Agoncillo" },
    { value: "Alitagtag", label: "Alitagtag" },
    { value: "Balayan", label: "Balayan" },
    { value: "Balete", label: "Balete" },
    { value: "Bauan", label: "Bauan" },
    { value: "Calaca", label: "Calaca" },
    { value: "Calatagan", label: "Calatagan" },
    { value: "Cuenca", label: "Cuenca" },
    { value: "Ibaan", label: "Ibaan" },
    { value: "Laurel", label: "Laurel" },
    { value: "Lemery", label: "Lemery" },
    { value: "Lian", label: "Lian" },
    { value: "Lobo", label: "Lobo" },
    { value: "Mabini", label: "Mabini" },
    { value: "Malvar", label: "Malvar" },
    { value: "Mataasnakahoy", label: "Mataasnakahoy" },
    { value: "Nasugbu", label: "Nasugbu" },
    { value: "Padre Garcia", label: "Padre Garcia" },
    { value: "Rosario", label: "Rosario" },
    { value: "San Jose", label: "San Jose" },
    { value: "San Juan", label: "San Juan" },
    { value: "San Luis", label: "San Luis" },
    { value: "San Nicolas", label: "San Nicolas" },
    { value: "San Pascual", label: "San Pascual" },
    { value: "Santa Teresita", label: "Santa Teresita" },
    { value: "Taal", label: "Taal" },
    { value: "Talisay", label: "Talisay" },
    { value: "Taysan", label: "Taysan" },
    { value: "Tingloy", label: "Tingloy" },
    { value: "Tuy", label: "Tuy" },
    // Cavite - 15 Municipalities + 7 Cities (Bacoor, Cavite City, Dasmariñas, General Trias, Imus, Tagaytay, Trece Martires already listed)
    { value: "Alfonso", label: "Alfonso" },
    { value: "Amadeo", label: "Amadeo" },
    { value: "Carmona", label: "Carmona" },
    { value: "General Emilio Aguinaldo", label: "General Emilio Aguinaldo" },
    { value: "Indang", label: "Indang" },
    { value: "Magallanes", label: "Magallanes" },
    { value: "Maragondon", label: "Maragondon" },
    { value: "Mendez", label: "Mendez" },
    { value: "Naic", label: "Naic" },
    { value: "Noveleta", label: "Noveleta" },
    { value: "Rosario", label: "Rosario" },
    { value: "Silang", label: "Silang" },
    { value: "Tanza", label: "Tanza" },
    { value: "Ternate", label: "Ternate" },
    { value: "Gen. Mariano Alvarez", label: "Gen. Mariano Alvarez" },
    // Laguna - 24 Municipalities + 6 Cities (Biñan, Cabuyao, Calamba, San Pablo, San Pedro, Santa Rosa already listed)
    { value: "Alaminos", label: "Alaminos" },
    { value: "Bay", label: "Bay" },
    { value: "Calauan", label: "Calauan" },
    { value: "Cavinti", label: "Cavinti" },
    { value: "Famy", label: "Famy" },
    { value: "Kalayaan", label: "Kalayaan" },
    { value: "Liliw", label: "Liliw" },
    { value: "Los Baños", label: "Los Baños" },
    { value: "Luisiana", label: "Luisiana" },
    { value: "Lumban", label: "Lumban" },
    { value: "Mabitac", label: "Mabitac" },
    { value: "Magdalena", label: "Magdalena" },
    { value: "Majayjay", label: "Majayjay" },
    { value: "Nagcarlan", label: "Nagcarlan" },
    { value: "Paete", label: "Paete" },
    { value: "Pagsanjan", label: "Pagsanjan" },
    { value: "Pakil", label: "Pakil" },
    { value: "Pangil", label: "Pangil" },
    { value: "Pila", label: "Pila" },
    { value: "Rizal", label: "Rizal" },
    { value: "Santa Cruz", label: "Santa Cruz" },
    { value: "Santa Maria", label: "Santa Maria" },
    { value: "Siniloan", label: "Siniloan" },
    { value: "Victoria", label: "Victoria" },
    // Quezon - 39 Municipalities + 2 Cities (Lucena, Tayabas already listed)
    { value: "Agdangan", label: "Agdangan" },
    { value: "Alabat", label: "Alabat" },
    { value: "Atimonan", label: "Atimonan" },
    { value: "Buenavista", label: "Buenavista" },
    { value: "Burdeos", label: "Burdeos" },
    { value: "Calauag", label: "Calauag" },
    { value: "Candelaria", label: "Candelaria" },
    { value: "Catanauan", label: "Catanauan" },
    { value: "Dolores", label: "Dolores" },
    { value: "General Luna", label: "General Luna" },
    { value: "General Nakar", label: "General Nakar" },
    { value: "Guinayangan", label: "Guinayangan" },
    { value: "Gumaca", label: "Gumaca" },
    { value: "Infanta", label: "Infanta" },
    { value: "Jomalig", label: "Jomalig" },
    { value: "Lopez", label: "Lopez" },
    { value: "Lucban", label: "Lucban" },
    { value: "Macalelon", label: "Macalelon" },
    { value: "Mauban", label: "Mauban" },
    { value: "Mulanay", label: "Mulanay" },
    { value: "Padre Burgos", label: "Padre Burgos" },
    { value: "Pagbilao", label: "Pagbilao" },
    { value: "Panukulan", label: "Panukulan" },
    { value: "Patnanungan", label: "Patnanungan" },
    { value: "Perez", label: "Perez" },
    { value: "Pitogo", label: "Pitogo" },
    { value: "Plaridel", label: "Plaridel" },
    { value: "Polillo", label: "Polillo" },
    { value: "Quezon", label: "Quezon" },
    { value: "Real", label: "Real" },
    { value: "Sampaloc", label: "Sampaloc" },
    { value: "San Andres", label: "San Andres" },
    { value: "San Antonio", label: "San Antonio" },
    { value: "San Francisco", label: "San Francisco" },
    { value: "San Narciso", label: "San Narciso" },
    { value: "Sariaya", label: "Sariaya" },
    { value: "Tagkawayan", label: "Tagkawayan" },
    { value: "Tiaong", label: "Tiaong" },
    { value: "Unisan", label: "Unisan" },
    // Rizal - 13 Municipalities + 1 City (Antipolo already listed)
    { value: "Angono", label: "Angono" },
    { value: "Baras", label: "Baras" },
    { value: "Binangonan", label: "Binangonan" },
    { value: "Cainta", label: "Cainta" },
    { value: "Cardona", label: "Cardona" },
    { value: "Jalajala", label: "Jalajala" },
    { value: "Morong", label: "Morong" },
    { value: "Pililla", label: "Pililla" },
    { value: "Rodriguez", label: "Rodriguez" },
    { value: "San Mateo", label: "San Mateo" },
    { value: "Tanay", label: "Tanay" },
    { value: "Taytay", label: "Taytay" },
    { value: "Teresa", label: "Teresa" }
  ],
  // MIMAROPA Region (2 Cities, 71 Municipalities)
  MIMAROPA: [
    // Cities
    { value: "Calapan", label: "Calapan" },
    { value: "Puerto Princesa", label: "Puerto Princesa" },
    // Marinduque - 6 Municipalities
    { value: "Boac", label: "Boac" },
    { value: "Buenavista", label: "Buenavista" },
    { value: "Gasan", label: "Gasan" },
    { value: "Mogpog", label: "Mogpog" },
    { value: "Santa Cruz", label: "Santa Cruz" },
    { value: "Torrijos", label: "Torrijos" },
    // Occidental Mindoro - 11 Municipalities
    { value: "Abra de Ilog", label: "Abra de Ilog" },
    { value: "Calintaan", label: "Calintaan" },
    { value: "Looc", label: "Looc" },
    { value: "Lubang", label: "Lubang" },
    { value: "Magsaysay", label: "Magsaysay" },
    { value: "Mamburao", label: "Mamburao" },
    { value: "Paluan", label: "Paluan" },
    { value: "Rizal", label: "Rizal" },
    { value: "Sablayan", label: "Sablayan" },
    { value: "San Jose", label: "San Jose" },
    { value: "Santa Cruz", label: "Santa Cruz" },
    // Oriental Mindoro - 14 Municipalities + 1 City (Calapan already listed)
    { value: "Baco", label: "Baco" },
    { value: "Bansud", label: "Bansud" },
    { value: "Bongabong", label: "Bongabong" },
    { value: "Bulalacao", label: "Bulalacao" },
    { value: "Gloria", label: "Gloria" },
    { value: "Mansalay", label: "Mansalay" },
    { value: "Naujan", label: "Naujan" },
    { value: "Pinamalayan", label: "Pinamalayan" },
    { value: "Pola", label: "Pola" },
    { value: "Puerto Galera", label: "Puerto Galera" },
    { value: "Roxas", label: "Roxas" },
    { value: "San Teodoro", label: "San Teodoro" },
    { value: "Socorro", label: "Socorro" },
    { value: "Victoria", label: "Victoria" },
    // Palawan - 23 Municipalities + 1 City (Puerto Princesa already listed)
    { value: "Aborlan", label: "Aborlan" },
    { value: "Agutaya", label: "Agutaya" },
    { value: "Araceli", label: "Araceli" },
    { value: "Balabac", label: "Balabac" },
    { value: "Bataraza", label: "Bataraza" },
    { value: "Brooke's Point", label: "Brooke's Point" },
    { value: "Busuanga", label: "Busuanga" },
    { value: "Cagayancillo", label: "Cagayancillo" },
    { value: "Coron", label: "Coron" },
    { value: "Culion", label: "Culion" },
    { value: "Cuyo", label: "Cuyo" },
    { value: "Dumaran", label: "Dumaran" },
    { value: "El Nido", label: "El Nido" },
    { value: "Kalayaan", label: "Kalayaan" },
    { value: "Linapacan", label: "Linapacan" },
    { value: "Magsaysay", label: "Magsaysay" },
    { value: "Narra", label: "Narra" },
    { value: "Quezon", label: "Quezon" },
    { value: "Rizal", label: "Rizal" },
    { value: "Roxas", label: "Roxas" },
    { value: "San Vicente", label: "San Vicente" },
    { value: "Sofronio Española", label: "Sofronio Española" },
    { value: "Taytay", label: "Taytay" },
    // Romblon - 17 Municipalities
    { value: "Alcantara", label: "Alcantara" },
    { value: "Banton", label: "Banton" },
    { value: "Cajidiocan", label: "Cajidiocan" },
    { value: "Calatrava", label: "Calatrava" },
    { value: "Concepcion", label: "Concepcion" },
    { value: "Corcuera", label: "Corcuera" },
    { value: "Ferrol", label: "Ferrol" },
    { value: "Looc", label: "Looc" },
    { value: "Magdiwang", label: "Magdiwang" },
    { value: "Odiongan", label: "Odiongan" },
    { value: "Romblon", label: "Romblon" },
    { value: "San Agustin", label: "San Agustin" },
    { value: "San Andres", label: "San Andres" },
    { value: "San Fernando", label: "San Fernando" },
    { value: "San Jose", label: "San Jose" },
    { value: "Santa Fe", label: "Santa Fe" },
    { value: "Santa Maria", label: "Santa Maria" }
  ],
  // Region V - Bicol Region (7 Cities, 107 Municipalities)
  V: [
    // Cities
    { value: "Iriga", label: "Iriga" },
    { value: "Legazpi", label: "Legazpi" },
    { value: "Ligao", label: "Ligao" },
    { value: "Masbate City", label: "Masbate City" },
    { value: "Naga", label: "Naga" },
    { value: "Sorsogon City", label: "Sorsogon City" },
    { value: "Tabaco", label: "Tabaco" },
    // Albay - 15 Municipalities + 3 Cities (Legazpi, Ligao, Tabaco already listed)
    { value: "Bacacay", label: "Bacacay" },
    { value: "Camalig", label: "Camalig" },
    { value: "Daraga", label: "Daraga" },
    { value: "Guinobatan", label: "Guinobatan" },
    { value: "Jovellar", label: "Jovellar" },
    { value: "Libon", label: "Libon" },
    { value: "Malilipot", label: "Malilipot" },
    { value: "Malinao", label: "Malinao" },
    { value: "Manito", label: "Manito" },
    { value: "Oas", label: "Oas" },
    { value: "Pio Duran", label: "Pio Duran" },
    { value: "Polangui", label: "Polangui" },
    { value: "Rapu-Rapu", label: "Rapu-Rapu" },
    { value: "Santo Domingo", label: "Santo Domingo" },
    { value: "Tiwi", label: "Tiwi" },
    // Camarines Norte - 12 Municipalities
    { value: "Basud", label: "Basud" },
    { value: "Capalonga", label: "Capalonga" },
    { value: "Daet", label: "Daet" },
    { value: "Jose Panganiban", label: "Jose Panganiban" },
    { value: "Labo", label: "Labo" },
    { value: "Mercedes", label: "Mercedes" },
    { value: "Paracale", label: "Paracale" },
    { value: "San Lorenzo Ruiz", label: "San Lorenzo Ruiz" },
    { value: "San Vicente", label: "San Vicente" },
    { value: "Santa Elena", label: "Santa Elena" },
    { value: "Talisay", label: "Talisay" },
    { value: "Vinzons", label: "Vinzons" },
    // Camarines Sur - 35 Municipalities + 2 Cities (Iriga, Naga already listed)
    { value: "Baao", label: "Baao" },
    { value: "Balatan", label: "Balatan" },
    { value: "Bato", label: "Bato" },
    { value: "Bombon", label: "Bombon" },
    { value: "Buhi", label: "Buhi" },
    { value: "Bula", label: "Bula" },
    { value: "Cabusao", label: "Cabusao" },
    { value: "Calabanga", label: "Calabanga" },
    { value: "Camaligan", label: "Camaligan" },
    { value: "Canaman", label: "Canaman" },
    { value: "Caramoan", label: "Caramoan" },
    { value: "Del Gallego", label: "Del Gallego" },
    { value: "Gainza", label: "Gainza" },
    { value: "Garchitorena", label: "Garchitorena" },
    { value: "Goa", label: "Goa" },
    { value: "Lagonoy", label: "Lagonoy" },
    { value: "Libmanan", label: "Libmanan" },
    { value: "Lupi", label: "Lupi" },
    { value: "Magarao", label: "Magarao" },
    { value: "Milaor", label: "Milaor" },
    { value: "Minalabac", label: "Minalabac" },
    { value: "Nabua", label: "Nabua" },
    { value: "Ocampo", label: "Ocampo" },
    { value: "Pamplona", label: "Pamplona" },
    { value: "Pasacao", label: "Pasacao" },
    { value: "Pili", label: "Pili" },
    { value: "Presentacion", label: "Presentacion" },
    { value: "Ragay", label: "Ragay" },
    { value: "Sagñay", label: "Sagñay" },
    { value: "San Fernando", label: "San Fernando" },
    { value: "San Jose", label: "San Jose" },
    { value: "Sipocot", label: "Sipocot" },
    { value: "Siruma", label: "Siruma" },
    { value: "Tigaon", label: "Tigaon" },
    { value: "Tinambac", label: "Tinambac" },
    // Catanduanes - 11 Municipalities
    { value: "Bagamanoc", label: "Bagamanoc" },
    { value: "Baras", label: "Baras" },
    { value: "Bato", label: "Bato" },
    { value: "Caramoran", label: "Caramoran" },
    { value: "Gigmoto", label: "Gigmoto" },
    { value: "Pandan", label: "Pandan" },
    { value: "Panganiban", label: "Panganiban" },
    { value: "San Andres", label: "San Andres" },
    { value: "San Miguel", label: "San Miguel" },
    { value: "Viga", label: "Viga" },
    { value: "Virac", label: "Virac" },
    // Masbate - 20 Municipalities + 1 City (Masbate City already listed)
    { value: "Aroroy", label: "Aroroy" },
    { value: "Baleno", label: "Baleno" },
    { value: "Balud", label: "Balud" },
    { value: "Batuan", label: "Batuan" },
    { value: "Cataingan", label: "Cataingan" },
    { value: "Cawayan", label: "Cawayan" },
    { value: "Claveria", label: "Claveria" },
    { value: "Dimasalang", label: "Dimasalang" },
    { value: "Esperanza", label: "Esperanza" },
    { value: "Mandaon", label: "Mandaon" },
    { value: "Milagros", label: "Milagros" },
    { value: "Mobo", label: "Mobo" },
    { value: "Monreal", label: "Monreal" },
    { value: "Palanas", label: "Palanas" },
    { value: "Pio V. Corpuz", label: "Pio V. Corpuz" },
    { value: "Placer", label: "Placer" },
    { value: "San Fernando", label: "San Fernando" },
    { value: "San Jacinto", label: "San Jacinto" },
    { value: "San Pascual", label: "San Pascual" },
    { value: "Uson", label: "Uson" },
    // Sorsogon - 14 Municipalities + 1 City (Sorsogon City already listed)
    { value: "Barcelona", label: "Barcelona" },
    { value: "Bulan", label: "Bulan" },
    { value: "Bulusan", label: "Bulusan" },
    { value: "Casiguran", label: "Casiguran" },
    { value: "Castilla", label: "Castilla" },
    { value: "Donsol", label: "Donsol" },
    { value: "Gubat", label: "Gubat" },
    { value: "Irosin", label: "Irosin" },
    { value: "Juban", label: "Juban" },
    { value: "Magallanes", label: "Magallanes" },
    { value: "Matnog", label: "Matnog" },
    { value: "Pilar", label: "Pilar" },
    { value: "Prieto Diaz", label: "Prieto Diaz" },
    { value: "Santa Magdalena", label: "Santa Magdalena" }
  ],
  // Region VI - Western Visayas (excluding NIR: Iloilo City, Passi, Roxas)
  VI: [
    // Cities
    { value: "Iloilo City", label: "Iloilo City" },
    { value: "Passi", label: "Passi" },
    { value: "Roxas", label: "Roxas" },
    // Aklan - 17 Municipalities
    { value: "Altavas", label: "Altavas" },
    { value: "Balete", label: "Balete" },
    { value: "Banga", label: "Banga" },
    { value: "Batan", label: "Batan" },
    { value: "Buruanga", label: "Buruanga" },
    { value: "Ibajay", label: "Ibajay" },
    { value: "Kalibo", label: "Kalibo" },
    { value: "Lezo", label: "Lezo" },
    { value: "Libacao", label: "Libacao" },
    { value: "Madalag", label: "Madalag" },
    { value: "Makato", label: "Makato" },
    { value: "Malay", label: "Malay" },
    { value: "Malinao", label: "Malinao" },
    { value: "Nabas", label: "Nabas" },
    { value: "New Washington", label: "New Washington" },
    { value: "Numancia", label: "Numancia" },
    { value: "Tangalan", label: "Tangalan" },
    // Antique - 18 Municipalities
    { value: "Anini-y", label: "Anini-y" },
    { value: "Barbaza", label: "Barbaza" },
    { value: "Belison", label: "Belison" },
    { value: "Bugasong", label: "Bugasong" },
    { value: "Caluya", label: "Caluya" },
    { value: "Culasi", label: "Culasi" },
    { value: "Hamtic", label: "Hamtic" },
    { value: "Laua-an", label: "Laua-an" },
    { value: "Libertad", label: "Libertad" },
    { value: "Pandan", label: "Pandan" },
    { value: "Patnongon", label: "Patnongon" },
    { value: "San Jose", label: "San Jose" },
    { value: "San Remigio", label: "San Remigio" },
    { value: "Sebaste", label: "Sebaste" },
    { value: "Sibalom", label: "Sibalom" },
    { value: "Tibiao", label: "Tibiao" },
    { value: "Tobias Fornier", label: "Tobias Fornier" },
    { value: "Valderrama", label: "Valderrama" },
    // Capiz - 16 Municipalities + 1 City (Roxas already listed)
    { value: "Cuartero", label: "Cuartero" },
    { value: "Dao", label: "Dao" },
    { value: "Dumalag", label: "Dumalag" },
    { value: "Dumarao", label: "Dumarao" },
    { value: "Ivisan", label: "Ivisan" },
    { value: "Jamindan", label: "Jamindan" },
    { value: "Ma-ayon", label: "Ma-ayon" },
    { value: "Mambusao", label: "Mambusao" },
    { value: "Panay", label: "Panay" },
    { value: "Panitan", label: "Panitan" },
    { value: "Pilar", label: "Pilar" },
    { value: "Pontevedra", label: "Pontevedra" },
    { value: "President Roxas", label: "President Roxas" },
    { value: "Sapian", label: "Sapian" },
    { value: "Sigma", label: "Sigma" },
    { value: "Tapaz", label: "Tapaz" },
    // Guimaras - 5 Municipalities
    { value: "Buenavista", label: "Buenavista" },
    { value: "Jordan", label: "Jordan" },
    { value: "Nueva Valencia", label: "Nueva Valencia" },
    { value: "San Lorenzo", label: "San Lorenzo" },
    { value: "Sibunag", label: "Sibunag" },
    // Iloilo - 42 Municipalities + 2 Cities (Iloilo City, Passi already listed)
    { value: "Ajuy", label: "Ajuy" },
    { value: "Alimodian", label: "Alimodian" },
    { value: "Anilao", label: "Anilao" },
    { value: "Badiangan", label: "Badiangan" },
    { value: "Balasan", label: "Balasan" },
    { value: "Banate", label: "Banate" },
    { value: "Barotac Nuevo", label: "Barotac Nuevo" },
    { value: "Barotac Viejo", label: "Barotac Viejo" },
    { value: "Batad", label: "Batad" },
    { value: "Bingawan", label: "Bingawan" },
    { value: "Cabatuan", label: "Cabatuan" },
    { value: "Calinog", label: "Calinog" },
    { value: "Carles", label: "Carles" },
    { value: "Concepcion", label: "Concepcion" },
    { value: "Dingle", label: "Dingle" },
    { value: "Dueñas", label: "Dueñas" },
    { value: "Dumangas", label: "Dumangas" },
    { value: "Estancia", label: "Estancia" },
    { value: "Guimbal", label: "Guimbal" },
    { value: "Igbaras", label: "Igbaras" },
    { value: "Janiuay", label: "Janiuay" },
    { value: "Lambunao", label: "Lambunao" },
    { value: "Leganes", label: "Leganes" },
    { value: "Lemery", label: "Lemery" },
    { value: "Leon", label: "Leon" },
    { value: "Maasin", label: "Maasin" },
    { value: "Miagao", label: "Miagao" },
    { value: "Mina", label: "Mina" },
    { value: "New Lucena", label: "New Lucena" },
    { value: "Oton", label: "Oton" },
    { value: "Pavia", label: "Pavia" },
    { value: "Pototan", label: "Pototan" },
    { value: "San Dionisio", label: "San Dionisio" },
    { value: "San Enrique", label: "San Enrique" },
    { value: "San Joaquin", label: "San Joaquin" },
    { value: "San Miguel", label: "San Miguel" },
    { value: "San Rafael", label: "San Rafael" },
    { value: "Santa Barbara", label: "Santa Barbara" },
    { value: "Sara", label: "Sara" },
    { value: "Tigbauan", label: "Tigbauan" },
    { value: "Tubungan", label: "Tubungan" },
    { value: "Zarraga", label: "Zarraga" }
  ],
  // Negros Island Region (NIR) - 19 Cities, 44 Municipalities
  NIR: [
    // Cities
    { value: "Bacolod", label: "Bacolod" },
    { value: "Bago", label: "Bago" },
    { value: "Bais", label: "Bais" },
    { value: "Bayawan", label: "Bayawan" },
    { value: "Cadiz", label: "Cadiz" },
    { value: "Canlaon", label: "Canlaon" },
    { value: "Dumaguete", label: "Dumaguete" },
    { value: "Escalante", label: "Escalante" },
    { value: "Guihulngan", label: "Guihulngan" },
    { value: "Himamaylan", label: "Himamaylan" },
    { value: "Kabankalan", label: "Kabankalan" },
    { value: "La Carlota", label: "La Carlota" },
    { value: "San Carlos (Negros Occidental)", label: "San Carlos (Negros Occidental)" },
    { value: "Silay", label: "Silay" },
    { value: "Sipalay", label: "Sipalay" },
    { value: "Talisay (Negros Occidental)", label: "Talisay (Negros Occidental)" },
    { value: "Tanjay", label: "Tanjay" },
    { value: "Victorias", label: "Victorias" },
    // Negros Occidental - 12 Municipalities + 12 Cities (Bacolod, Bago, Cadiz, Escalante, Himamaylan, Kabankalan, La Carlota, San Carlos, Silay, Sipalay, Talisay, Victorias already listed)
    { value: "Calatrava", label: "Calatrava" },
    { value: "Candoni", label: "Candoni" },
    { value: "Cauayan", label: "Cauayan" },
    { value: "Don Salvador Benedicto", label: "Don Salvador Benedicto" },
    { value: "Enrique B. Magalona", label: "Enrique B. Magalona" },
    { value: "Hinigaran", label: "Hinigaran" },
    { value: "Hinoba-an", label: "Hinoba-an" },
    { value: "Ilog", label: "Ilog" },
    { value: "Isabela", label: "Isabela" },
    { value: "La Castellana", label: "La Castellana" },
    { value: "Manapla", label: "Manapla" },
    { value: "Moises Padilla", label: "Moises Padilla" },
    { value: "Murcia", label: "Murcia" },
    { value: "Pontevedra", label: "Pontevedra" },
    { value: "Pulupandan", label: "Pulupandan" },
    { value: "San Enrique", label: "San Enrique" },
    { value: "Toboso", label: "Toboso" },
    { value: "Valladolid", label: "Valladolid" },
    // Negros Oriental - 19 Municipalities + 6 Cities (Bais, Bayawan, Canlaon, Dumaguete, Guihulngan, Tanjay already listed)
    { value: "Amlan", label: "Amlan" },
    { value: "Ayungon", label: "Ayungon" },
    { value: "Bacong", label: "Bacong" },
    { value: "Basay", label: "Basay" },
    { value: "Bindoy", label: "Bindoy" },
    { value: "Dauin", label: "Dauin" },
    { value: "Jimalalud", label: "Jimalalud" },
    { value: "La Libertad", label: "La Libertad" },
    { value: "Mabinay", label: "Mabinay" },
    { value: "Manjuyod", label: "Manjuyod" },
    { value: "Pamplona", label: "Pamplona" },
    { value: "San Jose", label: "San Jose" },
    { value: "Santa Catalina", label: "Santa Catalina" },
    { value: "Siaton", label: "Siaton" },
    { value: "Sibulan", label: "Sibulan" },
    { value: "Tayasan", label: "Tayasan" },
    { value: "Valencia", label: "Valencia" },
    { value: "Vallehermoso", label: "Vallehermoso" },
    { value: "Zamboanguita", label: "Zamboanguita" }
  ],
  // Region VII - Central Visayas (10 Cities, 91 Municipalities)
  VII: [
    // Cities
    { value: "Bogo", label: "Bogo" },
    { value: "Carcar", label: "Carcar" },
    { value: "Cebu City", label: "Cebu City" },
    { value: "Danao", label: "Danao" },
    { value: "Lapu-Lapu", label: "Lapu-Lapu" },
    { value: "Mandaue", label: "Mandaue" },
    { value: "Naga (Cebu)", label: "Naga (Cebu)" },
    { value: "Talisay (Cebu)", label: "Talisay (Cebu)" },
    { value: "Toledo", label: "Toledo" },
    { value: "Tagbilaran", label: "Tagbilaran" },
    // Bohol - 47 Municipalities + 1 City (Tagbilaran already listed)
    { value: "Alburquerque", label: "Alburquerque" },
    { value: "Alicia", label: "Alicia" },
    { value: "Anda", label: "Anda" },
    { value: "Antequera", label: "Antequera" },
    { value: "Baclayon", label: "Baclayon" },
    { value: "Balilihan", label: "Balilihan" },
    { value: "Batuan", label: "Batuan" },
    { value: "Bien Unido", label: "Bien Unido" },
    { value: "Bilar", label: "Bilar" },
    { value: "Buenavista", label: "Buenavista" },
    { value: "Calape", label: "Calape" },
    { value: "Candijay", label: "Candijay" },
    { value: "Carmen", label: "Carmen" },
    { value: "Catigbian", label: "Catigbian" },
    { value: "Clarin", label: "Clarin" },
    { value: "Corella", label: "Corella" },
    { value: "Cortes", label: "Cortes" },
    { value: "Dagohoy", label: "Dagohoy" },
    { value: "Danao", label: "Danao" },
    { value: "Dauis", label: "Dauis" },
    { value: "Dimiao", label: "Dimiao" },
    { value: "Duero", label: "Duero" },
    { value: "Garcia Hernandez", label: "Garcia Hernandez" },
    { value: "Guindulman", label: "Guindulman" },
    { value: "Inabanga", label: "Inabanga" },
    { value: "Jagna", label: "Jagna" },
    { value: "Jetafe", label: "Jetafe" },
    { value: "Lila", label: "Lila" },
    { value: "Loay", label: "Loay" },
    { value: "Loboc", label: "Loboc" },
    { value: "Loon", label: "Loon" },
    { value: "Mabini", label: "Mabini" },
    { value: "Maribojoc", label: "Maribojoc" },
    { value: "Panglao", label: "Panglao" },
    { value: "Pilar", label: "Pilar" },
    { value: "President Carlos P. Garcia", label: "President Carlos P. Garcia" },
    { value: "Sagbayan", label: "Sagbayan" },
    { value: "San Isidro", label: "San Isidro" },
    { value: "San Miguel", label: "San Miguel" },
    { value: "San Vicente", label: "San Vicente" },
    { value: "Sevilla", label: "Sevilla" },
    { value: "Sierra Bullones", label: "Sierra Bullones" },
    { value: "Sikatuna", label: "Sikatuna" },
    { value: "Talibon", label: "Talibon" },
    { value: "Trinidad", label: "Trinidad" },
    { value: "Tubigon", label: "Tubigon" },
    { value: "Ubay", label: "Ubay" },
    { value: "Valencia", label: "Valencia" },
    // Cebu - 44 Municipalities + 9 Cities (Bogo, Carcar, Cebu City, Danao, Lapu-Lapu, Mandaue, Naga, Talisay, Toledo already listed)
    { value: "Alcantara", label: "Alcantara" },
    { value: "Alcoy", label: "Alcoy" },
    { value: "Alegria", label: "Alegria" },
    { value: "Aloguinsan", label: "Aloguinsan" },
    { value: "Argao", label: "Argao" },
    { value: "Asturias", label: "Asturias" },
    { value: "Badian", label: "Badian" },
    { value: "Balamban", label: "Balamban" },
    { value: "Bantayan", label: "Bantayan" },
    { value: "Barili", label: "Barili" },
    { value: "Boljoon", label: "Boljoon" },
    { value: "Borbon", label: "Borbon" },
    { value: "Carmen", label: "Carmen" },
    { value: "Catmon", label: "Catmon" },
    { value: "Compostela", label: "Compostela" },
    { value: "Consolacion", label: "Consolacion" },
    { value: "Cordova", label: "Cordova" },
    { value: "Daanbantayan", label: "Daanbantayan" },
    { value: "Dalaguete", label: "Dalaguete" },
    { value: "Dumanjug", label: "Dumanjug" },
    { value: "Ginatilan", label: "Ginatilan" },
    { value: "Liloan", label: "Liloan" },
    { value: "Madridejos", label: "Madridejos" },
    { value: "Malabuyoc", label: "Malabuyoc" },
    { value: "Medellin", label: "Medellin" },
    { value: "Minglanilla", label: "Minglanilla" },
    { value: "Moalboal", label: "Moalboal" },
    { value: "Oslob", label: "Oslob" },
    { value: "Pilar", label: "Pilar" },
    { value: "Pinamungajan", label: "Pinamungajan" },
    { value: "Poro", label: "Poro" },
    { value: "Ronda", label: "Ronda" },
    { value: "Samboan", label: "Samboan" },
    { value: "San Fernando", label: "San Fernando" },
    { value: "San Francisco", label: "San Francisco" },
    { value: "San Remigio", label: "San Remigio" },
    { value: "Santa Fe", label: "Santa Fe" },
    { value: "Santander", label: "Santander" },
    { value: "Sibonga", label: "Sibonga" },
    { value: "Sogod", label: "Sogod" },
    { value: "Tabogon", label: "Tabogon" },
    { value: "Tabuelan", label: "Tabuelan" },
    { value: "Tuburan", label: "Tuburan" },
    { value: "Tudela", label: "Tudela" }
  ],
  // Region VIII - Eastern Visayas (7 Cities, 136 Municipalities)
  VIII: [
    // Cities
    { value: "Baybay", label: "Baybay" },
    { value: "Borongan", label: "Borongan" },
    { value: "Catbalogan", label: "Catbalogan" },
    { value: "Maasin", label: "Maasin" },
    { value: "Ormoc", label: "Ormoc" },
    { value: "Tacloban", label: "Tacloban" },
    { value: "Calbayog", label: "Calbayog" },
    // Biliran - 8 Municipalities
    { value: "Almeria", label: "Almeria" },
    { value: "Biliran", label: "Biliran" },
    { value: "Cabucgayan", label: "Cabucgayan" },
    { value: "Caibiran", label: "Caibiran" },
    { value: "Culaba", label: "Culaba" },
    { value: "Kawayan", label: "Kawayan" },
    { value: "Maripipi", label: "Maripipi" },
    { value: "Naval", label: "Naval" },
    // Eastern Samar - 22 Municipalities + 1 City (Borongan already listed)
    { value: "Arteche", label: "Arteche" },
    { value: "Balangiga", label: "Balangiga" },
    { value: "Balangkayan", label: "Balangkayan" },
    { value: "Can-avid", label: "Can-avid" },
    { value: "Dolores", label: "Dolores" },
    { value: "General MacArthur", label: "General MacArthur" },
    { value: "Giporlos", label: "Giporlos" },
    { value: "Guiuan", label: "Guiuan" },
    { value: "Hernani", label: "Hernani" },
    { value: "Jipapad", label: "Jipapad" },
    { value: "Lawaan", label: "Lawaan" },
    { value: "Llorente", label: "Llorente" },
    { value: "Maslog", label: "Maslog" },
    { value: "Maydolong", label: "Maydolong" },
    { value: "Mercedes", label: "Mercedes" },
    { value: "Oras", label: "Oras" },
    { value: "Quinapondan", label: "Quinapondan" },
    { value: "Salcedo", label: "Salcedo" },
    { value: "San Julian", label: "San Julian" },
    { value: "San Policarpo", label: "San Policarpo" },
    { value: "Sulat", label: "Sulat" },
    { value: "Taft", label: "Taft" },
    // Leyte - 40 Municipalities + 3 Cities (Baybay, Ormoc, Tacloban already listed)
    { value: "Abuyog", label: "Abuyog" },
    { value: "Alangalang", label: "Alangalang" },
    { value: "Albuera", label: "Albuera" },
    { value: "Babatngon", label: "Babatngon" },
    { value: "Barugo", label: "Barugo" },
    { value: "Bato", label: "Bato" },
    { value: "Burauen", label: "Burauen" },
    { value: "Calubian", label: "Calubian" },
    { value: "Capoocan", label: "Capoocan" },
    { value: "Carigara", label: "Carigara" },
    { value: "Dagami", label: "Dagami" },
    { value: "Dulag", label: "Dulag" },
    { value: "Hilongos", label: "Hilongos" },
    { value: "Hindang", label: "Hindang" },
    { value: "Inopacan", label: "Inopacan" },
    { value: "Isabel", label: "Isabel" },
    { value: "Jaro", label: "Jaro" },
    { value: "Javier", label: "Javier" },
    { value: "Julita", label: "Julita" },
    { value: "Kananga", label: "Kananga" },
    { value: "La Paz", label: "La Paz" },
    { value: "Leyte", label: "Leyte" },
    { value: "MacArthur", label: "MacArthur" },
    { value: "Mahaplag", label: "Mahaplag" },
    { value: "Matag-ob", label: "Matag-ob" },
    { value: "Matalom", label: "Matalom" },
    { value: "Mayorga", label: "Mayorga" },
    { value: "Merida", label: "Merida" },
    { value: "Palo", label: "Palo" },
    { value: "Palompon", label: "Palompon" },
    { value: "Pastrana", label: "Pastrana" },
    { value: "San Isidro", label: "San Isidro" },
    { value: "San Miguel", label: "San Miguel" },
    { value: "Santa Fe", label: "Santa Fe" },
    { value: "Tabango", label: "Tabango" },
    { value: "Tabontabon", label: "Tabontabon" },
    { value: "Tanauan", label: "Tanauan" },
    { value: "Tolosa", label: "Tolosa" },
    { value: "Tunga", label: "Tunga" },
    { value: "Villaba", label: "Villaba" },
    // Northern Samar - 24 Municipalities
    { value: "Allen", label: "Allen" },
    { value: "Biri", label: "Biri" },
    { value: "Bobon", label: "Bobon" },
    { value: "Capul", label: "Capul" },
    { value: "Catarman", label: "Catarman" },
    { value: "Catubig", label: "Catubig" },
    { value: "Gamay", label: "Gamay" },
    { value: "Laoang", label: "Laoang" },
    { value: "Lapinig", label: "Lapinig" },
    { value: "Las Navas", label: "Las Navas" },
    { value: "Lavezares", label: "Lavezares" },
    { value: "Lope de Vega", label: "Lope de Vega" },
    { value: "Mapanas", label: "Mapanas" },
    { value: "Mondragon", label: "Mondragon" },
    { value: "Palapag", label: "Palapag" },
    { value: "Pambujan", label: "Pambujan" },
    { value: "Rosario", label: "Rosario" },
    { value: "San Antonio", label: "San Antonio" },
    { value: "San Isidro", label: "San Isidro" },
    { value: "San Jose", label: "San Jose" },
    { value: "San Roque", label: "San Roque" },
    { value: "San Vicente", label: "San Vicente" },
    { value: "Silvino Lobos", label: "Silvino Lobos" },
    { value: "Victoria", label: "Victoria" },
    // Samar (Western Samar) - 24 Municipalities + 2 Cities (Catbalogan, Calbayog already listed)
    { value: "Almagro", label: "Almagro" },
    { value: "Basey", label: "Basey" },
    { value: "Calbiga", label: "Calbiga" },
    { value: "Daram", label: "Daram" },
    { value: "Gandara", label: "Gandara" },
    { value: "Hinabangan", label: "Hinabangan" },
    { value: "Jiabong", label: "Jiabong" },
    { value: "Marabut", label: "Marabut" },
    { value: "Matuguinao", label: "Matuguinao" },
    { value: "Motiong", label: "Motiong" },
    { value: "Pagsanghan", label: "Pagsanghan" },
    { value: "Paranas", label: "Paranas" },
    { value: "Pinabacdao", label: "Pinabacdao" },
    { value: "San Jorge", label: "San Jorge" },
    { value: "San Jose de Buan", label: "San Jose de Buan" },
    { value: "San Sebastian", label: "San Sebastian" },
    { value: "Santa Margarita", label: "Santa Margarita" },
    { value: "Santa Rita", label: "Santa Rita" },
    { value: "Santo Niño", label: "Santo Niño" },
    { value: "Tagapul-an", label: "Tagapul-an" },
    { value: "Talalora", label: "Talalora" },
    { value: "Tarangnan", label: "Tarangnan" },
    { value: "Villareal", label: "Villareal" },
    { value: "Zumarraga", label: "Zumarraga" },
    // Southern Leyte - 18 Municipalities + 1 City (Maasin already listed)
    { value: "Anahawan", label: "Anahawan" },
    { value: "Bontoc", label: "Bontoc" },
    { value: "Hinunangan", label: "Hinunangan" },
    { value: "Hinundayan", label: "Hinundayan" },
    { value: "Libagon", label: "Libagon" },
    { value: "Liloan", label: "Liloan" },
    { value: "Limasawa", label: "Limasawa" },
    { value: "Macrohon", label: "Macrohon" },
    { value: "Malitbog", label: "Malitbog" },
    { value: "Padre Burgos", label: "Padre Burgos" },
    { value: "Pintuyan", label: "Pintuyan" },
    { value: "Saint Bernard", label: "Saint Bernard" },
    { value: "San Francisco", label: "San Francisco" },
    { value: "San Juan", label: "San Juan" },
    { value: "San Ricardo", label: "San Ricardo" },
    { value: "Silago", label: "Silago" },
    { value: "Sogod", label: "Sogod" },
    { value: "Tomas Oppus", label: "Tomas Oppus" }
  ],
  // Region IX - Zamboanga Peninsula (5 Cities, 86 Municipalities)
  IX: [
    // Cities
    { value: "Dapitan", label: "Dapitan" },
    { value: "Dipolog", label: "Dipolog" },
    { value: "Isabela (Basilan)", label: "Isabela (Basilan)" },
    { value: "Pagadian", label: "Pagadian" },
    { value: "Zamboanga City", label: "Zamboanga City" },
    // Basilan - 11 Municipalities + 2 Cities (Isabela, Lamitan already listed - but Lamitan is in BARMM)
    { value: "Akbar", label: "Akbar" },
    { value: "Al-Barka", label: "Al-Barka" },
    { value: "Hadji Mohammad Ajul", label: "Hadji Mohammad Ajul" },
    { value: "Hadji Muhtamad", label: "Hadji Muhtamad" },
    { value: "Lamitan", label: "Lamitan" },
    { value: "Lantawan", label: "Lantawan" },
    { value: "Maluso", label: "Maluso" },
    { value: "Sumisip", label: "Sumisip" },
    { value: "Tabuan-Lasa", label: "Tabuan-Lasa" },
    { value: "Tipo-Tipo", label: "Tipo-Tipo" },
    { value: "Tuburan", label: "Tuburan" },
    { value: "Ungkaya Pukan", label: "Ungkaya Pukan" },
    // Zamboanga del Norte - 25 Municipalities + 2 Cities (Dapitan, Dipolog already listed)
    { value: "Baliguian", label: "Baliguian" },
    { value: "Godod", label: "Godod" },
    { value: "Gutalac", label: "Gutalac" },
    { value: "Jose Dalman", label: "Jose Dalman" },
    { value: "Kalawit", label: "Kalawit" },
    { value: "Katipunan", label: "Katipunan" },
    { value: "La Libertad", label: "La Libertad" },
    { value: "Labason", label: "Labason" },
    { value: "Liloy", label: "Liloy" },
    { value: "Manukan", label: "Manukan" },
    { value: "Mutia", label: "Mutia" },
    { value: "Piñan", label: "Piñan" },
    { value: "Polanco", label: "Polanco" },
    { value: "Pres. Manuel A. Roxas", label: "Pres. Manuel A. Roxas" },
    { value: "Rizal", label: "Rizal" },
    { value: "Salug", label: "Salug" },
    { value: "Sergio Osmeña Sr.", label: "Sergio Osmeña Sr." },
    { value: "Siayan", label: "Siayan" },
    { value: "Sibuco", label: "Sibuco" },
    { value: "Sibutad", label: "Sibutad" },
    { value: "Sindangan", label: "Sindangan" },
    { value: "Siocon", label: "Siocon" },
    { value: "Sirawai", label: "Sirawai" },
    { value: "Tampilisan", label: "Tampilisan" },
    // Zamboanga del Sur - 26 Municipalities + 1 City (Pagadian already listed)
    { value: "Aurora", label: "Aurora" },
    { value: "Bayog", label: "Bayog" },
    { value: "Dimataling", label: "Dimataling" },
    { value: "Dinas", label: "Dinas" },
    { value: "Dumalinao", label: "Dumalinao" },
    { value: "Dumingag", label: "Dumingag" },
    { value: "Guipos", label: "Guipos" },
    { value: "Josefina", label: "Josefina" },
    { value: "Kumalarang", label: "Kumalarang" },
    { value: "Labangan", label: "Labangan" },
    { value: "Lakewood", label: "Lakewood" },
    { value: "Lapuyan", label: "Lapuyan" },
    { value: "Mahayag", label: "Mahayag" },
    { value: "Margosatubig", label: "Margosatubig" },
    { value: "Midsalip", label: "Midsalip" },
    { value: "Molave", label: "Molave" },
    { value: "Pitogo", label: "Pitogo" },
    { value: "Ramon Magsaysay", label: "Ramon Magsaysay" },
    { value: "San Miguel", label: "San Miguel" },
    { value: "San Pablo", label: "San Pablo" },
    { value: "Sominot", label: "Sominot" },
    { value: "Tabina", label: "Tabina" },
    { value: "Tambulig", label: "Tambulig" },
    { value: "Tigbao", label: "Tigbao" },
    { value: "Tukuran", label: "Tukuran" },
    { value: "Vincenzo A. Sagun", label: "Vincenzo A. Sagun" },
    // Zamboanga Sibugay - 16 Municipalities
    { value: "Alicia", label: "Alicia" },
    { value: "Buug", label: "Buug" },
    { value: "Diplahan", label: "Diplahan" },
    { value: "Imelda", label: "Imelda" },
    { value: "Ipil", label: "Ipil" },
    { value: "Kabasalan", label: "Kabasalan" },
    { value: "Mabuhay", label: "Mabuhay" },
    { value: "Malangas", label: "Malangas" },
    { value: "Naga", label: "Naga" },
    { value: "Olutanga", label: "Olutanga" },
    { value: "Payao", label: "Payao" },
    { value: "Roseller Lim", label: "Roseller Lim" },
    { value: "Siay", label: "Siay" },
    { value: "Talusan", label: "Talusan" },
    { value: "Titay", label: "Titay" },
    { value: "Tungawan", label: "Tungawan" }
  ],
  // Region X - Northern Mindanao (9 Cities, 84 Municipalities)
  X: [
    // Cities
    { value: "Cagayan de Oro", label: "Cagayan de Oro" },
    { value: "El Salvador", label: "El Salvador" },
    { value: "Gingoog", label: "Gingoog" },
    { value: "Iligan", label: "Iligan" },
    { value: "Malaybalay", label: "Malaybalay" },
    { value: "Oroquieta", label: "Oroquieta" },
    { value: "Ozamiz", label: "Ozamiz" },
    { value: "Tangub", label: "Tangub" },
    { value: "Valencia", label: "Valencia" },
    // Bukidnon - 20 Municipalities + 2 Cities (Malaybalay, Valencia already listed)
    { value: "Baungon", label: "Baungon" },
    { value: "Cabanglasan", label: "Cabanglasan" },
    { value: "Damulog", label: "Damulog" },
    { value: "Dangcagan", label: "Dangcagan" },
    { value: "Don Carlos", label: "Don Carlos" },
    { value: "Impasug-ong", label: "Impasug-ong" },
    { value: "Kadingilan", label: "Kadingilan" },
    { value: "Kalilangan", label: "Kalilangan" },
    { value: "Kibawe", label: "Kibawe" },
    { value: "Kitaotao", label: "Kitaotao" },
    { value: "Lantapan", label: "Lantapan" },
    { value: "Libona", label: "Libona" },
    { value: "Malitbog", label: "Malitbog" },
    { value: "Manolo Fortich", label: "Manolo Fortich" },
    { value: "Maramag", label: "Maramag" },
    { value: "Pangantucan", label: "Pangantucan" },
    { value: "Quezon", label: "Quezon" },
    { value: "San Fernando", label: "San Fernando" },
    { value: "Sumilao", label: "Sumilao" },
    { value: "Talakag", label: "Talakag" },
    // Camiguin - 5 Municipalities
    { value: "Catarman", label: "Catarman" },
    { value: "Guinsiliban", label: "Guinsiliban" },
    { value: "Mahinog", label: "Mahinog" },
    { value: "Mambajao", label: "Mambajao" },
    { value: "Sagay", label: "Sagay" },
    // Lanao del Norte - 22 Municipalities + 1 City (Iligan already listed)
    { value: "Bacolod", label: "Bacolod" },
    { value: "Baloi", label: "Baloi" },
    { value: "Baroy", label: "Baroy" },
    { value: "Kapatagan", label: "Kapatagan" },
    { value: "Kauswagan", label: "Kauswagan" },
    { value: "Kolambugan", label: "Kolambugan" },
    { value: "Lala", label: "Lala" },
    { value: "Linamon", label: "Linamon" },
    { value: "Magsaysay", label: "Magsaysay" },
    { value: "Maigo", label: "Maigo" },
    { value: "Matungao", label: "Matungao" },
    { value: "Munai", label: "Munai" },
    { value: "Nunungan", label: "Nunungan" },
    { value: "Pantao Ragat", label: "Pantao Ragat" },
    { value: "Pantar", label: "Pantar" },
    { value: "Poona Piagapo", label: "Poona Piagapo" },
    { value: "Salvador", label: "Salvador" },
    { value: "Sapad", label: "Sapad" },
    { value: "Sultan Naga Dimaporo", label: "Sultan Naga Dimaporo" },
    { value: "Tagoloan", label: "Tagoloan" },
    { value: "Tangcal", label: "Tangcal" },
    { value: "Tubod", label: "Tubod" },
    // Misamis Occidental - 14 Municipalities + 3 Cities (Oroquieta, Ozamiz, Tangub already listed)
    { value: "Aloran", label: "Aloran" },
    { value: "Baliangao", label: "Baliangao" },
    { value: "Bonifacio", label: "Bonifacio" },
    { value: "Calamba", label: "Calamba" },
    { value: "Clarin", label: "Clarin" },
    { value: "Concepcion", label: "Concepcion" },
    { value: "Don Victoriano Chiongbian", label: "Don Victoriano Chiongbian" },
    { value: "Jimenez", label: "Jimenez" },
    { value: "Lopez Jaena", label: "Lopez Jaena" },
    { value: "Panaon", label: "Panaon" },
    { value: "Plaridel", label: "Plaridel" },
    { value: "Sapang Dalaga", label: "Sapang Dalaga" },
    { value: "Sinacaban", label: "Sinacaban" },
    { value: "Tudela", label: "Tudela" },
    // Misamis Oriental - 23 Municipalities + 3 Cities (Cagayan de Oro, El Salvador, Gingoog already listed)
    { value: "Alubijid", label: "Alubijid" },
    { value: "Balingasag", label: "Balingasag" },
    { value: "Balingoan", label: "Balingoan" },
    { value: "Binuangan", label: "Binuangan" },
    { value: "Claveria", label: "Claveria" },
    { value: "Gitagum", label: "Gitagum" },
    { value: "Initao", label: "Initao" },
    { value: "Jasaan", label: "Jasaan" },
    { value: "Kinoguitan", label: "Kinoguitan" },
    { value: "Lagonglong", label: "Lagonglong" },
    { value: "Laguindingan", label: "Laguindingan" },
    { value: "Libertad", label: "Libertad" },
    { value: "Lugait", label: "Lugait" },
    { value: "Magsaysay", label: "Magsaysay" },
    { value: "Manticao", label: "Manticao" },
    { value: "Medina", label: "Medina" },
    { value: "Naawan", label: "Naawan" },
    { value: "Opol", label: "Opol" },
    { value: "Salay", label: "Salay" },
    { value: "Sugbongcogon", label: "Sugbongcogon" },
    { value: "Tagoloan", label: "Tagoloan" },
    { value: "Talisayan", label: "Talisayan" },
    { value: "Villanueva", label: "Villanueva" }
  ],
  // Region XI - Davao Region (6 Cities, 43 Municipalities)
  XI: [
    // Cities
    { value: "Davao City", label: "Davao City" },
    { value: "Digos", label: "Digos" },
    { value: "Mati", label: "Mati" },
    { value: "Panabo", label: "Panabo" },
    { value: "Samal", label: "Samal" },
    { value: "Tagum", label: "Tagum" },
    // Davao de Oro (Compostela Valley) - 11 Municipalities
    { value: "Compostela", label: "Compostela" },
    { value: "Laak", label: "Laak" },
    { value: "Mabini", label: "Mabini" },
    { value: "Maco", label: "Maco" },
    { value: "Maragusan", label: "Maragusan" },
    { value: "Mawab", label: "Mawab" },
    { value: "Monkayo", label: "Monkayo" },
    { value: "Montevista", label: "Montevista" },
    { value: "Nabunturan", label: "Nabunturan" },
    { value: "New Bataan", label: "New Bataan" },
    { value: "Pantukan", label: "Pantukan" },
    // Davao del Norte - 8 Municipalities + 3 Cities (Panabo, Samal, Tagum already listed)
    { value: "Asuncion", label: "Asuncion" },
    { value: "Braulio E. Dujali", label: "Braulio E. Dujali" },
    { value: "Carmen", label: "Carmen" },
    { value: "Kapalong", label: "Kapalong" },
    { value: "New Corella", label: "New Corella" },
    { value: "San Isidro", label: "San Isidro" },
    { value: "Santo Tomas", label: "Santo Tomas" },
    { value: "Talaingod", label: "Talaingod" },
    // Davao del Sur - 9 Municipalities + 2 Cities (Davao City, Digos already listed)
    { value: "Bansalan", label: "Bansalan" },
    { value: "Hagonoy", label: "Hagonoy" },
    { value: "Kiblawan", label: "Kiblawan" },
    { value: "Magsaysay", label: "Magsaysay" },
    { value: "Malalag", label: "Malalag" },
    { value: "Matanao", label: "Matanao" },
    { value: "Padada", label: "Padada" },
    { value: "Santa Cruz", label: "Santa Cruz" },
    { value: "Sulop", label: "Sulop" },
    // Davao Occidental - 5 Municipalities
    { value: "Don Marcelino", label: "Don Marcelino" },
    { value: "Jose Abad Santos", label: "Jose Abad Santos" },
    { value: "Malita", label: "Malita" },
    { value: "Santa Maria", label: "Santa Maria" },
    { value: "Sarangani", label: "Sarangani" },
    // Davao Oriental - 10 Municipalities + 1 City (Mati already listed)
    { value: "Baganga", label: "Baganga" },
    { value: "Banaybanay", label: "Banaybanay" },
    { value: "Boston", label: "Boston" },
    { value: "Caraga", label: "Caraga" },
    { value: "Cateel", label: "Cateel" },
    { value: "Governor Generoso", label: "Governor Generoso" },
    { value: "Lupon", label: "Lupon" },
    { value: "Manay", label: "Manay" },
    { value: "San Isidro", label: "San Isidro" },
    { value: "Tarragona", label: "Tarragona" }
  ],
  // Region XII - SOCCSKSARGEN (4 Cities, 45 Municipalities)
  XII: [
    // Cities
    { value: "General Santos", label: "General Santos" },
    { value: "Kidapawan", label: "Kidapawan" },
    { value: "Koronadal", label: "Koronadal" },
    { value: "Tacurong", label: "Tacurong" },
    // Cotabato (North Cotabato) - 17 Municipalities + 1 City (Kidapawan already listed)
    { value: "Alamada", label: "Alamada" },
    { value: "Aleosan", label: "Aleosan" },
    { value: "Antipas", label: "Antipas" },
    { value: "Arakan", label: "Arakan" },
    { value: "Banisilan", label: "Banisilan" },
    { value: "Carmen", label: "Carmen" },
    { value: "Kabacan", label: "Kabacan" },
    { value: "Libungan", label: "Libungan" },
    { value: "Magpet", label: "Magpet" },
    { value: "Makilala", label: "Makilala" },
    { value: "Matalam", label: "Matalam" },
    { value: "Midsayap", label: "Midsayap" },
    { value: "M'lang", label: "M'lang" },
    { value: "Pigcawayan", label: "Pigcawayan" },
    { value: "Pikit", label: "Pikit" },
    { value: "President Roxas", label: "President Roxas" },
    { value: "Tulunan", label: "Tulunan" },
    // Sarangani - 7 Municipalities
    { value: "Alabel", label: "Alabel" },
    { value: "Glan", label: "Glan" },
    { value: "Kiamba", label: "Kiamba" },
    { value: "Maasim", label: "Maasim" },
    { value: "Maitum", label: "Maitum" },
    { value: "Malapatan", label: "Malapatan" },
    { value: "Malungon", label: "Malungon" },
    // South Cotabato - 10 Municipalities + 2 Cities (General Santos, Koronadal already listed)
    { value: "Banga", label: "Banga" },
    { value: "Lake Sebu", label: "Lake Sebu" },
    { value: "Norala", label: "Norala" },
    { value: "Polomolok", label: "Polomolok" },
    { value: "Santo Niño", label: "Santo Niño" },
    { value: "Surallah", label: "Surallah" },
    { value: "Tampakan", label: "Tampakan" },
    { value: "Tantangan", label: "Tantangan" },
    { value: "T'boli", label: "T'boli" },
    { value: "Tupi", label: "Tupi" },
    // Sultan Kudarat - 11 Municipalities + 1 City (Tacurong already listed)
    { value: "Bagumbayan", label: "Bagumbayan" },
    { value: "Columbio", label: "Columbio" },
    { value: "Esperanza", label: "Esperanza" },
    { value: "Isulan", label: "Isulan" },
    { value: "Kalamansig", label: "Kalamansig" },
    { value: "Lambayong", label: "Lambayong" },
    { value: "Lebak", label: "Lebak" },
    { value: "Lutayan", label: "Lutayan" },
    { value: "Palimbang", label: "Palimbang" },
    { value: "President Quirino", label: "President Quirino" },
    { value: "Senator Ninoy Aquino", label: "Senator Ninoy Aquino" }
  ],
  // Region XIII - Caraga (6 Cities, 67 Municipalities)
  XIII: [
    // Cities
    { value: "Bislig", label: "Bislig" },
    { value: "Butuan", label: "Butuan" },
    { value: "Cabadbaran", label: "Cabadbaran" },
    { value: "Surigao City", label: "Surigao City" },
    { value: "Tandag", label: "Tandag" },
    { value: "Bayugan", label: "Bayugan" },
    // Agusan del Norte - 10 Municipalities + 2 Cities (Butuan, Cabadbaran already listed)
    { value: "Buenavista", label: "Buenavista" },
    { value: "Carmen", label: "Carmen" },
    { value: "Jabonga", label: "Jabonga" },
    { value: "Kitcharao", label: "Kitcharao" },
    { value: "Las Nieves", label: "Las Nieves" },
    { value: "Magallanes", label: "Magallanes" },
    { value: "Nasipit", label: "Nasipit" },
    { value: "Remedios T. Romualdez", label: "Remedios T. Romualdez" },
    { value: "Santiago", label: "Santiago" },
    { value: "Tubay", label: "Tubay" },
    // Agusan del Sur - 13 Municipalities + 1 City (Bayugan already listed)
    { value: "Bunawan", label: "Bunawan" },
    { value: "Esperanza", label: "Esperanza" },
    { value: "La Paz", label: "La Paz" },
    { value: "Loreto", label: "Loreto" },
    { value: "Prosperidad", label: "Prosperidad" },
    { value: "Rosario", label: "Rosario" },
    { value: "San Francisco", label: "San Francisco" },
    { value: "San Luis", label: "San Luis" },
    { value: "Santa Josefa", label: "Santa Josefa" },
    { value: "Sibagat", label: "Sibagat" },
    { value: "Talacogon", label: "Talacogon" },
    { value: "Trento", label: "Trento" },
    { value: "Veruela", label: "Veruela" },
    // Dinagat Islands - 7 Municipalities
    { value: "Basilisa", label: "Basilisa" },
    { value: "Cagdianao", label: "Cagdianao" },
    { value: "Dinagat", label: "Dinagat" },
    { value: "Libjo", label: "Libjo" },
    { value: "Loreto", label: "Loreto" },
    { value: "San Jose", label: "San Jose" },
    { value: "Tubajon", label: "Tubajon" },
    // Surigao del Norte - 20 Municipalities + 1 City (Surigao City already listed)
    { value: "Alegria", label: "Alegria" },
    { value: "Bacuag", label: "Bacuag" },
    { value: "Burgos", label: "Burgos" },
    { value: "Claver", label: "Claver" },
    { value: "Dapa", label: "Dapa" },
    { value: "Del Carmen", label: "Del Carmen" },
    { value: "General Luna", label: "General Luna" },
    { value: "Gigaquit", label: "Gigaquit" },
    { value: "Mainit", label: "Mainit" },
    { value: "Malimono", label: "Malimono" },
    { value: "Pilar", label: "Pilar" },
    { value: "Placer", label: "Placer" },
    { value: "San Benito", label: "San Benito" },
    { value: "San Francisco", label: "San Francisco" },
    { value: "San Isidro", label: "San Isidro" },
    { value: "Santa Monica", label: "Santa Monica" },
    { value: "Sison", label: "Sison" },
    { value: "Socorro", label: "Socorro" },
    { value: "Tagana-an", label: "Tagana-an" },
    { value: "Tubod", label: "Tubod" },
    // Surigao del Sur - 17 Municipalities + 2 Cities (Bislig, Tandag already listed)
    { value: "Barobo", label: "Barobo" },
    { value: "Bayabas", label: "Bayabas" },
    { value: "Cagwait", label: "Cagwait" },
    { value: "Cantilan", label: "Cantilan" },
    { value: "Carmen", label: "Carmen" },
    { value: "Carrascal", label: "Carrascal" },
    { value: "Cortes", label: "Cortes" },
    { value: "Hinatuan", label: "Hinatuan" },
    { value: "Lanuza", label: "Lanuza" },
    { value: "Lianga", label: "Lianga" },
    { value: "Lingig", label: "Lingig" },
    { value: "Madrid", label: "Madrid" },
    { value: "Marihatag", label: "Marihatag" },
    { value: "San Agustin", label: "San Agustin" },
    { value: "San Miguel", label: "San Miguel" },
    { value: "Tagbina", label: "Tagbina" },
    { value: "Tago", label: "Tago" }
  ],
  // BARMM (3 Cities, 105 Municipalities)
  BARMM: [
    // Cities
    { value: "Cotabato City", label: "Cotabato City" },
    { value: "Lamitan", label: "Lamitan" },
    { value: "Marawi", label: "Marawi" },
    // Basilan - 11 Municipalities + 1 City (Lamitan already listed)
    { value: "Akbar", label: "Akbar" },
    { value: "Al-Barka", label: "Al-Barka" },
    { value: "Hadji Mohammad Ajul", label: "Hadji Mohammad Ajul" },
    { value: "Hadji Muhtamad", label: "Hadji Muhtamad" },
    { value: "Lantawan", label: "Lantawan" },
    { value: "Maluso", label: "Maluso" },
    { value: "Sumisip", label: "Sumisip" },
    { value: "Tabuan-Lasa", label: "Tabuan-Lasa" },
    { value: "Tipo-Tipo", label: "Tipo-Tipo" },
    { value: "Tuburan", label: "Tuburan" },
    { value: "Ungkaya Pukan", label: "Ungkaya Pukan" },
    // Lanao del Sur - 39 Municipalities + 1 City (Marawi already listed)
    { value: "Amai Manabilang", label: "Amai Manabilang" },
    { value: "Bacolod-Kalawi", label: "Bacolod-Kalawi" },
    { value: "Balabagan", label: "Balabagan" },
    { value: "Balindong", label: "Balindong" },
    { value: "Bayang", label: "Bayang" },
    { value: "Binidayan", label: "Binidayan" },
    { value: "Buadiposo-Buntong", label: "Buadiposo-Buntong" },
    { value: "Bubong", label: "Bubong" },
    { value: "Butig", label: "Butig" },
    { value: "Calanogas", label: "Calanogas" },
    { value: "Ditsaan-Ramain", label: "Ditsaan-Ramain" },
    { value: "Ganassi", label: "Ganassi" },
    { value: "Kapai", label: "Kapai" },
    { value: "Kapatagan", label: "Kapatagan" },
    { value: "Lumba-Bayabao", label: "Lumba-Bayabao" },
    { value: "Lumbaca-Unayan", label: "Lumbaca-Unayan" },
    { value: "Lumbatan", label: "Lumbatan" },
    { value: "Lumbayanague", label: "Lumbayanague" },
    { value: "Madalum", label: "Madalum" },
    { value: "Madamba", label: "Madamba" },
    { value: "Maguing", label: "Maguing" },
    { value: "Malabang", label: "Malabang" },
    { value: "Marantao", label: "Marantao" },
    { value: "Marogong", label: "Marogong" },
    { value: "Masiu", label: "Masiu" },
    { value: "Mulondo", label: "Mulondo" },
    { value: "Pagayawan", label: "Pagayawan" },
    { value: "Piagapo", label: "Piagapo" },
    { value: "Picong", label: "Picong" },
    { value: "Poona Bayabao", label: "Poona Bayabao" },
    { value: "Pualas", label: "Pualas" },
    { value: "Saguiaran", label: "Saguiaran" },
    { value: "Sultan Dumalondong", label: "Sultan Dumalondong" },
    { value: "Tagoloan II", label: "Tagoloan II" },
    { value: "Tamparan", label: "Tamparan" },
    { value: "Taraka", label: "Taraka" },
    { value: "Tubaran", label: "Tubaran" },
    { value: "Tugaya", label: "Tugaya" },
    { value: "Wao", label: "Wao" },
    // Maguindanao del Norte - 12 Municipalities
    { value: "Barira", label: "Barira" },
    { value: "Buldon", label: "Buldon" },
    { value: "Datu Blah T. Sinsuat", label: "Datu Blah T. Sinsuat" },
    { value: "Datu Odin Sinsuat", label: "Datu Odin Sinsuat" },
    { value: "Kabuntalan", label: "Kabuntalan" },
    { value: "Matanog", label: "Matanog" },
    { value: "Northern Kabuntalan", label: "Northern Kabuntalan" },
    { value: "Parang", label: "Parang" },
    { value: "Sultan Kudarat", label: "Sultan Kudarat" },
    { value: "Sultan Mastura", label: "Sultan Mastura" },
    { value: "Talitay", label: "Talitay" },
    { value: "Upi", label: "Upi" },
    // Maguindanao del Sur - 24 Municipalities
    { value: "Ampatuan", label: "Ampatuan" },
    { value: "Buluan", label: "Buluan" },
    { value: "Datu Abdullah Sangki", label: "Datu Abdullah Sangki" },
    { value: "Datu Anggal Midtimbang", label: "Datu Anggal Midtimbang" },
    { value: "Datu Hoffer Ampatuan", label: "Datu Hoffer Ampatuan" },
    { value: "Datu Montawal", label: "Datu Montawal" },
    { value: "Datu Paglas", label: "Datu Paglas" },
    { value: "Datu Piang", label: "Datu Piang" },
    { value: "Datu Salibo", label: "Datu Salibo" },
    { value: "Datu Saudi-Ampatuan", label: "Datu Saudi-Ampatuan" },
    { value: "Datu Unsay", label: "Datu Unsay" },
    { value: "General Salipada K. Pendatun", label: "General Salipada K. Pendatun" },
    { value: "Guindulungan", label: "Guindulungan" },
    { value: "Mamasapano", label: "Mamasapano" },
    { value: "Pagalungan", label: "Pagalungan" },
    { value: "Paglat", label: "Paglat" },
    { value: "Pandag", label: "Pandag" },
    { value: "Rajah Buayan", label: "Rajah Buayan" },
    { value: "Shariff Aguak", label: "Shariff Aguak" },
    { value: "Shariff Saydona Mustapha", label: "Shariff Saydona Mustapha" },
    { value: "South Upi", label: "South Upi" },
    { value: "Sultan sa Barongis", label: "Sultan sa Barongis" },
    { value: "Talayan", label: "Talayan" },
    // Sulu - 19 Municipalities
    { value: "Banguingui", label: "Banguingui" },
    { value: "Hadji Panglima Tahil", label: "Hadji Panglima Tahil" },
    { value: "Indanan", label: "Indanan" },
    { value: "Jolo", label: "Jolo" },
    { value: "Kalingalan Caluang", label: "Kalingalan Caluang" },
    { value: "Lugus", label: "Lugus" },
    { value: "Luuk", label: "Luuk" },
    { value: "Maimbung", label: "Maimbung" },
    { value: "Old Panamao", label: "Old Panamao" },
    { value: "Omar", label: "Omar" },
    { value: "Pandami", label: "Pandami" },
    { value: "Panglima Estino", label: "Panglima Estino" },
    { value: "Pangutaran", label: "Pangutaran" },
    { value: "Parang", label: "Parang" },
    { value: "Pata", label: "Pata" },
    { value: "Patikul", label: "Patikul" },
    { value: "Siasi", label: "Siasi" },
    { value: "Talipao", label: "Talipao" },
    { value: "Tapul", label: "Tapul" },
    // Tawi-Tawi - 11 Municipalities
    { value: "Bongao", label: "Bongao" },
    { value: "Languyan", label: "Languyan" },
    { value: "Mapun", label: "Mapun" },
    { value: "Panglima Sugala", label: "Panglima Sugala" },
    { value: "Sapa-Sapa", label: "Sapa-Sapa" },
    { value: "Sibutu", label: "Sibutu" },
    { value: "Simunul", label: "Simunul" },
    { value: "Sitangkai", label: "Sitangkai" },
    { value: "South Ubian", label: "South Ubian" },
    { value: "Tandubas", label: "Tandubas" },
    { value: "Turtle Islands", label: "Turtle Islands" }
  ]
};

// Helper function to get cities for a region
const getCitiesForRegion = (regionCode) => {
  if (!regionCode || !CITIES_BY_REGION[regionCode]) {
    return [];
  }
  return [...CITIES_BY_REGION[regionCode]].sort((a, b) => 
    a.label.localeCompare(b.label)
  );
};

const formatPhilippineNumber = (value) => {
  let cleaned = value.replace(/\D/g, '');
  if (cleaned.length > 11) {
    cleaned = cleaned.slice(0, 11);
  }
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

const validatePhilippineNumber = (phoneNumber) => {
  let cleaned = phoneNumber.replace(/\D/g, '');
  if (!cleaned) {
    return { isValid: false, normalizedNumber: '', error: 'Phone number is required' };
  }
  if (cleaned.length < 7) {
    return { isValid: false, normalizedNumber: cleaned, error: 'Phone number must have at least 7 digits' };
  }
  if (cleaned.length > 11) {
    return { isValid: false, normalizedNumber: cleaned.slice(0, 11), error: 'Phone number cannot exceed 11 digits' };
  }
  return { isValid: true, normalizedNumber: cleaned, error: '' };
};

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

  useEffect(() => {
    fetchActiveEvent();
  }, []);

  const fetchActiveEvent = async () => {
    try {
      const res = await axios.get("https://deltaplus-visitors-login-backend-5efd.onrender.com/events/active");
      setActiveEvent(res.data);
    } catch (err) {
      console.error("Error fetching active event:", err);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  useEffect(() => {
    slides.forEach(slide => {
      const img = new Image();
      img.src = slide.image;
    });
  }, []);

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
      await axios.post("https://deltaplus-visitors-login-backend-5efd.onrender.com/register", formData);
      
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
