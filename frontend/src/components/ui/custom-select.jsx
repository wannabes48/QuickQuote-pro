import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export function CustomSelect({ 
    options = [], 
    value, 
    onChange, 
    placeholder = "Select an option...", 
    className,
    required = false
}) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div className={cn("relative w-full", className)} ref={containerRef}>
            {/* Hidden input for form validation if required */}
            {required && (
                <input 
                    type="text" 
                    tabIndex={-1}
                    value={value || ''} 
                    onChange={() => {}} 
                    required={required} 
                    className="absolute opacity-0 pointer-events-none w-full h-full inset-0"
                />
            )}
            
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex items-center justify-between w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-left focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200",
                    !selectedOption && "text-gray-500",
                    isOpen && "ring-2 ring-primary/50 border-primary"
                )}
            >
                <span className="block truncate">
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                </motion.div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute z-50 w-full mt-2 bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl shadow-xl overflow-hidden"
                    >
                        <div className="max-h-60 overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                            {options.length === 0 ? (
                                <div className="px-4 py-3 text-sm text-gray-500 text-center">
                                    No options available
                                </div>
                            ) : (
                                options.map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => {
                                            onChange(option.value);
                                            setIsOpen(false);
                                        }}
                                        className={cn(
                                            "flex items-center justify-between w-full px-3 py-2.5 text-sm rounded-lg text-left transition-colors",
                                            value === option.value 
                                                ? "bg-primary/10 text-primary font-bold" 
                                                : "text-gray-700 hover:bg-gray-100/80 hover:text-gray-900"
                                        )}
                                    >
                                        <span className="block truncate">{option.label}</span>
                                        {value === option.value && (
                                            <Check className="w-4 h-4 text-primary shrink-0" />
                                        )}
                                    </button>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
