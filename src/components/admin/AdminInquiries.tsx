import React from 'react';
import { useStore } from '../../lib/store';
import { Phone, MessageCircle, Trash2, CheckCircle2, Clock, ShieldCheck, Mail } from 'lucide-react';

export const AdminInquiries: React.FC = () => {
  const { inquiries, updateInquiryStatus, deleteInquiry } = useStore();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            รายการลูกค้าติดต่อ / ผู้สนใจสมัครสมาชิก (Leads & Inquiries)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            ข้อมูลลูกค้าที่ส่งคำขอคำปรึกษา ขอรับโปรโมชั่น หรือสนใจสั่งซื้อสินค้าจากหน้าเว็บไซต์
          </p>
        </div>

        <div className="text-xs font-semibold text-slate-500">
          ทั้งหมด <span className="font-bold text-sky-600">{inquiries.length}</span> รายการ
        </div>
      </div>

      {/* Inquiries Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        {inquiries.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                  <th className="py-3.5 px-4">วันที่ / เวลา</th>
                  <th className="py-3.5 px-4">ชื่อลูกค้า</th>
                  <th className="py-3.5 px-4">เบอร์โทรศัพท์ / LINE</th>
                  <th className="py-3.5 px-4">รุ่นที่สนใจ</th>
                  <th className="py-3.5 px-4">รูปแบบ</th>
                  <th className="py-3.5 px-4">ข้อความเพิ่มเติม</th>
                  <th className="py-3.5 px-4">สถานะ</th>
                  <th className="py-3.5 px-4 text-right">ดำเนินการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {inquiries.map(inq => {
                  const dateStr = new Date(inq.created_at).toLocaleDateString('th-TH', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <tr key={inq.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                        {dateStr}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{inq.customer_name}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{inq.customer_phone}</div>
                        {inq.customer_line && (
                          <div className="text-[11px] text-emerald-600">LINE: {inq.customer_line}</div>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-sky-800">
                          {inq.product_name || 'ปรึกษาทั่วไป'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            inq.plan_type === 'subscription'
                              ? 'bg-sky-100 text-sky-700'
                              : inq.plan_type === 'outright'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {inq.plan_type === 'subscription'
                            ? 'รายเดือน'
                            : inq.plan_type === 'outright'
                            ? 'ซื้อขาด'
                            : 'ขอคำปรึกษา'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
                        <p className="text-slate-600 line-clamp-2">
                          {inq.message || '-'}
                        </p>
                      </td>

                      <td className="py-3.5 px-4">
                        <select
                          value={inq.status}
                          onChange={e =>
                            updateInquiryStatus(
                              inq.id,
                              e.target.value as 'new' | 'contacted' | 'closed'
                            )
                          }
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border focus:outline-none ${
                            inq.status === 'new'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : inq.status === 'contacted'
                              ? 'bg-sky-50 text-sky-700 border-sky-200'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}
                        >
                          <option value="new">ใหม่ (ยังไม่ติดต่อ)</option>
                          <option value="contacted">ติดต่อแล้ว</option>
                          <option value="closed">ปิดการขายสำเร็จ</option>
                        </select>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <a
                            href={`tel:${inq.customer_phone.replace(/[^0-9]/g, '')}`}
                            className="p-1.5 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 transition-colors"
                            title="โทรหาลูกค้า"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                          <button
                            onClick={async () => {
                              if (confirm('คุณต้องการลบรายการติดต่อนี้หรือไม่?')) {
                                await deleteInquiry(inq.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="ลบรายการ"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 text-slate-400 text-xs">
            ยังไม่มีข้อมูลลูกค้าติดต่อเข้ามา
          </div>
        )}
      </div>
    </div>
  );
};
