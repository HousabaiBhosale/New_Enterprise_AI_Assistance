import { useState, useEffect } from 'react';
import { FileBarChart, Download, FileSpreadsheet, Plus, RefreshCw, CheckCircle, Sparkles, FileText, BarChart3, TrendingUp, Users, ShieldCheck } from 'lucide-react';
import { reportService } from '../services/reportService';
import { useTheme } from '../context/ThemeContext';

export default function Reports() {
  const { isLight } = useTheme();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [notice, setNotice] = useState(null);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const data = await reportService.getReports();
      setReports(data);
    } catch (err) {
      console.error("Failed to load reports", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleGenerate = async (reportType, format = 'pdf') => {
    setGenerating(true);
    setNotice(null);
    try {
      const res = await reportService.generateReport(reportType, format);
      setNotice({ message: res.message });
      await fetchReports();
      setTimeout(() => setNotice(null), 4000);
    } catch (err) {
      alert(`Generation error: ${err.message}`);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Visual Header Banner */}
      <div style={{
        background: isLight 
          ? 'linear-gradient(135deg, rgba(255, 241, 242, 0.96) 0%, rgba(255, 245, 245, 0.94) 50%, rgba(240, 253, 250, 0.96) 100%), url("https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80") center/cover no-repeat'
          : 'linear-gradient(135deg, rgba(244, 63, 94, 0.25) 0%, rgba(99, 102, 241, 0.22) 50%, rgba(16, 185, 129, 0.15) 100%), url("https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80") center/cover no-repeat',
        borderRadius: 'var(--radius-lg)',
        border: isLight ? '1px solid rgba(244, 63, 94, 0.35)' : '1px solid rgba(244, 63, 94, 0.35)',
        padding: '2.2rem 2.5rem',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: isLight ? '0 16px 40px -10px rgba(15, 23, 42, 0.08)' : 'var(--panel-shadow)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem',
        transition: 'all 0.3s ease'
      }}>
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          background: isLight 
            ? 'linear-gradient(90deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.82) 60%, rgba(255, 255, 255, 0.45) 100%)' 
            : 'linear-gradient(90deg, rgba(2, 6, 23, 0.94) 0%, rgba(2, 6, 23, 0.82) 60%, rgba(2, 6, 23, 0.5) 100%)', 
          pointerEvents: 'none' 
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '640px' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.45rem', 
            padding: '0.35rem 0.85rem', 
            borderRadius: 'var(--radius-full)', 
            background: isLight ? 'rgba(244, 63, 94, 0.12)' : 'rgba(244, 63, 94, 0.2)', 
            border: isLight ? '1px solid rgba(244, 63, 94, 0.35)' : '1px solid rgba(244, 63, 94, 0.4)', 
            color: isLight ? '#e11d48' : '#fb7185', 
            fontSize: '0.8rem', 
            fontWeight: 700, 
            marginBottom: '0.75rem' 
          }}>
            <Sparkles size={14} color={isLight ? '#e11d48' : '#fb7185'} /> Executive BI & Export Engine
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.5rem', color: isLight ? '#0f172a' : '#fff', letterSpacing: '-0.5px' }}>
            Enterprise Reports & Exports
          </h1>
          <p style={{ color: isLight ? '#475569' : 'var(--text-sub)', fontSize: '0.96rem', lineHeight: 1.6, margin: 0 }}>
            Automated PDF executive briefings and Excel ledger exports compiled on-demand from validated organizational records.
          </p>
        </div>

        {/* Generate Actions */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => handleGenerate('sales', 'pdf')}
            disabled={generating}
            style={{ 
              background: 'linear-gradient(135deg, #e11d48 0%, #f43f5e 100%)', 
              color: 'white', 
              border: 'none', 
              padding: '0.75rem 1.25rem', 
              borderRadius: 'var(--radius-md)', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              fontWeight: 700, 
              cursor: generating ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 15px rgba(244, 63, 94, 0.35)'
            }}
            className="hover-lift"
          >
            {generating ? <RefreshCw size={16} className="animate-spin" /> : <Plus size={16} />} Sales PDF
          </button>

          <button
            onClick={() => handleGenerate('sales', 'xlsx')}
            disabled={generating}
            style={{ 
              background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', 
              color: 'white', 
              border: 'none', 
              padding: '0.75rem 1.25rem', 
              borderRadius: 'var(--radius-md)', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              fontWeight: 700, 
              cursor: generating ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 15px rgba(16, 185, 129, 0.35)'
            }}
            className="hover-lift"
          >
            {generating ? <RefreshCw size={16} className="animate-spin" /> : <FileSpreadsheet size={16} />} Sales Excel
          </button>

          <button
            onClick={() => handleGenerate('hr', 'pdf')}
            disabled={generating}
            style={{ 
              background: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)', 
              color: 'white', 
              border: 'none', 
              padding: '0.75rem 1.25rem', 
              borderRadius: 'var(--radius-md)', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              fontWeight: 700, 
              cursor: generating ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 15px rgba(139, 92, 246, 0.35)'
            }}
            className="hover-lift"
          >
            {generating ? <RefreshCw size={16} className="animate-spin" /> : <Users size={16} />} HR Workforce PDF
          </button>
        </div>
      </div>

      {notice && (
        <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#10b981', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <CheckCircle size={20} />
          <span style={{ fontWeight: 600 }}>{notice.message}</span>
        </div>
      )}

      {/* Reports Archive */}
      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <RefreshCw className="animate-spin" size={32} style={{ margin: '0 auto 1rem', color: '#f43f5e' }} />
          <p>Scanning enterprise reports archive...</p>
        </div>
      ) : reports.length === 0 ? (
        <div style={{ 
          padding: '4rem', 
          textAlign: 'center', 
          border: isLight ? '2px dashed rgba(203, 213, 225, 0.9)' : '2px dashed var(--border-color)', 
          borderRadius: 'var(--radius-lg)', 
          background: isLight ? 'rgba(241, 245, 249, 0.6)' : 'rgba(2, 6, 23, 0.2)' 
        }}>
          <FileBarChart size={48} color="#f43f5e" style={{ margin: '0 auto 1rem', opacity: 0.8 }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: isLight ? '#0f172a' : '#fff' }}>No Reports Generated Yet</h3>
          <p style={{ color: isLight ? '#64748b' : 'var(--text-sub)', maxWidth: '420px', margin: '0 auto 1.5rem' }}>Click one of the buttons above to generate a new live PDF briefing or Excel summary.</p>
          <button
            onClick={() => handleGenerate('sales', 'pdf')}
            style={{ background: '#f43f5e', color: 'white', border: 'none', padding: '0.7rem 1.4rem', borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 15px rgba(244, 63, 94, 0.3)' }}
          >
            Generate First Sales Report
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.25rem' }}>
          {reports.map((rep, i) => (
            <div key={i} style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1.25rem', boxShadow: 'var(--panel-shadow)' }} className="hover-lift">
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ width: 48, height: 48, minWidth: 48, background: rep.format === 'Excel' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)', border: `1px solid ${rep.format === 'Excel' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`, borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  {rep.format === 'Excel' ? (
                    <FileSpreadsheet size={24} color="#10b981" />
                  ) : (
                    <FileBarChart size={24} color="#f43f5e" />
                  )}
                </div>
                <div>
                  <h3 style={{ margin: '0 0 0.35rem 0', fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>{rep.title}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '4px', background: rep.format === 'Excel' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)', color: rep.format === 'Excel' ? '#34d399' : '#fb7185' }}>
                      {rep.format}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Size: {rep.size}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      • {rep.date}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--glass-border)' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {rep.filename}
                </span>
                <a
                  href={reportService.getDownloadUrl(rep.filename)}
                  download={rep.filename}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-main)',
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                  className="hover-lift"
                >
                  <Download size={15} /> Download
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
