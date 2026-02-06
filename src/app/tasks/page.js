// C:\Users\HP\reminder\src\app\tasks\page.js
'use client';

import ClientLayout from '@/components/ClientLayout';
import { useState, useEffect, useRef, useCallback } from 'react';
import { format, parse, isToday, isTomorrow } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './tasks.css';

// Icons as simple components
const Icons = {
  X: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  ),
  ChevronDown: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  ),
  Phone: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
    </svg>
  ),
  Video: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7"></polygon>
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
    </svg>
  ),
  MapPin: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
      <circle cx="12" cy="10" r="3"></circle>
    </svg>
  ),
  Clock: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  ),
  Calendar: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  ),
  CheckCircle: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  ),
  Edit3: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9"></path>
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
    </svg>
  ),
  ArrowLeft: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"></line>
      <polyline points="12 19 5 12 12 5"></polyline>
    </svg>
  ),
  AlertCircle: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
  ),
  Info: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="16" x2="12" y2="12"></line>
      <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
  ),
  CheckCircle2: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="m9 12 2 2 4-4"></path>
    </svg>
  ),
  XCircle: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="15" y1="9" x2="9" y2="15"></line>
      <line x1="9" y1="9" x2="15" y2="15"></line>
    </svg>
  ),
  Trash: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
  ),
};

// Toast Component
const Toast = ({ toasts, removeToast }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          <div className="toast-icon">
            {toast.type === 'success' && <Icons.CheckCircle2 className="icon" />}
            {toast.type === 'error' && <Icons.XCircle className="icon" />}
            {toast.type === 'warning' && <Icons.AlertCircle className="icon" />}
            {toast.type === 'info' && <Icons.Info className="icon" />}
          </div>
          <div className="toast-content">
            {toast.title && <div className="toast-title">{toast.title}</div>}
            <div className="toast-message">{toast.message}</div>
          </div>
          <button onClick={() => removeToast(toast.id)} className="toast-close">
            <Icons.X className="icon-sm" />
          </button>
        </div>
      ))}
    </div>
  );
};

