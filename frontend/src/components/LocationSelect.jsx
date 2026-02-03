import React from 'react';
import { MapPin } from 'lucide-react';

const LOCATIONS = [
    "Main Gate",
    "Nardana Railway Station",
    "Shirpur",
    "Savalde"
];

const LocationSelect = ({ value, onChange, placeholder = "Select Location" }) => {
    return (
        <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-primary-400">
                <MapPin size={20} />
            </div>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="glass-input pl-10 appearance-none cursor-pointer"
            >
                <option value="" disabled className="bg-dark-900 text-slate-400">
                    {placeholder}
                </option>
                {LOCATIONS.map((loc) => (
                    <option key={loc} value={loc} className="bg-dark-900 text-white">
                        {loc}
                    </option>
                ))}
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
            </div>
        </div>
    );
};

export default LocationSelect;
