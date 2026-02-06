// C:\Users\HP\reminder\src\app\new-event\page.js
'use client';

import ClientLayout from '@/components/ClientLayout';
import { useState, useEffect, useRef, useCallback, memo } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, parse, isToday, isTomorrow, isPast } from 'date-fns';
import { 
  ChevronDown, 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  Video, 
  Edit2, 
  Archive, 
  X, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Info,
  Plus,
  Bell
} from 'lucide-react';
import './new-event.css';

// Toast Component - Memoized to prevent re-renders
const Toast = memo(({ toasts, removeToast }) => {
  if (toasts.length === 0) return null;
  
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast toast-${toast.type}`}
        >
          <div className="toast-icon">
            {toast.type === 'success' && <CheckCircle2 className="icon" />}
            {toast.type === 'error' && <XCircle className="icon" />}
            {toast.type === 'warning' && <AlertCircle className="icon" />}
            {toast.type === 'info' && <Info className="icon" />}
          </div>
          <div className="toast-content">
            {toast.title && <div className="toast-title">{toast.title}</div>}
            <div className="toast-message">{toast.message}</div>
          </div>
          <button onClick={() => removeToast(toast.id)} className="toast-close">
            <X className="icon-sm" />
          </button>
          <div className="toast-progress" />
        </div>
      ))}
    </div>
  );
});

Toast.displayName = 'Toast';

// Custom Hook for Toast - Optimized
const useToast = () => {
  const [toasts, setToasts] = useState([]);
  const toastTimeouts = useRef({});

  const removeToast = useCallback((id) => {
    if (toastTimeouts.current[id]) {
      clearTimeout(toastTimeouts.current[id]);
      delete toastTimeouts.current[id];
    }
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const addToast = useCallback((type, message, title = null, duration = 4000) => {
    const id = Date.now() + Math.random();
    
    setToasts(prev => [...prev, { id, type, message, title }]);
    
    toastTimeouts.current[id] = setTimeout(() => {
      removeToast(id);
    }, duration);
    
    return id;
  }, [removeToast]);

  const success = useCallback((message, title = null) => addToast('success', message, title), [addToast]);
  const error = useCallback((message, title = null) => addToast('error', message, title), [addToast]);
  const warning = useCallback((message, title = null) => addToast('warning', message, title), [addToast]);
  const info = useCallback((message, title = null) => addToast('info', message, title), [addToast]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      Object.values(toastTimeouts.current).forEach(clearTimeout);
    };
  }, []);

  return { toasts, removeToast, success, error, warning, info };
};

// Mobile Tab Navigation Component - Memoized
const MobileTabNav = memo(({ activeTab, setActiveTab, eventCount }) => {
  const tabs = [
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'form', label: 'New Event', icon: Plus },
    { id: 'reminders', label: 'Reminders', icon: Bell, badge: eventCount },
  ];

  return (
    <div className="mobile-tab-nav">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`mobile-tab ${activeTab === tab.id ? 'active' : ''}`}
          type="button"
        >
          <tab.icon className="tab-icon" />
          <span className="tab-label">{tab.label}</span>
          {tab.badge > 0 && <span className="tab-badge">{tab.badge}</span>}
        </button>
      ))}
    </div>
  );
});

MobileTabNav.displayName = 'MobileTabNav';

// Main Component
export default function EventDashboard() {
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    meetingType: '',
    phoneNumber: '',
    meetLink: '',
    address: '',
    hour: '01',
    minute: '00',
    period: 'AM'
  });
  
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showMeetingOptions, setShowMeetingOptions] = useState(false);
  const [activeTab, setActiveTab] = useState('form');
  const [isMobile, setIsMobile] = useState(false);

  const dropdownRef = useRef(null);
  const toast = useToast();

  const hours = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

  const meetingTypes = [
    { id: 'phone', label: 'Phone Call', icon: '📞', description: 'Phone number for the call' },
    { id: 'google_meet', label: 'Google Meet', icon: '🎥', description: 'Google Meet link' },
    { id: 'location', label: 'Location', icon: '📍', description: 'Physical address or location' },
  ];

  // Handle form input changes - FIXED: Using functional update
  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch events on mount
  useEffect(() => {
    fetchEvents();
  }, []);

  // Handle click outside dropdown
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowMeetingOptions(false);
      }
    }
    if (showMeetingOptions) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMeetingOptions]);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/reminders');
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = useCallback(() => {
    setFormData({
      title: '',
      subject: '',
      meetingType: '',
      phoneNumber: '',
      meetLink: '',
      address: '',
      hour: '01',
      minute: '00',
      period: 'AM'
    });
    setSelectedDate(new Date());
    setEditingId(null);
    setShowMeetingOptions(false);
  }, []);

  const handleMeetingTypeSelect = useCallback((type) => {
    setFormData(prev => ({
      ...prev,
      meetingType: type,
      phoneNumber: type !== 'phone' ? '' : prev.phoneNumber,
      meetLink: type !== 'google_meet' ? '' : prev.meetLink,
      address: type !== 'location' ? '' : prev.address
    }));
    setShowMeetingOptions(false);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const { title, meetingType, phoneNumber, meetLink, address, hour, minute, period, subject } = formData;
    
    if (!title.trim()) {
      toast.warning('Please enter an event title', 'Validation');
      return;
    }
    
    if (!meetingType) {
      toast.warning('Please select a meeting type', 'Validation');
      return;
    }
    
    if (meetingType === 'phone' && !phoneNumber.trim()) {
      toast.warning('Please enter a phone number', 'Validation');
      return;
    }
    if (meetingType === 'google_meet' && !meetLink.trim()) {
      toast.warning('Please enter a Google Meet link', 'Validation');
      return;
    }
    if (meetingType === 'location' && !address.trim()) {
      toast.warning('Please enter a location address', 'Validation');
      return;
    }

    const dateTimeStr = `${format(selectedDate, 'yyyy-MM-dd')} ${hour}:${minute} ${period}`;
    const dateTime = parse(dateTimeStr, 'yyyy-MM-dd hh:mm a', new Date());

    const details =
      meetingType === 'phone'
        ? { type: meetingType, phoneNumber }
        : meetingType === 'google_meet'
        ? { type: meetingType, meetLink }
        : { type: meetingType, address };

    const eventData = {
      title,
      subject,
      dateTime: dateTime.toISOString(),
      meetingDetails: details,
      completed: false,
    };

    try {
      setIsLoading(true);
      
      const isEditing = editingId && editingId !== 'undefined' && editingId !== 'null';
      const url = isEditing ? `/api/reminders/${editingId}` : '/api/reminders';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        body: JSON.stringify(eventData),
        headers: { 'Content-Type': 'application/json' },
      });

      const responseData = await res.json();

      if (res.ok) {
        await fetchEvents();
        resetForm();
        toast.success(
          isEditing ? 'Event updated successfully!' : 'Event created successfully!', 
          isEditing ? 'Updated' : 'Created'
        );
        if (isMobile) {
          setActiveTab('reminders');
        }
      } else {
        throw new Error(responseData.error || 'Failed to save event');
      }
    } catch (error) {
      console.error('Failed to save event:', error);
      toast.error(`Failed to save event: ${error.message}`, 'Error');
    } finally {
      setIsLoading(false);
    }
  };

  const startEdit = useCallback((event) => {
    const eventId = event._id?.toString() || event.id;
    
    setEditingId(eventId);
    setSelectedDate(new Date(event.dateTime));
    
    const eventDate = new Date(event.dateTime);
    let eventHour = eventDate.getHours();
    const eventMinute = eventDate.getMinutes();
    const eventPeriod = eventHour >= 12 ? 'PM' : 'AM';
    
    if (eventHour === 0) {
      eventHour = 12;
    } else if (eventHour > 12) {
      eventHour = eventHour - 12;
    }
    
    setFormData({
      title: event.title || '',
      subject: event.subject || '',
      meetingType: event.meetingDetails?.type || '',
      phoneNumber: event.meetingDetails?.phoneNumber || '',
      meetLink: event.meetingDetails?.meetLink || '',
      address: event.meetingDetails?.address || '',
      hour: eventHour.toString().padStart(2, '0'),
      minute: eventMinute.toString().padStart(2, '0'),
      period: eventPeriod
    });
    
    if (isMobile) {
      setActiveTab('form');
    }
  }, [isMobile]);

  const deleteEvent = async (id) => {
    try {
      setIsLoading(true);
      
      const response = await fetch(`/api/reminders/${id}`, { 
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to archive event');
      }
      
      setEvents(prevEvents => prevEvents.filter(event => {
        const eventId = event._id?.toString() || event.id;
        return eventId !== id;
      }));
      
      toast.success('Event archived successfully!', 'Archived');
      
    } catch (error) {
      console.error('Archive failed:', error);
      toast.error(`Failed to archive event: ${error.message}`, 'Error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = useCallback((date) => {
    setSelectedDate(date);
  }, []);

  // Computed values
  const activeEvents = events.filter((e) => {
    const eventDateTime = new Date(e.dateTime);
    return !e.completed && !isPast(eventDateTime);
  });

  const upcomingEvents = activeEvents
    .slice()
    .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));

  const getMeetingIcon = (type) => {
    switch (type) {
      case 'phone': return <Phone className="icon-sm" />;
      case 'google_meet': return <Video className="icon-sm" />;
      case 'location': return <MapPin className="icon-sm" />;
      default: return <Calendar className="icon-sm" />;
    }
  };

  const getMeetingTypeColor = (type) => {
    switch (type) {
      case 'phone': return 'badge-blue';
      case 'google_meet': return 'badge-purple';
      case 'location': return 'badge-green';
      default: return 'badge-gray';
    }
  };

  const getTimeLabel = (dateTime) => {
    const date = new Date(dateTime);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM dd');
  };

  return (
    <ClientLayout>
      <Toast toasts={toast.toasts} removeToast={toast.removeToast} />
      
      <div className="dashboard-container">
        <div className="dashboard-content">
          {/* Header */}
          <header className="dashboard-header">
            <div className="header-left">
              <h1>Event Management Dashboard</h1>
              <p>Manage your calendar, create events, and track reminders</p>
            </div>
            <div className="header-stats">
              <div className="stat-card stat-today">
                <div className="stat-label">Today&apos;s Date</div>
                <div className="stat-value">{format(new Date(), 'MMM dd, yyyy')}</div>
              </div>
              <div className="stat-card stat-active">
                <div className="stat-label">Active Events</div>
                <div className="stat-value">{activeEvents.length}</div>
              </div>
            </div>
          </header>

          {/* Mobile Tab Navigation */}
          {isMobile && (
            <MobileTabNav 
              activeTab={activeTab} 
              setActiveTab={setActiveTab}
              eventCount={activeEvents.length}
            />
          )}

          {/* Main Content Grid */}
          <div className={`dashboard-grid ${isMobile ? 'mobile' : ''}`}>
            
            {/* Calendar Section */}
            {(!isMobile || activeTab === 'calendar') && (
              <div className="dashboard-card calendar-card">
                <div className="card-header calendar-header">
                  <div className="header-icon calendar-icon-bg">
                    <span>📅</span>
                  </div>
                  <div className="header-text">
                    <h2>Calendar</h2>
                    <p>Select event date</p>
                  </div>
                </div>
                <div className="card-body calendar-body">
                  <div className="calendar-wrapper">
                    <DatePicker
                      selected={selectedDate}
                      onChange={handleDateChange}
                      inline
                      minDate={new Date()}
                    />
                  </div>
                  <div className="selected-date-display">
                    <div className="date-label">Selected Date</div>
                    <div className="date-day">{format(selectedDate, 'dd')}</div>
                    <div className="date-weekday">{format(selectedDate, 'EEEE')}</div>
                    <div className="date-month">{format(selectedDate, 'MMMM yyyy')}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Form Section */}
            {(!isMobile || activeTab === 'form') && (
              <div className="dashboard-card form-card">
                <div className="card-header form-header">
                  <div className="header-icon form-icon-bg">
                    <span>{editingId ? '✏️' : '➕'}</span>
                  </div>
                  <div className="header-text">
                    <h2>{editingId ? 'Edit Event' : 'New Event'}</h2>
                    <p>{editingId ? 'Update event details' : 'Create a new event'}</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="event-form">
                  {/* Event Title */}
                  <div className="form-group">
                    <label htmlFor="event-title">Event Title *</label>
                    <input
                      id="event-title"
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Enter event title"
                      autoComplete="off"
                    />
                  </div>

                  {/* Subject */}
                  <div className="form-group">
                    <label htmlFor="event-subject">Subject / Description</label>
                    <textarea
                      id="event-subject"
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      placeholder="Enter event description or details"
                      rows={3}
                      autoComplete="off"
                    />
                  </div>

                  {/* Time Selection */}
                  <div className="time-selection">
                    <div className="form-group">
                      <label htmlFor="event-hour">Hour</label>
                      <select 
                        id="event-hour"
                        value={formData.hour} 
                        onChange={(e) => handleInputChange('hour', e.target.value)}
                      >
                        {hours.map((h) => (
                          <option key={h} value={h}>{parseInt(h)}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="event-minute">Minute</label>
                      <select 
                        id="event-minute"
                        value={formData.minute} 
                        onChange={(e) => handleInputChange('minute', e.target.value)}
                      >
                        {minutes.map((m) => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="event-period">AM/PM</label>
                      <select 
                        id="event-period"
                        value={formData.period} 
                        onChange={(e) => handleInputChange('period', e.target.value)}
                      >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                    </div>
                  </div>

                  {/* Selected Time Display */}
                  <div className="time-display">
                    <Clock className="icon-sm" />
                    <span>Selected Time:</span>
                    <strong>{parseInt(formData.hour)}:{formData.minute} {formData.period}</strong>
                  </div>

                  {/* Meeting Type Dropdown */}
                  <div className="form-group meeting-type-group" ref={dropdownRef}>
                    <label>Meeting Type *</label>
                    <div
                      onClick={() => setShowMeetingOptions(!showMeetingOptions)}
                      className="meeting-type-selector"
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          setShowMeetingOptions(!showMeetingOptions);
                        }
                      }}
                    >
                      <div className="selector-content">
                        {formData.meetingType ? (
                          <>
                            <span className="meeting-emoji">
                              {meetingTypes.find((m) => m.id === formData.meetingType)?.icon}
                            </span>
                            <span>{meetingTypes.find((m) => m.id === formData.meetingType)?.label}</span>
                          </>
                        ) : (
                          <span className="placeholder">Click to select meeting type</span>
                        )}
                      </div>
                      <ChevronDown className={`chevron ${showMeetingOptions ? 'rotate' : ''}`} />
                    </div>

                    {showMeetingOptions && (
                      <div className="meeting-options-dropdown">
                        <div className="dropdown-header">
                          <span>Select Meeting Type</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowMeetingOptions(false);
                            }}
                          >
                            <X className="icon-sm" />
                          </button>
                        </div>
                        
                        <div className="dropdown-options">
                          {meetingTypes.map((type) => (
                            <div
                              key={type.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMeetingTypeSelect(type.id);
                              }}
                              className={`meeting-option ${formData.meetingType === type.id ? 'selected' : ''}`}
                              role="button"
                              tabIndex={0}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  handleMeetingTypeSelect(type.id);
                                }
                              }}
                            >
                              <div className={`option-icon ${type.id}-bg`}>
                                {type.icon}
                              </div>
                              <div className="option-content">
                                <div className="option-label">{type.label}</div>
                                <div className="option-desc">{type.description}</div>
                              </div>
                              {formData.meetingType === type.id && (
                                <CheckCircle2 className="check-icon" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Dynamic Meeting Details Input */}
                  {formData.meetingType && (
                    <div className={`meeting-details ${formData.meetingType}-details`}>
                      <div className="details-header">
                        <div className={`details-icon ${formData.meetingType}-bg`}>
                          {meetingTypes.find((m) => m.id === formData.meetingType)?.icon}
                        </div>
                        <div>
                          <div className="details-title">
                            {meetingTypes.find((m) => m.id === formData.meetingType)?.label} Details
                          </div>
                          <div className="details-desc">
                            {meetingTypes.find((m) => m.id === formData.meetingType)?.description}
                          </div>
                        </div>
                      </div>

                      {formData.meetingType === 'phone' && (
                        <div className="form-group">
                          <label htmlFor="phone-number">Phone Number *</label>
                          <input
                            id="phone-number"
                            type="tel"
                            value={formData.phoneNumber}
                            onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                            placeholder="+91 98765 43210"
                            autoComplete="tel"
                          />
                          <span className="input-hint">Include country code (e.g., +1, +44, +91)</span>
                        </div>
                      )}

                      {formData.meetingType === 'google_meet' && (
                        <div className="form-group">
                          <label htmlFor="meet-link">Google Meet Link *</label>
                          <input
                            id="meet-link"
                            type="url"
                            value={formData.meetLink}
                            onChange={(e) => handleInputChange('meetLink', e.target.value)}
                            placeholder="https://meet.google.com/xxx-xxxx-xxx"
                            autoComplete="url"
                          />
                          <span className="input-hint">Full Google Meet URL or meeting code</span>
                        </div>
                      )}

                      {formData.meetingType === 'location' && (
                        <div className="form-group">
                          <label htmlFor="location-address">Location / Address *</label>
                          <input
                            id="location-address"
                            type="text"
                            value={formData.address}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            placeholder="Enter full address or location details"
                            autoComplete="street-address"
                          />
                          <span className="input-hint">Include building, floor, room number if applicable</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Submit Buttons */}
                  <div className="form-actions">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="btn-primary"
                    >
                      {isLoading ? (
                        <>
                          <div className="spinner" />
                          Processing...
                        </>
                      ) : editingId ? (
                        '🔄 Update Event'
                      ) : (
                        '➕ Create Event'
                      )}
                    </button>

                    {editingId && (
                      <button
                        type="button"
                        onClick={() => {
                          resetForm();
                          toast.info('Edit cancelled', 'Cancelled');
                        }}
                        className="btn-secondary"
                      >
                        ❌ Cancel Edit
                      </button>
                    )}
                  </div>
                </form>
              </div>
            )}

            {/* Reminders Section */}
            {(!isMobile || activeTab === 'reminders') && (
              <div className="dashboard-card reminders-card">
                <div className="card-header reminders-header">
                  <div className="header-icon reminders-icon-bg">
                    <span>⏰</span>
                  </div>
                  <div className="header-text">
                    <h2>Active Reminders</h2>
                    <p>Upcoming events ({activeEvents.length})</p>
                  </div>
                </div>

                <div className="card-body reminders-body">
                  {isLoading ? (
                    <div className="loading-state">
                      <div className="spinner-large" />
                    </div>
                  ) : upcomingEvents.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-icon">
                        <Calendar className="icon-large" />
                      </div>
                      <h3>No Active Reminders</h3>
                      <p>Create your first event to see it appear here</p>
                    </div>
                  ) : (
                    <div className="events-list">
                      {upcomingEvents.map((event) => {
                        const eventId = event._id?.toString() || event.id;
                        const dateTime = new Date(event.dateTime);
                        
                        return (
                          <div key={eventId} className="event-card">
                            <div className="event-header">
                              <div className="event-info">
                                <h3>{event.title}</h3>
                                {event.subject && <p>{event.subject}</p>}
                              </div>
                              <div className="event-actions">
                                <button
                                  type="button"
                                  onClick={() => startEdit(event)}
                                  className="btn-icon btn-edit"
                                  title="Edit event"
                                >
                                  <Edit2 className="icon-sm" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (confirm('Are you sure you want to archive this event?')) {
                                      deleteEvent(eventId);
                                    }
                                  }}
                                  className="btn-icon btn-delete"
                                  title="Archive event"
                                >
                                  <Archive className="icon-sm" />
                                </button>
                              </div>
                            </div>

                            <div className="event-badges">
                              <div className={`badge ${getMeetingTypeColor(event.meetingDetails?.type)}`}>
                                {getMeetingIcon(event.meetingDetails?.type)}
                                <span>
                                  {meetingTypes.find(m => m.id === event.meetingDetails?.type)?.label || 'Meeting'}
                                </span>
                              </div>
                              <div className="badge badge-amber">
                                <Clock className="icon-xs" />
                                <span>{getTimeLabel(event.dateTime)} • {format(dateTime, 'h:mm a')}</span>
                              </div>
                            </div>

                            <div className="event-details-box">
                              <div className="details-label">DETAILS</div>
                              {event.meetingDetails?.type === 'phone' && (
                                <div className="detail-item">
                                  <Phone className="icon-sm text-blue" />
                                  <span>{event.meetingDetails.phoneNumber}</span>
                                </div>
                              )}
                              {event.meetingDetails?.type === 'google_meet' && (
                                <a
                                  href={event.meetingDetails.meetLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="detail-item detail-link"
                                >
                                  <Video className="icon-sm" />
                                  <span>Join Google Meet</span>
                                </a>
                              )}
                              {event.meetingDetails?.type === 'location' && (
                                <div className="detail-item">
                                  <MapPin className="icon-sm text-green" />
                                  <span>{event.meetingDetails.address}</span>
                                </div>
                              )}
                            </div>

                            <div className="event-footer">
                              <span className="created-date">
                                Created: {format(new Date(event.createdAt || event.dateTime), 'MMM dd, yyyy')}
                              </span>
                              <span className={`date-badge ${isToday(dateTime) ? 'today' : 'upcoming'}`}>
                                {isToday(dateTime) ? '📌 Today' : `🗓️ ${format(dateTime, 'MMM dd')}`}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {upcomingEvents.length > 0 && (
                    <div className="events-summary">
                      <div className="summary-left">
                        <div className="summary-label">Total Active Events</div>
                        <div className="summary-value">{upcomingEvents.length}</div>
                      </div>
                      <div className="summary-right">
                        <div className="summary-label">Next Event:</div>
                        {upcomingEvents[0] && (
                          <div className="summary-next">
                            {format(new Date(upcomingEvents[0].dateTime), 'MMM dd, h:mm a')}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer Stats */}
          <div className="footer-stats">
            <div className="footer-stat stat-blue">
              <div className="footer-stat-label">Total Events</div>
              <div className="footer-stat-value">{events.length}</div>
            </div>
            <div className="footer-stat stat-green">
              <div className="footer-stat-label">Active</div>
              <div className="footer-stat-value">{activeEvents.length}</div>
            </div>
            <div className="footer-stat stat-amber">
              <div className="footer-stat-label">Today</div>
              <div className="footer-stat-value">
                {activeEvents.filter(e => isToday(new Date(e.dateTime))).length}
              </div>
            </div>
            <div className="footer-stat stat-purple">
              <div className="footer-stat-label">This Week</div>
              <div className="footer-stat-value">
                {activeEvents.filter(e => {
                  const date = new Date(e.dateTime);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const nextWeek = new Date(today);
                  nextWeek.setDate(today.getDate() + 7);
                  return date >= today && date <= nextWeek;
                }).length}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}