// Custom Hook for Toast
const useToast = () => {
  const [toasts, setToasts] = useState([]);
  const toastTimeouts = useRef({});

  const removeToast = useCallback((id) => {
    if (toastTimeouts.current[id]) {
      clearTimeout(toastTimeouts.current[id]);
      delete toastTimeouts.current[id];
    }
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    (type, message, title = null, duration = 4000) => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, type, message, title }]);

      toastTimeouts.current[id] = setTimeout(() => {
        removeToast(id);
      }, duration);

      return id;
    },
    [removeToast]
  );

  const success = useCallback((message, title = null) => addToast('success', message, title), [addToast]);
  const error = useCallback((message, title = null) => addToast('error', message, title), [addToast]);
  const warning = useCallback((message, title = null) => addToast('warning', message, title), [addToast]);
  const info = useCallback((message, title = null) => addToast('info', message, title), [addToast]);

  useEffect(() => {
    return () => {
      Object.values(toastTimeouts.current).forEach(clearTimeout);
    };
  }, []);

  return { toasts, removeToast, success, error, warning, info };
};

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [tab, setTab] = useState('all');
  const [stats, setStats] = useState({ all: 0, pending: 0, completed: 0, upcoming: 0 });
  const [loading, setLoading] = useState(true);

  const toast = useToast();

  // Edit Mode States - consolidated into formData
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    meetingType: '',
    phoneNumber: '',
    meetLink: '',
    address: '',
    hour: '01',
    minute: '00',
    period: 'AM',
  });
  const [editSelectedDate, setEditSelectedDate] = useState(new Date());
  const [showMeetingOptions, setShowMeetingOptions] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const dropdownRef = useRef(null);

  const hours = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

  const meetingTypes = [
    { id: 'phone', label: 'Phone Call', icon: '📞', description: 'Phone number for the call' },
    { id: 'google_meet', label: 'Google Meet', icon: '🎥', description: 'Google Meet link' },
    { id: 'location', label: 'Location', icon: '📍', description: 'Physical address or location' },
  ];

  // Handle form input changes
  const handleInputChange = useCallback((field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowMeetingOptions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/reminders');
      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.status}`);
      }
      const data = await res.json();
      const activeTasks = data.filter((t) => !t.deleted);

      setTasks(activeTasks);
      setStats({
        all: activeTasks.length,
        pending: activeTasks.filter((t) => !t.completed).length,
        completed: activeTasks.filter((t) => t.completed).length,
        upcoming: activeTasks.filter((t) => !t.completed && new Date(t.dateTime) > new Date()).length,
      });
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      toast.error('Failed to load tasks', 'Error');
      setTasks([]);
      setStats({ all: 0, pending: 0, completed: 0, upcoming: 0 });
    } finally {
      setLoading(false);
    }
  };

  const filteredTasks =
    tab === 'all'
      ? tasks
      : tab === 'pending'
      ? tasks.filter((t) => !t.completed)
      : tab === 'completed'
      ? tasks.filter((t) => t.completed)
      : tasks.filter((t) => !t.completed && new Date(t.dateTime) > new Date());

  const completeTask = async (id) => {
    try {
      const response = await fetch(`/api/reminders/${id}/complete`, { method: 'PATCH' });
      if (response.ok) {
        setTasks((prevTasks) =>
          prevTasks.map((task) => {
            const taskId = task._id?.toString() || task.id;
            if (taskId === id) {
              return { ...task, completed: true };
            }
            return task;
          })
        );

        setStats((prev) => ({
          ...prev,
          pending: prev.pending - 1,
          completed: prev.completed + 1,
          upcoming: prev.upcoming > 0 ? prev.upcoming - 1 : 0,
        }));

        toast.success('Task marked as completed!', 'Success');
      } else {
        throw new Error('Failed to complete task');
      }
    } catch (error) {
      console.error('Failed to complete task:', error);
      toast.error('Failed to complete task', 'Error');
    }
  };

  const deleteTask = async (id) => {
    if (!confirm('Are you sure you want to archive this task?')) return;

    try {
      const response = await fetch(`/api/reminders/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to archive task');
      }

      setTasks((prevTasks) =>
        prevTasks.filter((task) => {
          const taskId = task._id?.toString() || task.id;
          return taskId !== id;
        })
      );

      fetchTasks();
      toast.success('Task archived successfully!', 'Archived');
    } catch (error) {
      console.error('Failed to archive task:', error);
      toast.error(`Failed to archive task: ${error.message}`, 'Error');
    }
  };

  const openEditMode = (task) => {
    const taskId = task._id?.toString() || task.id;
    setEditingTask({ ...task, id: taskId });
    setEditSelectedDate(new Date(task.dateTime));

    const eventDate = new Date(task.dateTime);
    let eventHour = eventDate.getHours();
    const eventMinute = eventDate.getMinutes();
    const eventPeriod = eventHour >= 12 ? 'PM' : 'AM';

    if (eventHour === 0) {
      eventHour = 12;
    } else if (eventHour > 12) {
      eventHour = eventHour - 12;
    }

    setFormData({
      title: task.title || '',
      subject: task.subject || '',
      meetingType: task.meetingDetails?.type || '',
      phoneNumber: task.meetingDetails?.phoneNumber || '',
      meetLink: task.meetingDetails?.meetLink || '',
      address: task.meetingDetails?.address || '',
      hour: eventHour.toString().padStart(2, '0'),
      minute: eventMinute.toString().padStart(2, '0'),
      period: eventPeriod,
    });

    setShowMeetingOptions(false);
    setIsEditMode(true);
    toast.info(`Editing: ${task.title}`, 'Edit Mode');
  };

  const closeEditMode = () => {
    setIsEditMode(false);
    setEditingTask(null);
    setFormData({
      title: '',
      subject: '',
      meetingType: '',
      phoneNumber: '',
      meetLink: '',
      address: '',
      hour: '01',
      minute: '00',
      period: 'AM',
    });
    setEditSelectedDate(new Date());
    setShowMeetingOptions(false);
  };

  const handleMeetingTypeSelect = (type) => {
    setFormData((prev) => ({
      ...prev,
      meetingType: type,
      phoneNumber: type !== 'phone' ? '' : prev.phoneNumber,
      meetLink: type !== 'google_meet' ? '' : prev.meetLink,
      address: type !== 'location' ? '' : prev.address,
    }));
    setShowMeetingOptions(false);
  };

  const toggleMeetingDropdown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMeetingOptions(!showMeetingOptions);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    const { title, subject, meetingType, phoneNumber, meetLink, address, hour, minute, period } = formData;

    if (!editSelectedDate || !title.trim() || !meetingType) {
      toast.warning('Please fill in all required fields', 'Validation Error');
      return;
    }

    if (meetingType === 'phone' && !phoneNumber.trim()) {
      toast.warning('Please enter a phone number', 'Validation Error');
      return;
    }
    if (meetingType === 'google_meet' && !meetLink.trim()) {
      toast.warning('Please enter a Google Meet link', 'Validation Error');
      return;
    }
    if (meetingType === 'location' && !address.trim()) {
      toast.warning('Please enter a location address', 'Validation Error');
      return;
    }

    const dateTimeStr = `${format(editSelectedDate, 'yyyy-MM-dd')} ${hour}:${minute} ${period}`;
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
      completed: editingTask.completed || false,
    };

    try {
      setIsUpdating(true);

      const res = await fetch(`/api/reminders/${editingTask.id}`, {
        method: 'PUT',
        body: JSON.stringify(eventData),
        headers: { 'Content-Type': 'application/json' },
      });

      const responseData = await res.json();

      if (res.ok) {
        setTasks((prevTasks) =>
          prevTasks.map((task) => {
            const taskId = task._id?.toString() || task.id;
            if (taskId === editingTask.id) {
              return {
                ...task,
                title,
                subject,
                dateTime: dateTime.toISOString(),
                meetingDetails: details,
              };
            }
            return task;
          })
        );

        closeEditMode();
        toast.success('Event updated successfully!', 'Updated');
        fetchTasks();
      } else {
        throw new Error(responseData.error || 'Failed to update event');
      }
    } catch (error) {
      console.error('Failed to update event:', error);
      toast.error(`Failed to update event: ${error.message}`, 'Error');
    } finally {
      setIsUpdating(false);
    }
  };

  const getMeetingTypeColor = (type) => {
    switch (type) {
      case 'phone':
        return 'badge-blue';
      case 'google_meet':
        return 'badge-purple';
      case 'location':
        return 'badge-green';
      default:
        return 'badge-gray';
    }
  };

  const getMeetingIcon = (type) => {
    switch (type) {
      case 'phone':
        return <Icons.Phone className="icon-sm" />;
      case 'google_meet':
        return <Icons.Video className="icon-sm" />;
      case 'location':
        return <Icons.MapPin className="icon-sm" />;
      default:
        return <Icons.Calendar className="icon-sm" />;
    }
  };

  const getTimeLabel = (dateTime) => {
    const date = new Date(dateTime);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM dd');
  };

  // Loading State
  if (loading) {
    return (
      <ClientLayout>
        <Toast toasts={toast.toasts} removeToast={toast.removeToast} />
        <div className="tasks-container">
          <div className="loading-wrapper">
            <div className="spinner-large"></div>
            <p>Loading tasks...</p>
          </div>
        </div>
      </ClientLayout>
    );
  }

  // Edit Mode View
  if (isEditMode) {
    return (
      <ClientLayout>
        <Toast toasts={toast.toasts} removeToast={toast.removeToast} />
        <div className="tasks-container">
          <div className="tasks-content">
            {/* Header */}
            <header className="edit-header">
              <div className="edit-header-left">
                <button onClick={closeEditMode} className="back-btn" type="button">
                  <Icons.ArrowLeft className="icon" />
                </button>
                <div>
                  <h1>Edit Event</h1>
                  <p>Update your event details</p>
                </div>
              </div>
              <div className="edit-header-right">
                <div className="editing-badge">
                  <span>Editing</span>
                  <strong>{editingTask?.title}</strong>
                </div>
              </div>
            </header>

            {/* Edit Grid */}
            <div className="edit-grid">
              {/* Calendar Card */}
              <div className="card calendar-card">
                <div className="card-header calendar-header">
                  <div className="header-icon">📅</div>
                  <div className="header-text">
                    <h2>Calendar</h2>
                    <p>Select event date</p>
                  </div>
                </div>
                <div className="card-body">
                  <div className="calendar-wrapper">
                    <DatePicker
                      selected={editSelectedDate}
                      onChange={(date) => setEditSelectedDate(date)}
                      inline
                      minDate={new Date()}
                    />
                  </div>
                  <div className="selected-date-display">
                    <span className="date-label">Selected Date</span>
                    <span className="date-day">{format(editSelectedDate, 'dd')}</span>
                    <span className="date-weekday">{format(editSelectedDate, 'EEEE')}</span>
                    <span className="date-month">{format(editSelectedDate, 'MMMM yyyy')}</span>
                  </div>
                </div>
              </div>

              {/* Edit Form Card */}
              <div className="card form-card">
                <div className="card-header form-header">
                  <div className="header-icon">✏️</div>
                  <div className="header-text">
                    <h2>Edit Event</h2>
                    <p>Update event details</p>
                  </div>
                </div>
                <form onSubmit={handleUpdateSubmit} className="edit-form">
                  {/* Title */}
                  <div className="form-group">
                    <label htmlFor="edit-title">Event Title *</label>
                    <input
                      id="edit-title"
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Enter event title"
                      autoComplete="off"
                    />
                  </div>

                  {/* Subject */}
                  <div className="form-group">
                    <label htmlFor="edit-subject">Subject / Description</label>
                    <textarea
                      id="edit-subject"
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      placeholder="Enter event description"
                      rows={3}
                      autoComplete="off"
                    />
                  </div>

                  {/* Time Selection */}
                  <div className="time-row">
                    <div className="form-group">
                      <label htmlFor="edit-hour">Hour</label>
                      <select
                        id="edit-hour"
                        value={formData.hour}
                        onChange={(e) => handleInputChange('hour', e.target.value)}
                      >
                        {hours.map((h) => (
                          <option key={h} value={h}>
                            {parseInt(h)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="edit-minute">Minute</label>
                      <select
                        id="edit-minute"
                        value={formData.minute}
                        onChange={(e) => handleInputChange('minute', e.target.value)}
                      >
                        {minutes.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="edit-period">AM/PM</label>
                      <select
                        id="edit-period"
                        value={formData.period}
                        onChange={(e) => handleInputChange('period', e.target.value)}
                      >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                    </div>
                  </div>

                  {/* Time Display */}
                  <div className="time-display">
                    <Icons.Clock className="icon-sm" />
                    <span>Selected Time:</span>
                    <strong>
                      {parseInt(formData.hour)}:{formData.minute} {formData.period}
                    </strong>
                  </div>

                  {/* Meeting Type */}
                  <div className="form-group meeting-group" ref={dropdownRef}>
                    <label>Meeting Type *</label>
                    <div onClick={toggleMeetingDropdown} className="meeting-selector">
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
                      <Icons.ChevronDown className={`chevron ${showMeetingOptions ? 'rotate' : ''}`} />
                    </div>

                    {showMeetingOptions && (
                      <div className="meeting-dropdown">
                        <div className="dropdown-header">
                          <span>Select Meeting Type</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowMeetingOptions(false);
                            }}
                          >
                            <Icons.X className="icon-sm" />
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
                            >
                              <div className={`option-icon ${type.id}-bg`}>{type.icon}</div>
                              <div className="option-content">
                                <div className="option-label">{type.label}</div>
                                <div className="option-desc">{type.description}</div>
                              </div>
                              {formData.meetingType === type.id && (
                                <div className="check-mark">✓</div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Meeting Details */}
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
                          <label htmlFor="edit-phone">Phone Number *</label>
                          <input
                            id="edit-phone"
                            type="tel"
                            value={formData.phoneNumber}
                            onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                            placeholder="+91 98765 43210"
                            autoComplete="tel"
                          />
                          <span className="input-hint">Include country code</span>
                        </div>
                      )}

                      {formData.meetingType === 'google_meet' && (
                        <div className="form-group">
                          <label htmlFor="edit-meet">Google Meet Link *</label>
                          <input
                            id="edit-meet"
                            type="url"
                            value={formData.meetLink}
                            onChange={(e) => handleInputChange('meetLink', e.target.value)}
                            placeholder="https://meet.google.com/xxx-xxxx-xxx"
                            autoComplete="url"
                          />
                          <span className="input-hint">Full Google Meet URL</span>
                        </div>
                      )}

                      {formData.meetingType === 'location' && (
                        <div className="form-group">
                          <label htmlFor="edit-address">Location / Address *</label>
                          <input
                            id="edit-address"
                            type="text"
                            value={formData.address}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            placeholder="Enter full address"
                            autoComplete="street-address"
                          />
                          <span className="input-hint">Include building, floor if applicable</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="form-actions">
                    <button type="submit" disabled={isUpdating} className="btn-primary">
                      {isUpdating ? (
                        <>
                          <div className="spinner"></div>
                          Updating...
                        </>
                      ) : (
                        '🔄 Update Event'
                      )}
                    </button>
                    <button type="button" onClick={closeEditMode} className="btn-secondary">
                      ❌ Cancel
                    </button>
                  </div>
                </form>
              </div>

              {/* Preview Card */}
              <div className="card preview-card">
                <div className="card-header preview-header">
                  <div className="header-icon">👁️</div>
                  <div className="header-text">
                    <h2>Event Preview</h2>
                    <p>Preview your changes</p>
                  </div>
                </div>
                <div className="card-body">
                  <div className="preview-content">
                    <h3 className="preview-title">{formData.title || 'Event Title'}</h3>
                    {formData.subject && <p className="preview-subject">{formData.subject}</p>}

                    <div className="preview-badges">
                      {formData.meetingType && (
                        <div className={`badge ${getMeetingTypeColor(formData.meetingType)}`}>
                          {getMeetingIcon(formData.meetingType)}
                          <span>{meetingTypes.find((m) => m.id === formData.meetingType)?.label}</span>
                        </div>
                      )}
                      <div className="badge badge-amber">
                        <Icons.Clock className="icon-xs" />
                        <span>
                          {getTimeLabel(editSelectedDate)} • {parseInt(formData.hour)}:{formData.minute}{' '}
                          {formData.period}
                        </span>
                      </div>
                    </div>

                    {formData.meetingType && (
                      <div className="preview-details">
                        <div className="details-label">DETAILS</div>
                        {formData.meetingType === 'phone' && formData.phoneNumber && (
                          <div className="detail-item">
                            <Icons.Phone className="icon-sm text-blue" />
                            <span>{formData.phoneNumber}</span>
                          </div>
                        )}
                        {formData.meetingType === 'google_meet' && formData.meetLink && (
                          <div className="detail-item text-purple">
                            <Icons.Video className="icon-sm" />
                            <span>{formData.meetLink}</span>
                          </div>
                        )}
                        {formData.meetingType === 'location' && formData.address && (
                          <div className="detail-item">
                            <Icons.MapPin className="icon-sm text-green" />
                            <span>{formData.address}</span>
                          </div>
                        )}
                        {!formData.phoneNumber && !formData.meetLink && !formData.address && (
                          <span className="placeholder-text">Enter details above...</span>
                        )}
                      </div>
                    )}

                    <div className="preview-footer">
                      <Icons.Calendar className="icon-sm" />
                      <span>{format(editSelectedDate, 'EEEE, MMMM dd, yyyy')}</span>
                    </div>
                  </div>

                  <div className="original-info">
                    <div className="original-label">ORIGINAL EVENT</div>
                    <div className="original-title">{editingTask?.title}</div>
                    <div className="original-date">
                      {editingTask?.dateTime && format(new Date(editingTask.dateTime), 'MMM dd, yyyy h:mm a')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ClientLayout>
    );
  }

  // Normal Tasks View
  return (
    <ClientLayout>
      <Toast toasts={toast.toasts} removeToast={toast.removeToast} />
      <div className="tasks-container">
        <div className="tasks-content">
          <h1 className="page-title">Tasks Dashboard</h1>

          {/* Stats Cards */}
          <div className="stats-grid">
            <div
              onClick={() => setTab('all')}
              className={`stat-card stat-all ${tab === 'all' ? 'active' : ''}`}
            >
              <h3>All Tasks</h3>
              <p>{stats.all}</p>
            </div>
            <div
              onClick={() => setTab('pending')}
              className={`stat-card stat-pending ${tab === 'pending' ? 'active' : ''}`}
            >
              <h3>Pending</h3>
              <p>{stats.pending}</p>
            </div>
            <div
              onClick={() => setTab('completed')}
              className={`stat-card stat-completed ${tab === 'completed' ? 'active' : ''}`}
            >
              <h3>Completed</h3>
              <p>{stats.completed}</p>
            </div>
            <div
              onClick={() => setTab('upcoming')}
              className={`stat-card stat-upcoming ${tab === 'upcoming' ? 'active' : ''}`}
            >
              <h3>Upcoming</h3>
              <p>{stats.upcoming}</p>
            </div>
          </div>

          {/* Tab Buttons */}
          <div className="tab-buttons">
            {['all', 'pending', 'completed', 'upcoming'].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`tab-btn ${tab === t ? 'active' : ''}`}
                type="button"
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {/* Task List */}
          <div className="task-list">
            {filteredTasks.map((task) => {
              const taskId = task._id?.toString() || task.id;
              const isOverdue = !task.completed && new Date(task.dateTime) < new Date();

              return (
                <div
                  key={taskId}
                  className={`task-card ${task.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`}
                >
                  <div className="task-header">
                    <div className="task-title-row">
                      {task.completed && <Icons.CheckCircle className="icon completed-icon" />}
                      <h3 className={task.completed ? 'line-through' : ''}>{task.title}</h3>
                    </div>
                    <span className={`status-badge ${task.completed ? 'completed' : isOverdue ? 'overdue' : 'upcoming'}`}>
                      {task.completed ? '✓ Completed' : isOverdue ? '⚠ Overdue' : '📅 Upcoming'}
                    </span>
                  </div>

                  <p className="task-subject">{task.subject || 'No subject'}</p>

                  <div className="task-datetime">
                    <Icons.Calendar className="icon-sm" />
                    <span>
                      {new Date(task.dateTime).toLocaleString('en-IN', {
                        timeZone: 'Asia/Kolkata',
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </span>
                  </div>

                  {task.meetingDetails && (
                    <div className="task-meeting-info">
                      {task.meetingDetails.type === 'phone' && task.meetingDetails.phoneNumber && (
                        <div className="meeting-item">
                          <Icons.Phone className="icon-sm text-blue" />
                          <span>{task.meetingDetails.phoneNumber}</span>
                        </div>
                      )}
                      {task.meetingDetails.type === 'google_meet' && task.meetingDetails.meetLink && (
                        <div className="meeting-item">
                          <Icons.Video className="icon-sm text-purple" />
                          <a
                            href={task.meetingDetails.meetLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {task.meetingDetails.meetLink}
                          </a>
                        </div>
                      )}
                      {task.meetingDetails.type === 'location' && task.meetingDetails.address && (
                        <div className="meeting-item">
                          <Icons.MapPin className="icon-sm text-green" />
                          <span>{task.meetingDetails.address}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="task-actions">
                    {!task.completed && (
                      <>
                        <button onClick={() => completeTask(taskId)} className="btn-complete" type="button">
                          <Icons.CheckCircle className="icon-sm" />
                          <span>Complete</span>
                        </button>
                        <button onClick={() => openEditMode(task)} className="btn-edit" type="button">
                          <Icons.Edit3 className="icon-sm" />
                          <span>Edit</span>
                        </button>
                        <button onClick={() => deleteTask(taskId)} className="btn-delete" type="button">
                          <Icons.Trash className="icon-sm" />
                          <span>Delete</span>
                        </button>
                      </>
                    )}
                    {task.completed && (
                      <div className="completed-message">
                        <Icons.CheckCircle className="icon" />
                        <span>This task has been completed</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {filteredTasks.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">{tab === 'completed' ? '🎉' : '📭'}</div>
                <h3>{tab === 'completed' ? 'No Completed Tasks Yet' : `No ${tab.charAt(0).toUpperCase() + tab.slice(1)} Tasks`}</h3>
                <p>
                  {tab === 'completed'
                    ? 'Complete some tasks to see them here!'
                    : `No ${tab} tasks yet. Create some events!`}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}