// src/components/ui/DateRangePicker.tsx

import React, { useState, useRef, useEffect } from "react";
import { FaCalendarAlt, FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface DateRangePickerProps {
  /** Start date value */
  startDate: Date;
  /** End date value */
  endDate: Date;
  /** Callback when start date changes */
  onStartDateChange: (date: Date) => void;
  /** Callback when end date changes */
  onEndDateChange: (date: Date) => void;
  /** Callback when apply button is clicked */
  onApply: () => void;
  /** Preset date ranges */
  presets?: { label: string; days: number }[];
  /** Date format for display */
  dateFormat?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Disabled state */
  disabled?: boolean;
}

const defaultPresets = [
  { label: "7 Hari", days: 7 },
  { label: "14 Hari", days: 14 },
  { label: "30 Hari", days: 30 },
  { label: "90 Hari", days: 90 },
];

const months = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onApply,
  presets = defaultPresets,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempStartDate, setTempStartDate] = useState(startDate);
  const [tempEndDate, setTempEndDate] = useState(endDate);
  const [selecting, setSelecting] = useState<"start" | "end">("start");
  const [currentMonth, setCurrentMonth] = useState(startDate.getMonth());
  const [currentYear, setCurrentYear] = useState(startDate.getFullYear());
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset temp dates when picker opens
  useEffect(() => {
    if (isOpen) {
      setTempStartDate(startDate);
      setTempEndDate(endDate);
      setSelecting("start");
    }
  }, [isOpen, startDate, endDate]);

  const handlePresetClick = (days: number) => {
    const end = new Date();
    end.setHours(0, 0, 0, 0);
    const start = new Date();
    start.setDate(start.getDate() - days);
    start.setHours(0, 0, 0, 0);

    setTempStartDate(start);
    setTempEndDate(end);
    setCurrentMonth(start.getMonth());
    setCurrentYear(start.getFullYear());

    // Auto apply for preset
    onStartDateChange(start);
    onEndDateChange(end);
    onApply();
    setIsOpen(false);
  };

  const handleApply = () => {
    onStartDateChange(tempStartDate);
    onEndDateChange(tempEndDate);
    onApply();
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempStartDate(startDate);
    setTempEndDate(endDate);
    setIsOpen(false);
  };

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const isDateInRange = (date: Date) => {
    return date >= tempStartDate && date <= tempEndDate;
  };

  const isDateStart = (date: Date) => {
    return date.toDateString() === tempStartDate.toDateString();
  };

  const isDateEnd = (date: Date) => {
    return date.toDateString() === tempEndDate.toDateString();
  };

  const handleDateClick = (date: Date) => {
    if (selecting === "start" || tempStartDate === tempEndDate) {
      // Set start date
      setTempStartDate(date);
      setTempEndDate(date);
      setSelecting("end");
    } else {
      // Set end date
      if (date < tempStartDate) {
        // If clicked date is before start date, swap them
        setTempStartDate(date);
        setTempEndDate(tempStartDate);
      } else {
        setTempEndDate(date);
      }
      setSelecting("start");
    }
  };

  const changeMonth = (delta: number) => {
    let newMonth = currentMonth + delta;
    let newYear = currentYear;

    if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    }

    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const renderCalendar = (monthOffset: number = 0) => {
    let month = currentMonth + monthOffset;
    let year = currentYear;

    if (month < 0) {
      month = 11;
      year--;
    } else if (month > 11) {
      month = 0;
      year++;
    }

    const daysInMonth = getDaysInMonth(month, year);
    const firstDay = getFirstDayOfMonth(month, year);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      date.setHours(0, 0, 0, 0);

      const isSelected = isDateInRange(date);
      const isStart = isDateStart(date);
      const isEnd = isDateEnd(date);
      const isToday = date.toDateString() === new Date().toDateString();

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(date)}
          className={`
            h-10 w-10 rounded-full text-sm transition-all duration-200
            ${isSelected && !isStart && !isEnd ? "bg-red-100 text-red-700" : ""}
            ${isStart || isEnd ? "bg-red-600 text-white hover:bg-red-700" : ""}
            ${!isSelected && !isStart && !isEnd ? "hover:bg-gray-100" : ""}
            ${isToday && !isSelected && !isStart && !isEnd ? "border border-red-300" : ""}
          `}>
          {day}
        </button>,
      );
    }

    return days;
  };

  const formatDateDisplay = (date: Date) => {
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  return (
    <div className="relative" ref={pickerRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
        <FaCalendarAlt className="w-3.5 h-3.5 text-gray-500" />
        <span>
          {formatDateDisplay(startDate)} - {formatDateDisplay(endDate)}
        </span>
      </button>

      {/* Dropdown Picker */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-[680px] bg-white rounded-xl shadow-lg border border-gray-200 z-50 animate-fadeIn">
          <div className="p-4">
            {/* Preset Buttons */}
            <div className="flex gap-2 mb-4 pb-4 border-b border-gray-100">
              {presets.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => handlePresetClick(preset.days)}
                  className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Selection Indicator */}
            <div className="flex items-center gap-4 mb-4 text-sm">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-1 rounded-md text-xs font-medium ${selecting === "start" ? "bg-red-100 text-red-700 border border-red-300" : "bg-gray-100 text-gray-600"}`}>
                  Start Date
                </span>
                <span className="text-gray-400">→</span>
                <span
                  className={`px-2 py-1 rounded-md text-xs font-medium ${selecting === "end" ? "bg-red-100 text-red-700 border border-red-300" : "bg-gray-100 text-gray-600"}`}>
                  End Date
                </span>
              </div>
              <div className="text-xs text-gray-400">
                {selecting === "start"
                  ? "Click to select start date"
                  : "Click to select end date"}
              </div>
            </div>

            {/* Calendar Grids */}
            <div className="grid grid-cols-2 gap-6">
              {/* Left Calendar */}
              <div>
                <div className="flex items-center justify-center mb-3">
                  <button
                    onClick={() => changeMonth(-1)}
                    className="absolute left-0 p-1 hover:bg-gray-100 rounded-lg transition-colors">
                    <FaChevronLeft className="w-4 h-4 text-gray-500" />
                  </button>
                  <span className="text-sm font-medium text-gray-700">
                    {months[currentMonth]} {currentYear}
                  </span>
                  <div className="w-8" />
                </div>
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                    <div
                      key={day}
                      className="h-10 flex items-center justify-center text-xs font-medium text-gray-500">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {renderCalendar(0)}
                </div>
              </div>

              {/* Right Calendar */}
              <div>
                <div className="flex items-center justify-center mb-3">
                  <div className="w-8" />
                  <span className="text-sm font-medium text-gray-700">
                    {months[(currentMonth + 1) % 12]}{" "}
                    {currentMonth === 11 ? currentYear + 1 : currentYear}
                  </span>
                  <button
                    onClick={() => changeMonth(1)}
                    className="absolute right-0 p-1 hover:bg-gray-100 rounded-lg transition-colors">
                    <FaChevronRight className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                    <div
                      key={day}
                      className="h-10 flex items-center justify-center text-xs font-medium text-gray-500">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {renderCalendar(1)}
                </div>
              </div>
            </div>

            {/* Selected Range Display */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Start Date</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDateDisplay(tempStartDate)}
                  </p>
                </div>
                <span className="text-gray-400">→</span>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">End Date</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDateDisplay(tempEndDate)}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button
                onClick={handleApply}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default DateRangePicker;
