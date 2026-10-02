import React, { useState } from 'react';
import {
  getCurrentSupabaseConfig,
  saveCustomSupabaseConfig,
  clearCustomSupabaseConfig,
  SUPABASE_SQL_SCHEMA,
  isSupabaseConfigured,
  getSupabase
} from '../../lib/supabase';
import { useStore } from '../../lib/store';
import {
  Database,
  Copy,
  Check,
  ShieldCheck,
  HardDrive,
  UploadCloud,
  ExternalLink,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

export const AdminSupabaseSetup: React.FC = () => {
  const currentConfig = getCurrentSupabaseConfig();
  const { products, categories, banners, settings, isSupabaseLive, showToast } = useStore();

  const [url, setUrl] = useState(currentConfig.url || '');
  const [anonKey, setAnonKey] = useState(currentConfig.key || '');
  const [copied, setCopied] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopied(true);
    showToast('คัดลอกคำสั่ง SQL Schema ทั้งหมดเรียบร้อยแล้ว', 'success');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || !anonKey.trim()) {
      showToast('กรุณากรอกทั้ง Supabase URL และ Anon Key', 'error');
      return;
    }
    saveCustomSupabaseConfig(url.trim(), anonKey.trim());
    showToast('บันทึกการเชื่อมต่อ Supabase เรียบร้อยแล้ว ระบบจะรีเฟรชหน้าเพื่อเชื่อมต่อฐานข้อมูล', 'success');
  };

  const handleResetConfig = () => {
    if (confirm('คุณต้องการรีเซ็ตการตั้งค่า Supabase กลับสู่ค่าเริ่มต้นหรือไม่?')) {
      clearCustomSupabaseConfig();
    }
  };

  // Seed current products/categories into Supabase
  const handleSeedSupabase = async () => {
    const sb = getSupabase();
    if (!sb) {
      showToast('กรุณากรอก Supabase URL และ Anon Key และรัน SQL ก่อนนำเข้าข้อมูล', 'error');
      return;
    }

    setIsSeeding(true);
    try {
      // 1. Categories
      for (const cat of categories) {
        await sb.from('categories').upsert([cat]);
      }
      // 2. Products
      for (const prod of products) {
        await sb.from('products').upsert([prod]);
      }
      // 3. Banners
      for (const b of banners) {
        await sb.from('banners').upsert([b]);
      }
      // 4. Site Settings
      await sb.from('site_settings').upsert([settings]);

      showToast('นำเข้าข้อมูลเริ่มต้น (Seed Data) ลงใน Supabase เรียบร้อยแล้ว!', 'success');
    } catch (err: any) {
      console.error('Seed error:', err);
      showToast('ไม่สามารถนำเข้าข้อมูลได้ โปรดตรวจสอบว่ารัน SQL ใน Supabase แล้วหรือยัง: ' + err.message, 'error');
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <Database className="w-6 h-6 text-sky-600" />
            <span>เชื่อมต่อ Supabase & คำสั่ง SQL Migration</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            คู่มือการตั้งค่า Supabase Database, Storage และ RLS สำหรับระบบ E-commerce พร้อมใช้งานจริง
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 ${
              isSupabaseLive
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${isSupabaseLive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}
            />
            {isSupabaseLive ? 'Supabase Live Connected' : 'Local Fallback Mode'}
          </span>
        </div>
      </div>

      {/* Supabase Connection Form */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
          1. ข้อมูลการเชื่อมต่อ Supabase (API Keys)
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          นำค่าจาก Supabase Dashboard ของคุณที่เมนู <strong>Project Settings &gt; API</strong> มากรอกที่นี่ หรือกำหนดไว้ในไฟล์ <code className="bg-slate-100 px-1 py-0.5 rounded text-sky-700">.env</code>:
        </p>

        <form onSubmit={handleSaveConfig} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Project URL (VITE_SUPABASE_URL)
            </label>
            <input
              type="url"
              required
              placeholder="https://xyzabcdefghijklm.supabase.co"
              value={url}
              onChange={e => setUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Anon Public API Key (VITE_SUPABASE_ANON_KEY)
            </label>
            <input
              type="text"
              required
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              value={anonKey}
              onChange={e => setAnonKey(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500 font-mono"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-md shadow-sky-600/20 transition-all active:scale-95"
            >
              บันทึกและเชื่อมต่อ Supabase
            </button>

            {currentConfig.source === 'localStorage' && (
              <button
                type="button"
                onClick={handleResetConfig}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium"
              >
                รีเซ็ตค่า
              </button>
            )}

            {isSupabaseConfigured && (
              <button
                type="button"
                onClick={handleSeedSupabase}
                disabled={isSeeding}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all active:scale-95 flex items-center gap-1.5 ml-auto"
              >
                <UploadCloud className="w-4 h-4" />
                <span>{isSeeding ? 'กำลังนำเข้า...' : 'นำเข้าสินค้าตัวอย่างลง Supabase'}</span>
              </button>
            )}
          </div>
        </form>
      </div>

      {/* SQL Migration Script Box */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              2. SQL Migration Script (สร้างตาราง, RLS และ Storage Bucket)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              คัดลอกคำสั่งด้านล่างไปวางใน Supabase Dashboard &gt; <strong>SQL Editor</strong> แล้วกด <strong>Run</strong>
            </p>
          </div>

          <button
            onClick={handleCopySql}
            className="px-4 py-2 rounded-xl bg-sky-50 text-sky-700 hover:bg-sky-100 font-bold text-xs flex items-center gap-1.5 transition-colors border border-sky-200 shrink-0"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'คัดลอกแล้ว!' : 'คัดลอกคำสั่ง SQL ทั้งหมด'}</span>
          </button>
        </div>

        <div className="relative">
          <pre className="p-4 bg-slate-950 text-slate-200 rounded-2xl text-[11px] font-mono overflow-x-auto max-h-96 leading-relaxed border border-slate-800">
            {SUPABASE_SQL_SCHEMA}
          </pre>
        </div>
      </div>

      {/* Setup Step-by-Step Guide */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
          3. ขั้นตอนการตั้งค่า Supabase ให้สมบูรณ์แบบ
        </h3>

        <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 font-bold flex items-center justify-center shrink-0">
              1
            </span>
            <div>
              <strong className="text-slate-900">สร้างโปรเจกต์ใหม่ใน Supabase:</strong> ไปที่{' '}
              <a
                href="https://supabase.com"
                target="_blank"
                rel="noreferrer"
                className="text-sky-600 underline font-semibold inline-flex items-center gap-0.5"
              >
                <span>supabase.com</span>
                <ExternalLink className="w-3 h-3" />
              </a>{' '}
              สมัครสมาชิกหรือเข้าสู่ระบบ แล้วกด Create New Project
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 font-bold flex items-center justify-center shrink-0">
              2
            </span>
            <div>
              <strong className="text-slate-900">รันคำสั่ง SQL สร้างตาราง:</strong> เข้าไปที่เมนู <strong>SQL Editor</strong> ในแถบด้านซ้าย นำโค้ดด้านบนไปวาง แล้วกดปุ่ม <strong>Run</strong> ระบบจะสร้างตาราง categories, products, banners, site_settings, inquiries, RLS policies และ Storage bucket ให้อัตโนมัติ
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 font-bold flex items-center justify-center shrink-0">
              3
            </span>
            <div>
              <strong className="text-slate-900">สร้างบัญชีผู้ดูแลระบบ (Admin User):</strong> ไปที่เมนู <strong>Authentication &gt; Users</strong> กด <strong>Add User &gt; Create User</strong> กรอกอีเมลและรหัสผ่าน จากนั้นคุณสามารถใช้อีเมลนั้นเข้าสู่ระบบ Admin หลังบ้านได้ทันที
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 font-bold flex items-center justify-center shrink-0">
              4
            </span>
            <div>
              <strong className="text-slate-900">ตรวจสอบ Storage Bucket:</strong> ไปที่เมนู <strong>Storage</strong> ตรวจสอบว่ามี bucket ชื่อ <code className="bg-slate-100 text-sky-700 px-1 py-0.5 rounded">coway-media</code> และตั้งค่าเป็น <strong>Public</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
