import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { MdSave, MdStorefront } from 'react-icons/md';
import * as settingsService from '../services/settingsService';
import { useCafe } from '../context/CafeContext';

const Settings = () => {
  const { darkMode, setDarkMode, setSettings: setGlobalSettings } = useCafe();
  const [form, setForm] = useState({ cafeName: '', gstPercent: 5, logoUrl: '', address: '', phone: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await settingsService.getSettings();
        setForm(res.data.data);
      } catch {
        toast.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await settingsService.updateSettings(form);
      setGlobalSettings(res.data.data);
      toast.success('Settings saved successfully');
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="card h-96 animate-pulse" />;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Settings</h1>
        <p className="text-sm text-gray-400 mt-1">Configure your cafe's preferences</p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-5">
        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-semibold">
          <MdStorefront size={19} /> Cafe Information
        </div>

        <div>
          <label className="label-text">Cafe Name</label>
          <input className="input-field" value={form.cafeName || ''} onChange={(e) => setForm({ ...form, cafeName: e.target.value })} placeholder="CafeFlow" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-text">GST Percentage (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              className="input-field"
              value={form.gstPercent ?? 5}
              onChange={(e) => setForm({ ...form, gstPercent: Number(e.target.value) })}
            />
          </div>
          <div>
            <label className="label-text">Phone Number</label>
            <input className="input-field" value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Cafe contact number" />
          </div>
        </div>

        <div>
          <label className="label-text">Address</label>
          <textarea rows={2} className="input-field resize-none" value={form.address || ''} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Cafe address" />
        </div>

        <div>
          <label className="label-text">Logo URL</label>
          <input className="input-field" value={form.logoUrl || ''} onChange={(e) => setForm({ ...form, logoUrl: e.target.value })} placeholder="https://example.com/logo.png" />
          <p className="text-xs text-gray-400 mt-1">Paste a hosted image URL to use as your cafe logo on invoices.</p>
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl bg-orange-light dark:bg-gray-800">
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Dark Mode</p>
            <p className="text-xs text-gray-400">Toggle the app's color theme</p>
          </div>
          <button
            type="button"
            onClick={() => setDarkMode(!darkMode)}
            className={`w-12 h-6.5 rounded-full p-0.5 transition-colors ${darkMode ? 'bg-orange-gradient' : 'bg-gray-300'}`}
          >
            <span className={`block w-5 h-5 rounded-full bg-white shadow transform transition-transform ${darkMode ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
        </div>

        <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 justify-center w-full">
          <MdSave size={18} /> {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
};

export default Settings;
