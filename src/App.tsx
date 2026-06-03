import React, { useState, useMemo } from 'react';
import {
  Layers,
  Settings,
  User,
  Search,
  MoreHorizontal,
  Paperclip,
  MessageSquare,
  Plus,
  Calendar,
  MapPin,
  ChevronRight,
  Trash2,
  CheckCircle,
  AlertTriangle,
  ChevronDown,
  Info,
  Check,
  X,
  PlusCircle,
  Activity,
  Sliders,
  Sparkles
} from 'lucide-react';
import {
  teamMembers,
  initialTasks,
  initialMeetingNotes,
  initialFollowUps
} from './data';
import { Task, TaskStatus, TaskCategory, Priority, TeamMember, MeetingNote, FollowUpItem } from './types';

export default function App() {
  // --- Global States ---
  const [activeWorkspace, setActiveWorkspace] = useState<'IoT' | 'Mobile'>('IoT');
  const [activeTab, setActiveTab] = useState<'ToDo' | 'Progress' | 'Assignment' | 'Notes'>('Progress');
  
  // App data state
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [notes, setNotes] = useState<MeetingNote[]>(initialMeetingNotes);
  const [followUps, setFollowUps] = useState<FollowUpItem[]>(initialFollowUps);
  
  // UI UX feedback states
  const [searchTasksQuery, setSearchTasksQuery] = useState('');
  const [searchNotesQuery, setSearchNotesQuery] = useState('');
  const [todoFilter, setTodoFilter] = useState<'Semua' | 'Tinggi' | 'Selesai'>('Semua');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);
  
  // Selected task detail modal
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskToEditProgress, setTaskToEditProgress] = useState<string | null>(null);

  // Drag & Drop states for IoT Kanban Board
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);

  // Settings Panel state
  const [showSettings, setShowSettings] = useState(false);
  const [accentColor, setAccentColor] = useState<'slate' | 'green' | 'violet' | 'amber'>('slate');

  // --- Dynamic Color Configurations ---
  const accentClasses = useMemo(() => {
    switch (accentColor) {
      case 'green':
        return {
          brand: 'text-emerald-700',
          bgActive: 'bg-emerald-500 text-white',
          borderActive: 'border-emerald-500',
          accentBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          accentFill: 'bg-emerald-500',
          outlineRing: 'focus:ring-emerald-500',
          circleStroke: '#10b981',
          progressBg: 'bg-emerald-500',
          badgeText: 'text-emerald-700'
        };
      case 'violet':
        return {
          brand: 'text-indigo-700',
          bgActive: 'bg-indigo-600 text-white',
          borderActive: 'border-indigo-600',
          accentBg: 'bg-indigo-100 text-indigo-800 border-indigo-200',
          accentFill: 'bg-indigo-600',
          outlineRing: 'focus:ring-indigo-600',
          circleStroke: '#4f46e5',
          progressBg: 'bg-indigo-600',
          badgeText: 'text-indigo-700'
        };
      case 'amber':
        return {
          brand: 'text-amber-700',
          bgActive: 'bg-amber-500 text-white',
          borderActive: 'border-amber-500',
          accentBg: 'bg-amber-100 text-amber-800 border-amber-200',
          accentFill: 'bg-amber-500',
          outlineRing: 'focus:ring-amber-500',
          circleStroke: '#f59e0b',
          progressBg: 'bg-amber-500',
          badgeText: 'text-amber-700'
        };
      default: // slate-blue
        return {
          brand: 'text-[#005da7]',
          bgActive: 'bg-secondary-container text-[#001c39]',
          borderActive: 'border-secondary-color',
          accentBg: 'bg-[#eff4ff] text-[#3b608f] border-[#a4c9ff]/30',
          accentFill: 'bg-[#3b608f]',
          outlineRing: 'focus:ring-[#3b608f]',
          circleStroke: '#3b608f',
          progressBg: 'bg-secondary-container',
          badgeText: 'text-secondary-color'
        };
    }
  }, [accentColor]);

  // --- Task Assignment Form States ---
  const [formTitle, setFormTitle] = useState('');
  const [formPIC, setFormPIC] = useState(teamMembers[0].id);
  const [formDeadline, setFormDeadline] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formPriority, setFormPriority] = useState<Priority>('Tinggi');
  const [formCategory, setFormCategory] = useState<TaskCategory>('Perangkat Keras');
  const [formWorkspace, setFormWorkspace] = useState<'IoT' | 'Mobile'>('IoT');

  // --- Meeting Note Form States ---
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteTag, setNoteTag] = useState('Sync');
  const [noteDescription, setNoteDescription] = useState('');
  const [noteParticipants, setNoteParticipants] = useState<string[]>([teamMembers[0].id]);

  // --- Follow Ups Inline input ---
  const [newFollowUpText, setNewFollowUpText] = useState('');

  // Trigger transient message banners
  const triggerNotification = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // --- Handler Actions ---
  const handleToggleTaskChecked = (taskId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const nextStatus: TaskStatus = task.status === 'Selesai' ? 'Belum Mulai' : 'Selesai';
        triggerNotification(
          `Tugas "${task.title}" diperbarui menjadi ${nextStatus === 'Selesai' ? 'Selesai 🎉' : 'Perlu Tindakan'}`,
          'info'
        );
        return { ...task, status: nextStatus };
      }
      return task;
    }));
  };

  const handleUpdateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        triggerNotification(`Memindahkan "${task.title}" ke status standar "${newStatus}"`);
        return { ...task, status: newStatus };
      }
      return task;
    }));
    setSelectedTask(null);
  };

  // Drag & Drop handler functions
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggingTaskId(taskId);
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, columnStatus: TaskStatus) => {
    e.preventDefault();
    if (dragOverColumn !== columnStatus) {
      setDragOverColumn(columnStatus);
    }
  };

  const handleDrop = (e: React.DragEvent, columnStatus: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || draggingTaskId;
    if (taskId) {
      const taskObj = tasks.find(t => t.id === taskId);
      if (taskObj && taskObj.workspace === 'IoT') {
        if (taskObj.status !== columnStatus) {
          handleUpdateTaskStatus(taskId, columnStatus);
        }
      }
    }
    setDraggingTaskId(null);
    setDragOverColumn(null);
  };

  const handleDragEnd = () => {
    setDraggingTaskId(null);
    setDragOverColumn(null);
  };

  const handleDeleteTask = (taskId: string) => {
    const taskToDelete = tasks.find(t => t.id === taskId);
    if (window.confirm(`Apakah Anda yakin ingin menghapus "${taskToDelete?.title}"?`)) {
      setTasks(prev => prev.filter(t => t.id !== taskId));
      triggerNotification(`Tugas "${taskToDelete?.title}" berhasil dihapus`);
      setSelectedTask(null);
    }
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      alert('Tolong masukkan judul tugas!');
      return;
    }

    const selectedPIC = teamMembers.find(t => t.id === formPIC) || teamMembers[0];
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: formTitle,
      description: formDescription || 'Deskripsi tidak tersedia.',
      status: 'Belum Mulai',
      priority: formPriority,
      category: formWorkspace === 'IoT' ? formCategory : 'Umum',
      assignedTo: selectedPIC,
      deadline: formDeadline ? `Tenggat: ${formDeadline}` : undefined,
      timeString: formDeadline ? `Hari Ini, ${formDeadline}` : 'Tidak ada tenggat yang disetel',
      workspace: formWorkspace,
      attachmentsCount: 0,
      commentsCount: 0,
      progress: formWorkspace === 'IoT' ? 0 : undefined
    };

    setTasks(prev => [newTask, ...prev]);
    triggerNotification(`Berhasil menugaskan "${formTitle}" kepada ${selectedPIC.name}!`, 'success');

    // Reset inputs
    setFormTitle('');
    setFormDescription('');
    setFormDeadline('');
    
    // Automatically bring them to preview screen based on workspace
    if (formWorkspace === 'IoT') {
      setActiveWorkspace('IoT');
      setActiveTab('Progress');
    } else {
      setActiveWorkspace('Mobile');
      setActiveTab('ToDo');
    }
  };

  const handleCreateMeetingNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim()) {
      alert('Tolong masukkan judul catatan!');
      return;
    }

    const participantsList = teamMembers.filter(t => noteParticipants.includes(t.id));
    const newNote: MeetingNote = {
      id: `note-${Date.now()}`,
      title: noteTitle,
      description: noteDescription || 'Tidak ada catatan yang terekam.',
      dateString: 'Baru saja',
      tag: noteTag,
      participants: participantsList.length ? participantsList : [teamMembers[0]],
      attachmentsCount: 0,
      workspace: activeWorkspace
    };

    setNotes(prev => [newNote, ...prev]);
    setShowNoteModal(false);
    triggerNotification(`Berhasil membuat catatan rapat: "${noteTitle}"`, 'success');

    // Clear inputs
    setNoteTitle('');
    setNoteDescription('');
    setNoteParticipants([teamMembers[0].id]);
  };

  const handleAddFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFollowUpText.trim()) return;

    const newFU: FollowUpItem = {
      id: `fu-${Date.now()}`,
      text: newFollowUpText,
      dueString: 'Tenggat: Hari Ini',
      completed: false
    };

    setFollowUps(prev => [...prev, newFU]);
    setNewFollowUpText('');
    triggerNotification(`Tindak lanjut ditambahkan: "${newFU.text}"`);
  };

  const handleToggleFollowUp = (id: string) => {
    setFollowUps(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, completed: !item.completed };
      }
      return item;
    }));
  };

  const handleUpdateTaskProgressVal = (taskId: string, progress: number) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return { ...t, progress };
      }
      return t;
    }));
  };

  // --- Calculations for To Do list (Mobile Workspace Stats) ---
  const mobileTasks = useMemo(() => {
    return tasks.filter(t => t.workspace === 'Mobile');
  }, [tasks]);

  const filteredMobileTasks = useMemo(() => {
    return mobileTasks.filter(task => {
      // Priority/Completion filter
      if (todoFilter === 'Tinggi' && task.priority !== 'Tinggi') return false;
      if (todoFilter === 'Selesai' && task.status !== 'Selesai') return false;
      
      // Search Box filter
      if (searchTasksQuery.trim() !== '') {
        const query = searchTasksQuery.toLowerCase();
        return (
          task.title.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query) ||
          task.assignedTo.name.toLowerCase().includes(query) ||
          (task.location && task.location.toLowerCase().includes(query))
        );
      }
      return true;
    });
  }, [mobileTasks, todoFilter, searchTasksQuery]);

  const statsCalculations = useMemo(() => {
    const total = mobileTasks.length;
    const completed = mobileTasks.filter(t => t.status === 'Selesai').length;
    const pending = total - completed;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, pending, percent };
  }, [mobileTasks]);

  // --- Calculations for Progress Tracker (IoT Workspace Kanban) ---
  const iotTasksFiltered = useMemo(() => {
    return tasks.filter(t => {
      if (t.workspace !== 'IoT') return false;
      if (searchTasksQuery.trim() !== '') {
        const query = searchTasksQuery.toLowerCase();
        return (
          t.title.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query) ||
          t.category.toLowerCase().includes(query) ||
          t.assignedTo.name.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [tasks, searchTasksQuery]);

  const columnTasks = useMemo(() => {
    return {
      'Belum Mulai': iotTasksFiltered.filter(t => t.status === 'Belum Mulai'),
      'Sedang Berjalan': iotTasksFiltered.filter(t => t.status === 'Sedang Berjalan'),
      'Pemeriksaan Akhir': iotTasksFiltered.filter(t => t.status === 'Pemeriksaan Akhir')
    };
  }, [iotTasksFiltered]);

  // --- Calculations for Meeting Notes ---
  const filteredNotes = useMemo(() => {
    return notes.filter(n => {
      if (n.workspace !== activeWorkspace) return false;
      if (searchNotesQuery.trim() !== '') {
        const query = searchNotesQuery.toLowerCase();
        return (
          n.title.toLowerCase().includes(query) ||
          n.description.toLowerCase().includes(query) ||
          n.tag.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [notes, activeWorkspace, searchNotesQuery]);

  return (
    <div className="bg-[#f8f9ff] text-on-background min-h-screen flex flex-col font-sans transition-colors duration-200">
      
      {/* Dynamic Popups & Toast Notifications */}
      {notification && (
        <div 
          className="fixed bottom-6 right-6 z-[100] px-5 py-3 rounded-xl shadow-neo-extruded bg-white border border-secondary-container flex items-center space-x-3 text-sm font-medium animate-fade-in-up"
          id="system-notification"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-on-background">{notification.message}</span>
        </div>
      )}

      {/* --- TopNavBar & Workspace Switcher --- */}
      <header className="bg-background shadow-neo-extruded w-full sticky top-0 z-50 transition-all border-b border-outline-variant/10">
        <div className="flex justify-between items-center w-full px-6 h-16 max-w-7xl mx-auto relative">
          
          {/* Brand Logo & Icon */}
          <div 
            onClick={() => triggerNotification('ERP Nexus Console - Workspace v4.1')}
            className="font-sans text-xl font-bold text-primary-color flex items-center gap-2 cursor-pointer select-none active:scale-95 transition-transform"
            id="brand-logo"
          >
            <div className="w-9 h-9 rounded-lg bg-surface-container-low shadow-neo-inset flex items-center justify-center text-primary-color">
              <Layers className="w-5 h-5" />
            </div>
            <span>ERP Nexus</span>
          </div>

          {/* Center Switcher: IoT vs Mobile Workspaces */}
          <nav className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 md:gap-6 pointer-events-none">
            <button
              onClick={() => {
                setActiveWorkspace('IoT');
                // Auto switch default tab to Progress if current active is ToDo (as ToDo is mobile-specific)
                if (activeTab === 'ToDo') {
                  setActiveTab('Progress');
                }
                triggerNotification('Beralih ke konteks IoT Department');
              }}
              className={`font-semibold text-sm md:text-base px-3 py-1.5 rounded-lg border-b-2 transition-all duration-150 active:scale-95 pointer-events-auto ${
                activeWorkspace === 'IoT'
                  ? 'text-primary-color border-[#005da7] bg-surface-container-low shadow-neo-inset font-bold'
                  : 'text-outline hover:text-secondary-color border-transparent'
              }`}
              id="active-nav-iot"
            >
              IoT Department
            </button>
            
            <button
              onClick={() => {
                setActiveWorkspace('Mobile');
                setActiveTab('ToDo'); // Mobile default view
                triggerNotification('Beralih ke konteks Mobile Department');
              }}
              className={`font-semibold text-sm md:text-base px-3 py-1.5 rounded-lg border-b-2 transition-all duration-150 active:scale-95 pointer-events-auto ${
                activeWorkspace === 'Mobile'
                  ? 'text-primary-color border-[#005da7] bg-surface-container-low shadow-neo-inset font-bold'
                  : 'text-outline hover:text-secondary-color border-transparent'
              }`}
              id="active-nav-mobile"
            >
              Mobile Department
            </button>
          </nav>

          {/* Quick Actions (Settings & Profile) */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowSettings(prev => !prev)}
              aria-label="Settings" 
              className="text-outline hover:text-primary-color w-10 h-10 rounded-full flex items-center justify-center shadow-neo-extruded hover:shadow-neo-extruded-high active:shadow-neo-inset transition-all"
              id="settings-btn"
            >
              <Settings className="w-5 h-5" />
            </button>
            <div 
              onClick={() => triggerNotification(`Ulasan Profil: juanmadhy425@gmail.com`)}
              className="text-outline hover:text-primary-color w-10 h-10 rounded-full flex items-center justify-center cursor-pointer shadow-neo-extruded hover:shadow-neo-extruded-high active:shadow-neo-inset bg-surface-container-lowest overflow-hidden transition-all"
              id="profile-btn"
            >
              <User className="w-5 h-5 text-secondary-color" />
            </div>
          </div>
        </div>

        {/* --- Sub-navbar Tabs --- */}
        <div className="w-full bg-surface-container-low/50 border-t border-outline-variant/10">
          <div className="flex items-center gap-1 sm:gap-3 w-full px-6 py-2.5 max-w-7xl mx-auto overflow-x-auto">
            
            <button
              onClick={() => {
                setActiveTab('ToDo');
                // Ensure workspace matches Mobile if to-do list is shown for standard consistency
                if (activeWorkspace !== 'Mobile') {
                  setActiveWorkspace('Mobile');
                }
              }}
              className={`flex items-center justify-center px-4 py-1.5 rounded-lg font-semibold text-xs sm:text-sm whitespace-nowrap transition-all duration-150 active:scale-95 ${
                activeTab === 'ToDo' && activeWorkspace === 'Mobile'
                  ? 'bg-surface-container text-primary-color shadow-neo-inset font-bold'
                  : 'text-on-surface-variant hover:bg-surface-container-low hover:shadow-neo-extruded'
              }`}
              id="tab-to-do"
            >
              Daftar Tugas
            </button>

            <button
              onClick={() => {
                setActiveTab('Progress');
                if (activeWorkspace !== 'IoT') {
                  setActiveWorkspace('IoT');
                }
              }}
              className={`flex items-center justify-center px-4 py-1.5 rounded-lg font-semibold text-xs sm:text-sm whitespace-nowrap transition-all duration-150 active:scale-95 ${
                activeTab === 'Progress' && activeWorkspace === 'IoT'
                  ? 'bg-surface-container text-primary-color shadow-neo-inset font-bold'
                  : 'text-on-surface-variant hover:bg-surface-container-low hover:shadow-neo-extruded'
              }`}
              id="tab-progress-tracking"
            >
              Pelacakan Kemajuan
            </button>

            <button
              onClick={() => {
                setActiveTab('Assignment');
              }}
              className={`flex items-center justify-center px-4 py-1.5 rounded-lg font-semibold text-xs sm:text-sm whitespace-nowrap transition-all duration-150 active:scale-95 ${
                activeTab === 'Assignment'
                  ? 'bg-surface-container text-primary-color shadow-neo-inset font-bold'
                  : 'text-on-surface-variant hover:bg-surface-container-low hover:shadow-neo-extruded'
              }`}
              id="tab-task-assignment"
            >
              Penugasan Tugas
            </button>

            <button
              onClick={() => {
                setActiveTab('Notes');
              }}
              className={`flex items-center justify-center px-4 py-1.5 rounded-lg font-semibold text-xs sm:text-sm whitespace-nowrap transition-all duration-150 active:scale-95 ${
                activeTab === 'Notes'
                  ? 'bg-surface-container text-primary-color shadow-neo-inset font-bold'
                  : 'text-on-surface-variant hover:bg-surface-container-low hover:shadow-neo-extruded'
              }`}
              id="tab-meeting-notes"
            >
              Catatan Rapat
            </button>
          </div>
        </div>
      </header>

      {/* --- Main Application Frame (Max-Width 1440px Centered Grid) --- */}
      <div className="flex flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
        
        {/* Render Active View Modules */}
        <main className="flex-1 w-full animate-fade-in">
          
          {/* Theme customizer overlay modal */}
          {showSettings && (
            <div className="mb-6 p-5 bg-white rounded-2xl shadow-neo-extruded border border-outline-variant/20 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in">
              <div className="flex items-center gap-3">
                <Sliders className="text-secondary-color w-6 h-6" />
                <div>
                  <h4 className="font-bold text-on-background text-base">Panel Kustomisasi ERP Nexus</h4>
                  <p className="text-xs text-outline">Sesuaikan aksen aksen warna tema secara langsung.</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-outline">Pilih Aksen:</span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => { setAccentColor('slate'); triggerNotification('Aksen tema diatur ke Abu-abu Klasik'); }}
                    className={`w-6 h-6 rounded-full bg-[#3b608f] border-2 ${accentColor === 'slate' ? 'border-[#001c39] scale-110' : 'border-transparent'}`}
                    title="Abu-abu Klasik"
                  />
                  <button 
                    onClick={() => { setAccentColor('green'); triggerNotification('Aksen tema diatur ke Hijau Teal'); }}
                    className={`w-6 h-6 rounded-full bg-emerald-600 border-2 ${accentColor === 'green' ? 'border-emerald-950 scale-110' : 'border-transparent'}`}
                    title="Hijau Teal"
                  />
                  <button 
                    onClick={() => { setAccentColor('violet'); triggerNotification('Aksen tema diatur ke Ungu Biru'); }}
                    className={`w-6 h-6 rounded-full bg-indigo-600 border-2 ${accentColor === 'violet' ? 'border-indigo-950 scale-110' : 'border-transparent'}`}
                    title="Ungu Biru"
                  />
                  <button 
                    onClick={() => { setAccentColor('amber'); triggerNotification('Aksen tema diatur ke Jingga Senja'); }}
                    className={`w-6 h-6 rounded-full bg-amber-500 border-2 ${accentColor === 'amber' ? 'border-amber-950 scale-110' : 'border-transparent'}`}
                    title="Jingga Senja"
                  />
                </div>
                <button 
                  onClick={() => setShowSettings(false)}
                  className="ml-3 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-md"
                >
                  Selesai
                </button>
              </div>
            </div>
          )}

          {/* ========================================== */}
          {/* MODULE 1: PROGRESS TRACKING (IoT Workspace) */}
          {/* ========================================== */}
          {activeTab === 'Progress' && activeWorkspace === 'IoT' && (
            <div id="view-progress-tracking-module" className="space-y-6">
              
              {/* Page header section */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-on-background tracking-tight">Pelacak Kemajuan</h1>
                  <p className="text-sm text-on-surface-variant mt-1 font-medium">Kelola dan lacak tugas-tugas Departemen IoT di semua sprint aktif.</p>
                </div>
                
                {/* Search Bar (Inset View shadow) */}
                <div className="flex items-center gap-3">
                  <div className="relative rounded-xl bg-slate-50 shadow-neo-inset px-4 py-2 flex items-center w-full max-w-xs">
                    <Search className="text-outline w-5 h-5 mr-2 flex-shrink-0" />
                    <input 
                      type="text"
                      className="bg-transparent border-none outline-none text-sm text-on-surface-variant placeholder-outline w-44 focus:ring-0"
                      placeholder="Cari tugas..."
                      value={searchTasksQuery}
                      onChange={(e) => setSearchTasksQuery(e.target.value)}
                    />
                    {searchTasksQuery && (
                      <button onClick={() => setSearchTasksQuery('')} className="absolute right-3 text-outline hover:text-on-surface">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Kanban columns grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start" id="kanban-board">
                
                {/* Col 1: Untouched */}
                <div 
                  className={`flex flex-col space-y-4 p-3 rounded-2xl transition-all duration-200 min-h-[500px] ${
                    dragOverColumn === 'Belum Mulai' 
                      ? 'bg-slate-100/80 ring-2 ring-secondary-color/20 scale-[1.01]' 
                      : draggingTaskId 
                        ? 'bg-slate-50 border border-dashed border-outline-variant/30' 
                        : 'bg-transparent'
                  }`}
                  onDragOver={(e) => handleDragOver(e, 'Belum Mulai')}
                  onDragLeave={() => setDragOverColumn(null)}
                  onDrop={(e) => handleDrop(e, 'Belum Mulai')}
                >
                  <div className="flex items-center justify-between px-2 mb-1">
                    <h3 className="text-sm font-bold text-on-surface-variant flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                      Belum Mulai
                    </h3>
                    <span className="text-xs font-semibold text-outline bg-surface-container px-2.5 py-0.5 rounded-full">
                      {columnTasks['Belum Mulai'].length}
                    </span>
                  </div>

                  {columnTasks['Belum Mulai'].map(task => (
                    <div 
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      onDragEnd={handleDragEnd}
                      className={`neumorphic-card bg-white p-5 rounded-2xl cursor-grab active:cursor-grabbing hover:shadow-neo-extruded-high border border-outline-variant/10 relative transition-all duration-200 ${
                        draggingTaskId === task.id ? 'opacity-40 scale-95 border-dashed border-secondary-color/40 shadow-none' : ''
                      }`}
                      id={`kanban-card-${task.id}`}
                      onClick={() => setSelectedTask(task)}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-xs font-bold px-2 py-1 bg-surface-container-low text-secondary-color rounded-md">
                          {task.category}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            task.priority === 'High' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {task.priority}
                          </span>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTask(task);
                            }} 
                            className="text-outline hover:text-on-surface p-0.5 rounded-md hover:bg-slate-50"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <h4 className="text-base font-bold text-on-surface mb-1">{task.title}</h4>
                      <p className="text-xs text-on-surface-variant line-clamp-2 mb-4 leading-relaxed">{task.description}</p>

                      <div className="flex justify-between items-center pt-3 border-t border-outline-variant/20">
                        <div className="flex items-center gap-2">
                          {task.assignedTo.avatarUrl ? (
                            <img 
                              src={task.assignedTo.avatarUrl} 
                              alt={task.assignedTo.name} 
                              referrerPolicy="no-referrer"
                              className="w-6 h-6 rounded-full border border-slate-100 object-cover" 
                            />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center border border-slate-300">
                              {task.assignedTo.initials}
                            </div>
                          )}
                          <span className="text-xs font-medium text-on-surface-variant">{task.assignedTo.name}</span>
                        </div>
                        {task.attachmentsCount ? (
                          <div className="flex items-center gap-1 text-outline">
                            <Paperclip className="w-3.5 h-3.5" />
                            <span className="text-xs font-semibold">{task.attachmentsCount}</span>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ))}

                  {columnTasks['Belum Mulai'].length === 0 && (
                    <div className="p-8 text-center bg-slate-50/50 rounded-2xl border border-dashed border-outline-variant/30 text-xs text-outline font-medium">
                      Tidak ada tugas yang belum dimulai.
                    </div>
                  )}
                </div>

                {/* Col 2: In Progress */}
                <div 
                  className={`flex flex-col space-y-4 p-3 rounded-2xl transition-all duration-200 min-h-[500px] ${
                    dragOverColumn === 'Sedang Berjalan' 
                      ? 'bg-slate-100/80 ring-2 ring-[#a5c9fe]/20 scale-[1.01]' 
                      : draggingTaskId 
                        ? 'bg-slate-50 border border-dashed border-outline-variant/30' 
                        : 'bg-transparent'
                  }`}
                  onDragOver={(e) => handleDragOver(e, 'Sedang Berjalan')}
                  onDragLeave={() => setDragOverColumn(null)}
                  onDrop={(e) => handleDrop(e, 'Sedang Berjalan')}
                >
                  <div className="flex items-center justify-between px-2 mb-1">
                    <h3 className="text-sm font-bold text-on-surface-variant flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${accentColor === 'green' ? 'bg-emerald-400' : 'bg-[#a5c9fe]'}`} />
                      Sedang Berjalan
                    </h3>
                    <span className="text-xs font-semibold text-outline bg-surface-container px-2.5 py-0.5 rounded-full">
                      {columnTasks['Sedang Berjalan'].length}
                    </span>
                  </div>

                  {columnTasks['Sedang Berjalan'].map(task => (
                    <div 
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      onDragEnd={handleDragEnd}
                      className={`neumorphic-card bg-white p-5 rounded-2xl cursor-grab active:cursor-grabbing hover:shadow-neo-extruded-high border-l-4 border-secondary-container border-t border-r border-b border-light-grey/20 relative transition-all duration-200 ${
                        draggingTaskId === task.id ? 'opacity-40 scale-95 border-dashed border-secondary-color/40 shadow-none' : ''
                      }`}
                      id={`kanban-card-${task.id}`}
                      onClick={() => setSelectedTask(task)}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-xs font-bold px-2 py-1 bg-[#eff4ff] text-[#3b608f] rounded-md">
                          {task.category}
                        </span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTask(task);
                          }} 
                          className="text-outline hover:text-on-surface p-0.5 rounded-md hover:bg-slate-50"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>

                      <h4 className="text-base font-bold text-on-surface mb-2">{task.title}</h4>
                      
                      {/* Live progress editor */}
                      <div className="mt-4 mb-2" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between text-xs font-semibold mb-1">
                          <span className="text-on-surface-variant select-none">Kemajuan</span>
                          <span className="text-secondary-color font-bold">{task.progress || 65}%</span>
                        </div>
                        <div className="w-full bg-[#f0f2f5] rounded-full h-1.5 shadow-neo-inset-sm">
                          <div 
                            className={`h-1.5 rounded-full ${accentClasses.accentFill}`} 
                            style={{ width: `${task.progress || 65}%` }} 
                          />
                        </div>
                        
                        {/* Instant click buttons to tweak progress visually (Interactive polish!) */}
                        <div className="flex gap-1.5 justify-end mt-2">
                          <button 
                            onClick={() => {
                              const curr = task.progress || 0;
                              handleUpdateTaskProgressVal(task.id, Math.max(0, curr - 20));
                              triggerNotification(`Mengurangi kemajuan untuk "${task.title}"`);
                            }}
                            className="text-[9px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded"
                          >
                            -20%
                          </button>
                          <button 
                            onClick={() => {
                              const curr = task.progress || 0;
                              handleUpdateTaskProgressVal(task.id, Math.min(100, curr + 20));
                              triggerNotification(`Meningkatkan kemajuan untuk "${task.title}"`);
                            }}
                            className="text-[9px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded"
                          >
                            +20%
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-3 border-t border-outline-variant/20 mt-3">
                        <div className="flex items-center gap-2">
                          {task.assignedTo.avatarUrl ? (
                            <img 
                              src={task.assignedTo.avatarUrl} 
                              alt={task.assignedTo.name} 
                              referrerPolicy="no-referrer"
                              className="w-6 h-6 rounded-full border border-slate-100 object-cover" 
                            />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-slate-300 text-slate-800 font-bold text-[10px] flex items-center justify-center border border-slate-400">
                              {task.assignedTo.initials}
                            </div>
                          )}
                          <span className="text-xs font-medium text-on-surface-variant">{task.assignedTo.name}</span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {columnTasks['Sedang Berjalan'].length === 0 && (
                    <div className="p-8 text-center bg-slate-50/50 rounded-2xl border border-dashed border-outline-variant/30 text-xs text-outline font-medium">
                      Tidak ada tugas aktif yang sedang berjalan.
                    </div>
                  )}

                  {/* Ref Image Representation exactly matching the target design */}
                  <div className="neumorphic-card bg-white rounded-2xl p-2.5 hover:shadow-neo-extruded-high border border-outline-variant/15 relative overflow-hidden group">
                    <div className="absolute top-2 right-2 z-10 bg-white/90 px-2 py-0.5 rounded text-[9px] font-bold text-slate-700 shadow shadow-slate-200">
                      Pratinjau Kanban Odoo
                    </div>
                    <img 
                      alt="Referensi Kanban Odoo" 
                      className="w-full h-auto rounded-lg opacity-85 mix-blend-multiply group-hover:opacity-100 transition-opacity" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCU5GcjscvHxYD37GrUtk7Xqc-aFK6hz2u4xMK6us6adCrE6ysL393u9fIpOJxn4St01zlqtbI55H0cwkTrFm8IbUcRMEL5s87gz1X9p9yXpJW9krtv-4RyXpZGopK1HDv1c8RJTL6GzNNitHcpbK1oVLe_twlUfoSnexPNUR0stpCuWwYHPtkfBdO7vq4nYJBCAnftUb3kYLuv_S3eRp36xL0U_l0V--PNcFy1PEmQaNMZ6eQcv5swNQh9KdR_Vm-skf9a0gyAAOnZ" 
                    />
                  </div>
                </div>

                {/* Col 3: Final Check */}
                <div 
                  className={`flex flex-col space-y-4 p-3 rounded-2xl transition-all duration-200 min-h-[500px] ${
                    dragOverColumn === 'Pemeriksaan Akhir' 
                      ? 'bg-slate-100/80 ring-2 ring-secondary-color/20 scale-[1.01]' 
                      : draggingTaskId 
                        ? 'bg-slate-50 border border-dashed border-outline-variant/30' 
                        : 'bg-transparent'
                  }`}
                  onDragOver={(e) => handleDragOver(e, 'Pemeriksaan Akhir')}
                  onDragLeave={() => setDragOverColumn(null)}
                  onDrop={(e) => handleDrop(e, 'Pemeriksaan Akhir')}
                >
                  <div className="flex items-center justify-between px-2 mb-1">
                    <h3 className="text-sm font-bold text-on-surface-variant flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-secondary-color" />
                      Pemeriksaan Akhir
                    </h3>
                    <span className="text-xs font-semibold text-outline bg-surface-container px-2.5 py-0.5 rounded-full">
                      {columnTasks['Pemeriksaan Akhir'].length}
                    </span>
                  </div>

                  {columnTasks['Pemeriksaan Akhir'].map(task => (
                    <div 
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      onDragEnd={handleDragEnd}
                      className={`neumorphic-card bg-white p-5 rounded-2xl cursor-grab active:cursor-grabbing hover:shadow-neo-extruded-high border-l-4 border-secondary-color border-t border-r border-b relative transition-all duration-200 ${
                        draggingTaskId === task.id ? 'opacity-40 scale-95 border-dashed border-secondary-color/40 shadow-none' : ''
                      }`}
                      id={`kanban-card-${task.id}`}
                      onClick={() => setSelectedTask(task)}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-xs font-bold px-2 py-1 bg-surface-container-low text-secondary-color rounded-md">
                          {task.category}
                        </span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTask(task);
                          }} 
                          className="text-outline hover:text-on-surface p-0.5 rounded-md hover:bg-slate-50"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>

                      <h4 className="text-base font-bold text-on-surface mb-1">{task.title}</h4>
                      <p className="text-xs text-on-surface-variant line-clamp-2 mb-3 leading-relaxed">{task.description}</p>

                      {/* Progress Line */}
                      <div className="mt-2 mb-2">
                        <div className="flex justify-between text-xs font-semibold mb-1">
                          <span className="text-on-surface-variant">Kemajuan</span>
                          <span className="text-secondary-color font-bold">{task.progress || 95}%</span>
                        </div>
                        <div className="w-full bg-[#f0f2f5] rounded-full h-1.5 shadow-neo-inset-sm">
                          <div 
                            className="bg-secondary-color h-1.5 rounded-full" 
                            style={{ width: `${task.progress || 95}%` }} 
                          />
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-3 border-t border-outline-variant/20 mt-3">
                        <div className="flex items-center gap-2">
                          {task.assignedTo.avatarUrl ? (
                            <img 
                              src={task.assignedTo.avatarUrl} 
                              alt={task.assignedTo.name} 
                              referrerPolicy="no-referrer"
                              className="w-6 h-6 rounded-full border border-slate-100 object-cover" 
                            />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center border border-slate-300">
                              {task.assignedTo.initials}
                            </div>
                          )}
                          <span className="text-xs font-medium text-on-surface-variant">{task.assignedTo.name}</span>
                        </div>
                        {task.commentsCount ? (
                          <div className="flex items-center gap-1 text-outline">
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span className="text-xs font-semibold">{task.commentsCount}</span>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ))}

                  {columnTasks['Pemeriksaan Akhir'].length === 0 && (
                    <div className="p-8 text-center bg-slate-50/50 rounded-2xl border border-dashed border-outline-variant/30 text-xs text-outline font-medium">
                      Tidak ada tugas yang menunggu pemeriksaan akhir.
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* ========================================== */}
          {/* MODULE 2: TO DO LIST (Mobile Workspace)    */}
          {/* ========================================== */}
          {activeTab === 'ToDo' && activeWorkspace === 'Mobile' && (
            <div id="view-to-do-list-module" className="space-y-6">
              
              {/* Page header section */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-on-background tracking-tight">Daftar Tugas</h1>
                  <p className="text-sm text-outline mt-1 font-medium">Kelola dan lacak tugas-tugas operasional seluler Anda.</p>
                </div>
                
                {/* Search Bar */}
                <div className="relative hidden sm:block w-72">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
                  <input 
                    type="text"
                    className="w-full bg-[#f8f9ff] rounded-full py-2.5 pl-11 pr-4 text-sm text-on-background border-none shadow-neo-inset focus:ring-2 focus:ring-secondary-color focus:outline-none transition-shadow"
                    placeholder="Cari tugas..."
                    value={searchTasksQuery}
                    onChange={(e) => setSearchTasksQuery(e.target.value)}
                  />
                  {searchTasksQuery && (
                    <button onClick={() => setSearchTasksQuery('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-outline">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Bento grid layout */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                
                {/* Left side: Task List Container */}
                <div className="xl:col-span-8 flex flex-col gap-6">
                  
                  {/* Filter tabs nested inside container */}
                  <div className="flex items-center justify-between bg-white rounded-2xl p-4 shadow-neo-extruded border border-outline-variant/10">
                    <div className="flex gap-2 sm:gap-4">
                      
                      <button 
                        onClick={() => setTodoFilter('Semua')}
                        className={`font-semibold text-xs sm:text-sm px-4 py-2 rounded-full transition-all ${
                          todoFilter === 'Semua' 
                            ? `text-primary-color bg-surface-container shadow-neo-inset` 
                            : 'text-on-surface-variant hover:text-secondary-color'
                        }`}
                      >
                        Semua Tugas
                      </button>
                      
                      <button 
                        onClick={() => setTodoFilter('Tinggi')}
                        className={`font-semibold text-xs sm:text-sm px-4 py-2 rounded-full transition-all ${
                          todoFilter === 'Tinggi' 
                            ? 'text-primary-color bg-surface-container shadow-neo-inset' 
                            : 'text-on-surface-variant hover:text-[#3b608f]'
                        }`}
                      >
                        Prioritas Tinggi
                      </button>
                      
                      <button 
                        onClick={() => setTodoFilter('Selesai')}
                        className={`font-semibold text-xs sm:text-sm px-4 py-2 rounded-full transition-all ${
                          todoFilter === 'Selesai' 
                            ? 'text-primary-color bg-surface-container shadow-neo-inset' 
                            : 'text-on-surface-variant hover:text-[#3b608f]'
                        }`}
                      >
                        Selesai
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => triggerNotification('Konfigurasi filter diterapkan')}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-outline hover:text-secondary-color bg-white shadow-neo-extruded active:shadow-neo-inset transition-all"
                      >
                        <Sliders className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Ultimate Task Rows Container */}
                  <div className="bg-white rounded-3xl p-6 shadow-neo-extruded border border-outline-variant/10">
                    <div className="flex flex-col space-y-4">
                      
                      {filteredMobileTasks.map((task, index) => {
                        const isCompleted = task.status === 'Selesai';
                        return (
                          <React.Fragment key={task.id}>
                            {index > 0 && (
                              <div className="h-px w-full bg-gradient-to-r from-transparent via-outline-variant/30 to-transparent my-1" />
                            )}
                            
                            <div className={`group flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-50/50 transition-colors border border-transparent ${
                              isCompleted ? 'opacity-70 bg-slate-50/20' : ''
                            }`}>
                              
                              <div className="pt-1.5">
                                <input 
                                  type="checkbox"
                                  className="neo-checkbox cursor-pointer"
                                  checked={isCompleted}
                                  onChange={() => handleToggleTaskChecked(task.id)}
                                />
                              </div>

                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-1">
                                  <h3 className={`font-bold text-base transition-colors ${
                                    isCompleted 
                                      ? 'text-outline line-through' 
                                      : 'text-on-background group-hover:text-primary-color'
                                  }`}>
                                    {task.title}
                                  </h3>
                                  <span className={`font-bold text-[10px] px-2 py-0.5 rounded-md border ${
                                    task.priority === 'High' 
                                      ? 'bg-red-50 text-red-600 border-red-100' 
                                      : task.priority === 'Medium' 
                                      ? 'bg-amber-50 text-amber-600 border-amber-100' 
                                      : 'bg-green-50 text-green-600 border-green-100'
                                  }`}>
                                    {task.priority}
                                  </span>
                                </div>

                                <p className={`text-xs text-outline mb-3 leading-relaxed ${isCompleted ? 'line-through' : ''}`}>
                                  {task.description}
                                </p>

                                <div className="flex flex-wrap items-center gap-4 text-outline font-semibold text-xs">
                                  
                                  {task.overdueText ? (
                                    <div className="flex items-center gap-1 text-red-600 animate-pulse">
                                      <AlertTriangle className="w-4 h-4" />
                                      {task.overdueText}
                                    </div>
                                  ) : null}

                                  {task.timeString ? (
                                    <div className="flex items-center gap-1">
                                      <Calendar className="w-3.5 h-3.5" />
                                      {task.timeString}
                                    </div>
                                  ) : null}

                                  {task.location ? (
                                    <div className="flex items-center gap-1">
                                      <MapPin className="w-3.5 h-3.5" />
                                      {task.location}
                                    </div>
                                  ) : null}

                                  <div className="text-[11px] text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded">
                                    PIC: {task.assignedTo.name}
                                  </div>

                                </div>
                              </div>

                              <button 
                                onClick={() => handleDeleteTask(task.id)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-outline hover:text-red-600 p-2 rounded-full hover:bg-white hover:shadow shadow-slate-200"
                                title="Delete task"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>

                            </div>
                          </React.Fragment>
                        );
                      })}

                      {filteredMobileTasks.length === 0 && (
                        <div className="p-12 text-center text-outline text-sm font-semibold">
                          Belum ada tugas di kategori ini! Klik tab "Task Assignment" di atas untuk menambahkan tugas baru.
                        </div>
                      )}

                    </div>

                    {/* Pagination simulate */}
                    {filteredMobileTasks.length > 0 && (
                      <div className="mt-6 flex justify-center border-t border-slate-50 pt-4">
                        <button 
                          onClick={() => triggerNotification('Semua tugas telah dimuat')}
                          className="text-xs font-bold text-secondary-color hover:text-primary-color transition-colors flex items-center gap-1.5 hover:underline"
                        >
                          Muat Lebih Banyak Tugas <ChevronDown className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right side: Summary stats & Upcoming deadines widget */}
                <div className="xl:col-span-4 flex flex-col gap-6">
                  
                  {/* Chart and statistics progress meter */}
                  <div className="bg-white rounded-3xl p-6 shadow-neo-extruded border border-outline-variant/10">
                    <h3 className="font-bold text-base text-on-background mb-6 flex items-center gap-2">
                      <Activity className="text-secondary-color w-5 h-5" />
                      Kemajuan Sprint
                    </h3>

                    {/* Circular Neumorphic Progress Meter SVG rendering real dynamically calculated states! */}
                    <div className="flex justify-center mb-8">
                      <div className="relative w-32 h-32 rounded-full shadow-neo-extruded flex items-center justify-center bg-[#f8f9ff]">
                        <div className="w-[100px] h-[100px] rounded-full shadow-neo-inset flex items-center justify-center bg-[#f8f9ff] z-10 text-center">
                          <div>
                            <span className="font-bold text-2xl text-primary-color block leading-none">
                              {statsCalculations.percent}%
                            </span>
                            <span className="text-[10px] font-semibold text-outline tracking-wider uppercase mt-1 block">
                              Selesai
                            </span>
                          </div>
                        </div>

                        {/* Animated circular path */}
                        <svg className="absolute top-0 left-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" fill="none" r="44" stroke="#e5eeff" strokeWidth="7" />
                          <circle 
                            cx="50" 
                            cy="50" 
                            fill="none" 
                            r="44" 
                            stroke={accentClasses.circleStroke} 
                            strokeWidth="7" 
                            strokeDasharray="276"
                            strokeDashoffset={276 - (276 * statsCalculations.percent) / 100}
                            strokeLinecap="round"
                            className="transition-all duration-500 ease-out"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Stats mini grid with live dynamic numbers */}
                    <div className="grid grid-cols-2 gap-4">
                      
                      <div className="bg-[#f8f9ff] rounded-xl p-3.5 shadow-neo-inset-sm text-center">
                        <span className="block font-bold text-xl text-on-background">{statsCalculations.total}</span>
                        <span className="text-[10px] font-bold text-outline">Total Tugas</span>
                      </div>
                      
                      <div className="bg-[#f8f9ff] rounded-xl p-3.5 shadow-neo-inset-sm text-center">
                        <span className="block font-bold text-xl text-secondary-color">{statsCalculations.completed}</span>
                        <span className="text-[10px] font-bold text-outline">Selesai</span>
                      </div>

                      <div className="bg-[#f8f9ff] rounded-xl p-3 shadow-neo-inset-sm text-center col-span-2">
                        <span className="block font-bold text-lg text-red-600">
                          {statsCalculations.pending}
                        </span>
                        <span className="text-[10px] font-bold text-outline">Menunggu Tindakan</span>
                      </div>

                    </div>
                  </div>

                  {/* Upcoming deadlines widget */}
                  <div className="bg-white rounded-3xl p-6 shadow-neo-extruded border border-outline-variant/10 flex-1">
                    <h3 className="font-bold text-base text-on-background mb-4 flex items-center gap-2">
                      <Calendar className="text-secondary-color w-5 h-5" />
                      Tenggat Mendatang
                    </h3>

                    <div className="flex flex-col space-y-3">
                      
                      {mobileTasks.filter(t => t.status !== 'Selesai').map(task => (
                        <div 
                          key={task.id}
                          onClick={() => triggerNotification(`Fokus pada tenggat waktu untuk ${task.title}`)}
                          className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-100"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-secondary-color font-bold text-xs shadow-neo-inset-sm border border-blue-100">
                              {task.priority === 'Tinggi' ? 'Tdy' : 'Tmr'}
                            </div>
                            <div>
                              <h4 className="font-bold text-xs text-on-background line-clamp-1">{task.title}</h4>
                              <p className="text-[10px] font-semibold text-outline">{task.timeString || 'Hari Ini, 14:00'}</p>
                            </div>
                          </div>
                          <ChevronRight className="text-outline w-4 h-4" />
                        </div>
                      ))}

                      {mobileTasks.filter(t => t.status !== 'Selesai').length === 0 && (
                        <div className="py-8 text-center text-xs text-outline font-medium">
                          Tidak ada tenggat seluler yang tertunda!
                        </div>
                      )}

                    </div>
                  </div>

                </div>

              </div>
            </div>
          )}

          {/* ========================================== */}
          {/* MODULE 3: TASK ASSIGNMENT                   */}
          {/* ========================================== */}
          {activeTab === 'Assignment' && (
            <div id="view-task-assignment-module" className="space-y-6">
              
              <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-on-background tracking-tight">Penugasan Tugas</h1>
                <p className="text-sm text-outline mt-1 font-medium">Alokasikan sumber daya dan tetapkan tenggat untuk pencapaian proyek.</p>
              </div>

              {/* Grid split */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Left card: Form card inside level 1 neumorphic design */}
                <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 shadow-neo-extruded border border-outline-variant/10">
                  <div className="flex items-center gap-2.5 mb-6 border-b border-slate-100 pb-4">
                    <PlusCircle className="text-primary-color w-6 h-6" />
                    <h2 className="text-lg font-bold text-on-background">Buat &amp; Tugaskan Tugas</h2>
                  </div>

                  <form onSubmit={handleCreateTask} className="space-y-6">
                    
                    {/* Title */}
                    <div>
                      <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-2">
                        Judul Tugas
                      </label>
                      <input 
                        type="text"
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm text-on-background shadow-neo-inset focus:ring-2 focus:ring-secondary-color focus:bg-white outline-none transition-all"
                        placeholder="mis. Perbarui Firmware Sensor"
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      
                      {/* Workspace selector */}
                      <div>
                        <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-2">
                          Target Departemen
                        </label>
                        <select 
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm text-on-background shadow-neo-inset focus:ring-2 focus:ring-secondary-color focus:bg-white outline-none cursor-pointer transition-all"
                          value={formWorkspace}
                          onChange={(e) => setFormWorkspace(e.target.value as 'IoT' | 'Mobile')}
                        >
                          <option value="IoT">IoT Department (Papan Kanban)</option>
                          <option value="Mobile">Mobile Department (Daftar Tugas)</option>
                        </select>
                      </div>

                      {/* Person In Charge (PIC) */}
                      <div>
                        <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-2">
                          Penanggung Jawab (PIC)
                        </label>
                        <select 
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm text-on-background shadow-neo-inset focus:ring-2 focus:ring-secondary-color focus:bg-white outline-none cursor-pointer transition-all"
                          value={formPIC}
                          onChange={(e) => setFormPIC(e.target.value)}
                        >
                          {teamMembers.map(member => (
                            <option key={member.id} value={member.id}>
                              {member.name} ({member.role === 'IoT' ? 'IoT Department' : 'Mobile Department'})
                            </option>
                          ))}
                        </select>
                      </div>

                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      
                      {/* Deadline String */}
                      <div>
                        <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-2">
                          Tenggat Waktu (Waktu/Tanggal)
                        </label>
                        <input 
                          type="text"
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm text-on-background shadow-neo-inset focus:ring-2 focus:ring-secondary-color focus:bg-white outline-none transition-all"
                          placeholder="mis. 14:00 atau 10 Nov"
                          value={formDeadline}
                          onChange={(e) => setFormDeadline(e.target.value)}
                        />
                      </div>

                      {/* Priority */}
                      <div>
                        <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-2">
                          Tingkat Prioritas
                        </label>
                        <div className="flex bg-slate-100 rounded-xl p-1 shadow-neo-inset-sm">
                          {(['Tinggi', 'Sedang', 'Rendah'] as Priority[]).map(p => (
                            <button
                              key={p}
                              type="button"
                              onClick={() => setFormPriority(p)}
                              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                                formPriority === p 
                                  ? 'bg-white text-primary-color shadow-sm' 
                                  : 'text-outline hover:text-on-surface'
                              }`}
                            >
                              {p}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Category (Only relevant for IoT) */}
                      <div>
                        <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-2">
                          Kategori Rekayasa
                        </label>
                        <select 
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm text-on-background shadow-neo-inset focus:ring-2 focus:ring-secondary-color focus:bg-white outline-none cursor-pointer disabled:opacity-50 transition-all"
                          value={formCategory}
                          onChange={(e) => setFormCategory(e.target.value as TaskCategory)}
                          disabled={formWorkspace === 'Mobile'}
                        >
                          <option value="Perangkat Keras">Perangkat Keras</option>
                          <option value="Firmware">Firmware</option>
                          <option value="Jaringan">Jaringan</option>
                          <option value="Keamanan">Keamanan</option>
                          <option value="Umum">Umum/Lainnya</option>
                        </select>
                      </div>

                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-2">
                        Deskripsi Lengkap
                      </label>
                      <textarea 
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm text-on-background shadow-neo-inset focus:ring-2 focus:ring-secondary-color focus:bg-white outline-none min-h-[100px] transition-all"
                        placeholder="Masukkan rincian instruksi tugas di sini..."
                        value={formDescription}
                        onChange={(e) => setFormDescription(e.target.value)}
                      />
                    </div>

                    {/* Form actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                      <button 
                        type="button"
                        onClick={() => {
                          setFormTitle('');
                          setFormDescription('');
                          setFormDeadline('');
                          triggerNotification('Formulir dibersihkan');
                        }}
                        className="font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-slate-50 transition-all text-outline"
                      >
                        Batal
                      </button>
                      
                      <button 
                        type="submit"
                        className="font-bold text-sm bg-white text-secondary-color border border-secondary-container/50 px-6 py-2.5 rounded-xl hover:shadow-neo-extruded active:shadow-neo-inset shadow-neo-extruded transition-all flex items-center gap-1.5"
                      >
                        <Plus className="w-4 h-4" />
                        Buat Tugas
                      </button>
                    </div>

                  </form>
                </div>

                {/* Right widgets */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                  
                  {/* Guidelines card */}
                  <div className="bg-white rounded-3xl p-6 shadow-neo-extruded border border-outline-variant/10">
                    <h3 className="font-bold text-base text-on-background mb-4 flex items-center gap-1.5">
                      <Info className="text-secondary-color w-5 h-5" />
                      Panduan Penugasan
                    </h3>
                    
                    <ul className="space-y-4 text-xs font-medium text-on-surface-variant">
                      <li className="flex items-start gap-3">
                        <span className="w-5 h-5 rounded-full bg-blue-50 border border-blue-200 text-secondary-color flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3" />
                        </span>
                        <span>Pastikan dependensi lintas fungsi dicatat dalam deskripsi.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="w-5 h-5 rounded-full bg-blue-50 border border-blue-200 text-secondary-color flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3" />
                        </span>
                        <span>Tugas IoT atau protokol firmware memerlukan buffer pengujian minimal 48 jam sebelum tenggat produksi.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="w-5 h-5 rounded-full bg-blue-50 border border-blue-200 text-secondary-color flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3" />
                        </span>
                        <span>Hubungi PIC secara langsung jika prioritas tugas sangat penting. Sinkronisasi eskalasi dilakukan setiap hari pukul 10:00.</span>
                      </li>
                    </ul>
                  </div>

                  {/* Availability card with interactive loads */}
                  <div className="bg-white rounded-3xl p-6 shadow-neo-extruded border border-outline-variant/10 flex-1">
                    <h3 className="font-bold text-base text-on-background mb-4 flex items-center gap-1.5">
                      <Sliders className="text-secondary-color w-4.5 h-4.5" />
                      Ketersediaan Sumber Daya PIC
                    </h3>

                    <div className="flex flex-col space-y-3">
                      {teamMembers.map(member => (
                        <div 
                          key={member.id}
                          onClick={() => {
                            setFormPIC(member.id);
                            triggerNotification(`Memilih ${member.name} sebagai PIC aktif di formulir`);
                          }}
                          className={`flex items-center justify-between p-3 rounded-xl border border-transparent hover:bg-slate-50 transition-all cursor-pointer ${
                            formPIC === member.id ? 'bg-slate-100/60 border-slate-200' : ''
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary-color text-xs font-bold border border-outline-variant/20">
                              {member.initials}
                            </div>
                            <div>
                              <h4 className="font-bold text-xs text-on-background">{member.name}</h4>
                              <p className="text-[10px] text-outline">Peran: {member.role === 'IoT' ? 'IoT' : 'Mobile'}</p>
                            </div>
                          </div>

                          <span className={`font-bold text-[9px] px-2 py-0.5 rounded-full ${
                            member.load === 'Beban Tinggi' 
                              ? 'bg-red-50 text-red-600 border border-red-100' 
                              : 'bg-green-50 text-green-600 border border-green-100'
                          }`}>
                            {member.load}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
            </div>
          )}

          {/* ========================================== */}
          {/* MODULE 4: MEETING NOTES                    */}
          {/* ========================================== */}
          {activeTab === 'Notes' && (
            <div id="view-meeting-notes-module" className="space-y-6">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-on-background tracking-tight">Catatan Rapat</h1>
                  <p className="text-sm text-outline mt-1 font-medium">Tinjau dan atur rekaman penyelarasan tim Anda.</p>
                </div>

                <div className="flex items-center gap-3">
                  {/* Notes specific search */}
                  <div className="relative rounded-xl bg-slate-50 shadow-neo-inset px-4 py-2 flex items-center">
                    <Search className="text-outline w-5 h-5 mr-2" />
                    <input 
                      type="text"
                      className="bg-transparent border-none outline-none text-sm text-on-surface-variant placeholder-outline w-44"
                      placeholder="Cari catatan..."
                      value={searchNotesQuery}
                      onChange={(e) => setSearchNotesQuery(e.target.value)}
                    />
                  </div>

                  {/* Add meeting note trigger */}
                  <button 
                    onClick={() => setShowNoteModal(true)}
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-white text-secondary-color shadow-neo-extruded hover:shadow-neo-extruded-high active:shadow-neo-inset border border-secondary-container/20 transition-all"
                    title="Tambah Catatan"
                    id="add-note-plus-btn"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Grid content split */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Left primary notes list */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                  
                  {filteredNotes.length === 0 && (
                    <div className="bg-white rounded-3xl p-12 text-center text-outline shadow-neo-extruded border border-outline-variant/10">
                      Catatan rapat tidak ditemukan. Setel ulang pencarian atau klik "+" untuk merekam catatan baru!
                    </div>
                  )}

                  {filteredNotes.map((note, index) => (
                    <div 
                      key={note.id}
                      className={`bg-white rounded-3xl p-6 shadow-neo-extruded border border-outline-variant/10 relative transition-all duration-150 ${
                        index === 0 ? 'border-t-4 border-secondary-color' : ''
                      }`}
                      id={`meeting-note-card-${note.id}`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold px-2.5 py-1 bg-surface-container text-secondary-color rounded-md">
                            {note.tag}
                          </span>
                          <span className="text-xs font-bold text-outline">
                            {note.dateString}
                          </span>
                        </div>
                        
                        <div className="flex gap-1.5">
                          <button 
                            onClick={() => {
                              if (window.confirm('Hapus catatan rapat ini?')) {
                                setNotes(prev => prev.filter(n => n.id !== note.id));
                                triggerNotification(`Catatan dihapus: "${note.title}"`);
                              }
                            }}
                            className="text-outline hover:text-red-600 p-1 hover:bg-slate-50 rounded"
                            title="Hapus Catatan"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <h2 className="text-lg font-bold text-on-background mb-3">{note.title}</h2>
                      <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed mb-6 font-medium whitespace-pre-wrap">
                        {note.description}
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-50">
                        {/* Participants list */}
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-outline uppercase tracking-wider">Peserta:</span>
                          <div className="flex -space-x-1.5">
                            {note.participants.map(p => (
                              <div 
                                key={p.id} 
                                className="w-6 h-6 rounded-full border border-white bg-slate-200 flex items-center justify-center text-[9px] font-bold text-slate-800"
                                title={p.name}
                              >
                                {p.initials}
                              </div>
                            ))}
                            {note.participants.length > 2 && (
                              <div className="w-6 h-6 rounded-full border border-white bg-blue-100 flex items-center justify-center text-[8px] font-bold text-[#3b608f]">
                                +{note.participants.length - 2}
                              </div>
                            )}
                          </div>
                        </div>

                        {note.attachmentsCount ? (
                          <div className="flex items-center gap-1.5 text-xs text-outline font-bold">
                            <Paperclip className="w-4 h-4" />
                            <span>{note.attachmentsCount} berkas dilampirkan</span>
                          </div>
                        ) : null}
                      </div>

                    </div>
                  ))}

                </div>

                {/* Right widget for follow-ups */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                  
                  {/* Followups Card */}
                  <div className="bg-white rounded-3xl p-6 shadow-neo-extruded border border-outline-variant/10">
                    <h3 className="font-bold text-base text-on-background mb-4 flex items-center gap-2">
                      <AlertTriangle className="text-[#3b608f] w-5 h-5" />
                      Tindak Lanjut Mendesak
                    </h3>

                    <div className="flex flex-col space-y-3.5 mb-5">
                      {followUps.map(item => (
                        <div 
                          key={item.id}
                          className="flex items-start gap-3 p-2.5 hover:bg-slate-50/50 rounded-xl transition-all"
                        >
                          <input 
                            type="checkbox"
                            checked={item.completed}
                            onChange={() => handleToggleFollowUp(item.id)}
                            className="neo-checkbox mt-0.5"
                          />
                          <div className="flex-1">
                            <p className={`text-xs font-bold text-on-background leading-relaxed ${
                              item.completed ? 'line-through text-outline' : ''
                            }`}>
                              {item.text}
                            </p>
                            <span className="text-[10px] font-semibold text-red-500">{item.dueString}</span>
                          </div>
                        </div>
                      ))}

                      {followUps.length === 0 && (
                        <p className="text-xs text-outline py-4 text-center font-medium">Semua penyelarasan telah selesai ditindaklanjuti!</p>
                      )}
                    </div>

                    {/* Quick inline follow-up creation */}
                    <form onSubmit={handleAddFollowUp} className="flex gap-2">
                      <input 
                        type="text"
                        placeholder="Tambah butir tindakan dinamis..."
                        className="flex-1 bg-slate-50 border border-slate-100 rounded-lg px-3 py-1.5 text-xs text-on-background shadow-neo-inset outline-none"
                        value={newFollowUpText}
                        onChange={(e) => setNewFollowUpText(e.target.value)}
                      />
                      <button 
                        type="submit"
                        className="bg-[#3b608f] hover:bg-[#204876] text-white font-bold p-2.5 rounded-lg text-xs leading-none transition-colors shadow shadow-neo-inset bg-secondary-color"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </form>

                    <button 
                      onClick={() => triggerNotification('Menampilkan semua riwayat daftar log tindakan sistem')}
                      className="block w-full text-center text-xs font-bold text-[#3b608f] hover:text-[#204876] mt-4 hover:underline"
                    >
                      Lihat semua butir tindakan
                    </button>
                  </div>

                </div>

              </div>

              {/* Custom Add Note Modal */}
              {showNoteModal && (
                <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs flex items-center justify-center p-4 z-[99]" id="add-note-modal">
                  <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-neo-extruded-high border border-outline-variant/10 animate-scale-up">
                    <div className="flex justify-between items-center mb-6 pb-3 border-b">
                      <h4 className="text-lg font-bold text-on-background flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-secondary-color" />
                        Catat Catatan Penyelarasan
                      </h4>
                      <button onClick={() => setShowNoteModal(false)} className="text-outline hover:text-on-surface">
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form onSubmit={handleCreateMeetingNote} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-outline tracking-wider uppercase mb-1.5">Judul Catatan</label>
                        <input 
                          type="text"
                          required
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-sm shadow-neo-inset"
                          value={noteTitle}
                          onChange={(e) => setNoteTitle(e.target.value)}
                          placeholder="mis. Sinkronisasi Protokol Firmware"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-outline tracking-wider uppercase mb-1.5">Tag Catatan</label>
                          <select 
                            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-sm shadow-neo-inset"
                            value={noteTag}
                            onChange={(e) => setNoteTag(e.target.value)}
                          >
                            <option value="Sync">Sync</option>
                            <option value="Client">Client</option>
                            <option value="Q3 Planning">Q3 Planning</option>
                            <option value="1-on-1">1-on-1</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-outline tracking-wider uppercase mb-1.5">Target Departemen</label>
                          <select 
                            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-sm shadow-neo-inset"
                            value={activeWorkspace}
                            onChange={(e) => setActiveWorkspace(e.target.value as 'IoT' | 'Mobile')}
                          >
                            <option value="IoT">IoT Department</option>
                            <option value="Mobile">Mobile Department</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-outline tracking-wider uppercase mb-1.5">Teks catatan lengkap</label>
                        <textarea 
                          placeholder="Ketik isi catatan di sini..."
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-sm shadow-neo-inset min-h-[120px]"
                          value={noteDescription}
                          onChange={(e) => setNoteDescription(e.target.value)}
                        />
                      </div>

                      <div className="flex justify-end gap-3 pt-3 border-t">
                        <button 
                          type="button" 
                          onClick={() => setShowNoteModal(false)}
                          className="text-xs font-bold text-outline px-4 py-2 hover:bg-slate-50 rounded-lg"
                        >
                          Batal
                        </button>
                        <button 
                          type="submit"
                          className="text-xs font-bold bg-[#3b608f] hover:bg-[#204876] text-white px-5 py-2 rounded-lg"
                        >
                          Catat Catatan
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* Card detailing modal overlay (Neumorphic focused card review) */}
          {selectedTask && (
            <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs flex items-center justify-center p-4 z-[99]" id="task-detail-modal">
              <div className="bg-[#f8f9ff] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-neo-extruded-high border border-outline-variant/10 animate-scale-up">
                
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-bold px-2.5 py-1 bg-[#eff4ff] text-[#3b608f] rounded">
                    {selectedTask.category}
                  </span>
                  <button onClick={() => setSelectedTask(null)} className="text-outline hover:text-on-surface">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <h3 className="text-lg font-bold text-on-background mb-2">{selectedTask.title}</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed mb-6 bg-white p-4 rounded-xl shadow-neo-inset">
                  {selectedTask.description}
                </p>

                <div className="space-y-3 mb-6">
                  
                  <div className="flex justify-between text-xs font-semibold py-1 border-b border-outline-variant/10">
                    <span className="text-outline">PIC Ditugaskan:</span>
                    <span className="text-on-background font-bold">{selectedTask.assignedTo.name} ({selectedTask.assignedTo.role === 'IoT' ? 'IoT Department' : 'Mobile Department'})</span>
                  </div>

                  <div className="flex justify-between text-xs font-semibold py-1 border-b border-outline-variant/10">
                    <span className="text-outline">Departemen:</span>
                    <span className="text-on-background font-bold">{selectedTask.workspace === 'IoT' ? 'IoT Department' : 'Mobile Department'}</span>
                  </div>

                  <div className="flex justify-between text-xs font-semibold py-1 border-b border-[#c1c7d3]/20">
                    <span className="text-outline">Tingkat Prioritas:</span>
                    <span className="text-[#3b608f] font-extrabold">{selectedTask.priority}</span>
                  </div>

                  <div className="flex justify-between text-xs font-semibold py-1 border-b border-[#c1c7d3]/20">
                    <span className="text-outline">Status Saat Ini:</span>
                    <span className="text-primary-color font-bold">{selectedTask.status}</span>
                  </div>

                </div>

                {/* Status action transition switches */}
                <div className="bg-white p-4 rounded-xl border border-outline-variant/15 space-y-2">
                  <h4 className="text-xs font-bold text-outline uppercase tracking-wider mb-2 text-center">Pindahkan Status Ke:</h4>
                  <div className="grid grid-cols-3 gap-2">
                    
                    <button 
                      onClick={() => handleUpdateTaskStatus(selectedTask.id, 'Belum Mulai')}
                      className={`text-[10px] font-bold py-1.5 rounded transition-all ${
                        selectedTask.status === 'Belum Mulai' ? 'bg-[#3b608f] text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      Belum Mulai
                    </button>
                    
                    <button 
                      onClick={() => handleUpdateTaskStatus(selectedTask.id, 'Sedang Berjalan')}
                      className={`text-[10px] font-bold py-1.5 rounded transition-all ${
                        selectedTask.status === 'Sedang Berjalan' ? 'bg-[#3b608f] text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      Sedang Berjalan
                    </button>

                    <button 
                      onClick={() => handleUpdateTaskStatus(selectedTask.id, 'Pemeriksaan Akhir')}
                      className={`text-[10px] font-bold py-1.5 rounded transition-all ${
                        selectedTask.status === 'Pemeriksaan Akhir' ? 'bg-[#3b608f] text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      Pemeriksaan Akhir
                    </button>

                  </div>
                </div>

                <div className="flex justify-between items-center mt-6 pt-4 border-t gap-3">
                  <button 
                    onClick={() => handleDeleteTask(selectedTask.id)}
                    className="text-xs text-red-600 bg-red-50 hover:bg-red-100 font-bold px-3 py-2 rounded-xl border border-red-200 transition-colors flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Hapus
                  </button>

                  <button 
                    onClick={() => setSelectedTask(null)}
                    className="text-xs font-bold bg-white text-secondary-color px-5 py-2 rounded-xl shadow-neo-extruded hover:shadow hover:bg-slate-50 border border-slate-100"
                  >
                    Tutup
                  </button>
                </div>

              </div>
            </div>
          )}

        </main>
      </div>

      <footer className="w-full bg-white border-t border-outline-variant/10 py-6 text-center text-xs text-outline font-semibold select-none">
        Konsol ERP Nexus &copy; {new Date().getFullYear()}. Dibuat secara dinamis dengan standar Soft Operations Design.
      </footer>

    </div>
  );
}
