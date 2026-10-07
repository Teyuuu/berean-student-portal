import React, { useState, useEffect } from 'react';
import { api } from '@/lib/supabase';
import { AuditLog } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { History, Shield, Clock } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';

export const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await api.getAuditLogs();
      setLogs(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-blue-950 font-serif">
            Security & Administrative Audit Trail
          </h1>
          <p className="text-sm text-slate-500">
            Immutable log of system modifications, grade submissions, and enrollment decisions
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-semibold">Timestamp</th>
                  <th className="px-4 py-3 font-semibold">Staff / Admin User</th>
                  <th className="px-4 py-3 font-semibold">Action Triggered</th>
                  <th className="px-4 py-3 font-semibold">Target Entity</th>
                  <th className="px-4 py-3 font-semibold">Modification Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70">
                    <td className="px-4 py-3 text-slate-500 font-mono whitespace-nowrap">
                      {formatDateTime(log.created_at)}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-900">
                      <div>{log.user ? `${log.user.first_name} ${log.user.last_name}` : 'System Admin'}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{log.user_email || 'admin@berean.edu'}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-600 uppercase text-[11px]">
                      {log.entity}
                    </td>
                    <td className="px-4 py-3 max-w-sm">
                      <pre className="text-[10px] bg-slate-900 text-slate-200 p-2 rounded overflow-x-auto font-mono max-h-24">
                        {JSON.stringify(log.new_data || log.previous_data || {}, null, 2)}
                      </pre>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
