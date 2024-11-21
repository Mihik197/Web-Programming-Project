// src/pages/SettingsPage.jsx
import React, { useState } from 'react';
import { Save, User, Bell, Palette } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';

const SettingsPage = () => {
  const { token } = useAuth();
  const [settings, setSettings] = useState({
    profile: {
      username: 'johndoe',
      email: 'john@example.com',
      avatarUrl: null
    },
    preferences: {
      defaultView: 'calendar', // calendar, gallery, albums
      photosPerPage: 20,
      autoSaveNotes: true
    },
    notifications: {
      emailDigest: true,
      memoryNotifications: true,
      albumComments: true
    },
    appearance: {
      theme: 'light', // light, dark, system
      calendarStartDay: 'sunday', // sunday, monday
      timeFormat: '12h' // 12h, 24h
    }
  });

  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-600">Manage your account preferences and settings</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg">
        <div className="flex border-b">
          {/* Settings Tabs */}
          {['profile', 'preferences', 'notifications', 'appearance'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 text-sm font-medium capitalize transition-colors
                ${activeTab === tab 
                  ? 'border-b-2 border-blue-600 text-blue-600' 
                  : 'text-gray-600 hover:text-gray-900'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Profile Photo</label>
                <div className="mt-2 flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="w-8 h-8 text-gray-400" />
                  </div>
                  <button className="px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50">
                    Change Photo
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <input
                  type="text"
                  value={settings.profile.username}
                  onChange={(e) => setSettings({
                    ...settings,
                    profile: { ...settings.profile, username: e.target.value }
                  })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={settings.profile.email}
                  onChange={(e) => setSettings({
                    ...settings,
                    profile: { ...settings.profile, email: e.target.value }
                  })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {/* Preferences Settings */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Default View</label>
                <select
                  value={settings.preferences.defaultView}
                  onChange={(e) => setSettings({
                    ...settings,
                    preferences: { ...settings.preferences, defaultView: e.target.value }
                  })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="calendar">Calendar</option>
                  <option value="gallery">Gallery</option>
                  <option value="albums">Albums</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Photos Per Page</label>
                <input
                  type="number"
                  min="10"
                  max="100"
                  value={settings.preferences.photosPerPage}
                  onChange={(e) => setSettings({
                    ...settings,
                    preferences: { ...settings.preferences, photosPerPage: parseInt(e.target.value) }
                  })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="autoSave"
                  checked={settings.preferences.autoSaveNotes}
                  onChange={(e) => setSettings({
                    ...settings,
                    preferences: { ...settings.preferences, autoSaveNotes: e.target.checked }
                  })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="autoSave" className="ml-2 text-sm text-gray-700">
                  Auto-save notes while typing
                </label>
              </div>
            </div>
          )}

          {/* Notifications Settings */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              {Object.entries(settings.notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <p className="text-sm text-gray-500">
                      Receive notifications for {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </p>
                  </div>
                  <div className="ml-4">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, [key]: e.target.checked }
                      })}
                      className="h-6 w-11 relative inline-flex items-center rounded-full transition-colors 
                               focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      role="switch"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Appearance Settings */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Theme</label>
                <select
                  value={settings.appearance.theme}
                  onChange={(e) => setSettings({
                    ...settings,
                    appearance: { ...settings.appearance, theme: e.target.value }
                  })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Calendar Start Day</label>
                <select
                  value={settings.appearance.calendarStartDay}
                  onChange={(e) => setSettings({
                    ...settings,
                    appearance: { ...settings.appearance, calendarStartDay: e.target.value }
                  })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="sunday">Sunday</option>
                  <option value="monday">Monday</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Time Format</label>
                <select
                  value={settings.appearance.timeFormat}
                  onChange={(e) => setSettings({
                    ...settings,
                    appearance: { ...settings.appearance, timeFormat: e.target.value }
                  })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="12h">12-hour</option>
                  <option value="24h">24-hour</option>
                </select>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;