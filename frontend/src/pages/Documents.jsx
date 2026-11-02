import { useState, useEffect, useRef } from 'react';
import { 
  FolderOpen, Search, Upload, Trash2, CheckCircle2, FileText, 
  Database, RefreshCw, Sparkles, Plus, Eye, BookOpen, Layers, 
  X, Cpu, ArrowRight, ShieldCheck, Zap, HelpCircle, FileCheck
} from 'lucide-react';
import { documentService } from '../services/documentService';
import { useTheme } from '../context/ThemeContext';

// Built-in starter templates for realistic corporate knowledge bases
const KNOWLEDGE_TEMPLATES = [
  {
    name: 'HR Remote & Leave Policy',
    category: 'HR',
    title: 'Remote Work & Special Leave Framework',
    filename: 'hr_remote_special_leave.md',
    content: `# Remote Work & Special Leave Framework

## 1. Remote Work Stipend & Equipment
- All eligible full-time employees receive a one-time remote setup stipend of $1,000 for ergonomic desk, chair, and monitor equipment.
- High-speed internet reimbursement of up to $75/month is provided via monthly expense reports.
- Core hours for hybrid and remote staff are 10:00 AM to 4:00 PM local time.

## 2. Compassionate & Bereavement Leave
- Up to 5 consecutive paid days for immediate family members (spouse, child, parent, sibling).
- Up to 3 paid days for extended family members (grandparents, in-laws).
- Requests do not require standard 7-day advance notice; immediate manager notification is sufficient.

## 3. Study & Professional Development Leave
- Employees with over 1 year of tenure are granted 4 paid days annually for attending professional conferences or examinations.
- Requires approval from the Department VP 14 days prior to the event.`
  },
  {
    name: 'Sales Pricing & Discount Matrix',
    category: 'Sales',
    title: 'Commercial Pricing & Discount SOP',
    filename: 'sales_commercial_pricing.md',
    content: `# Commercial Pricing & Discount SOP

## 1. Standard Enterprise Pricing Tiers
- Tier 1 (1 - 50 Seats): $49/seat/month billed annually.
- Tier 2 (51 - 250 Seats): $39/seat/month billed annually with dedicated customer success manager.
- Tier 3 (250+ Seats): Custom enterprise agreement starting at $29/seat/month.

## 2. Sales Representative Discount Authorities
- Standard Sales Reps can authorize discounts up to 10% autonomously.
- Senior Account Executives can authorize discounts up to 18%.
- Any discount between 19% and 30% requires Sales Director sign-off via the HITL approval system.
- Discounts exceeding 30% require Chief Commercial Officer (CCO) approval.

## 3. Multi-Year Contract Incentives
- 2-year contract commitment: Additional 5% discount across all tiers.
- 3-year contract commitment: Additional 10% discount plus complimentary enterprise onboarding package.`
  },
  {
    name: 'IT Helpdesk Incident & SLA Guide',
    category: 'Support',
    title: 'IT Incident Triage & SLA Guidelines',
    filename: 'support_incident_sla_guide.md',
    content: `# IT Incident Triage & SLA Guidelines

## 1. Incident Severity Definitions
- Severity 1 (Critical Outage): Complete outage of customer-facing production services. 24/7 immediate mobilization. SLA response: < 15 minutes.
- Severity 2 (Major Degradation): High-impact service disruption without total system failure. SLA response: < 1 hour.
- Severity 3 (Moderate Issue): Workaround available; standard business operations unaffected. SLA response: < 4 hours.
- Severity 4 (General Request): Questions, configuration requests, and user provisioning. SLA response: < 24 hours.

## 2. Automated Escalation Protocols
- If a Severity 1 incident remains unresolved for 60 minutes, it automatically escalates to the VP of Engineering and Lead Incident Commander.
- Customer support agents must send status updates to affected enterprise clients every 30 minutes during active Sev-1 events.

## 3. Hardware Replacement SLA
- Critical employee laptop failures: Replacement hardware dispatched within 24 hours for remote staff.`
  },
  {
    name: 'Information Security & Compliance',
    category: 'Compliance',
    title: 'Enterprise Information Security Policy',
    filename: 'compliance_infosec_policy.md',
    content: `# Enterprise Information Security Policy

## 1. Access Control & Multi-Factor Authentication
- Mandatory MFA (Hardware token or Authenticator app) required for all internal SSO portals, VPNs, and production databases.
- Passwords must be at least 14 characters with complex character sets and rotated every 90 days.
- Inactive user accounts are automatically suspended after 30 days of inactivity.

## 2. Data Classification & Confidentiality
- Confidential / Restricted Data: Employee PII, financial ledgers, customer credit card records, and raw vector store credentials.
- Internal Data: Architecture diagrams, company handbook, and standard operating procedures.
- Data retention: Audit logs and transaction receipts must be archived in encrypted immutable storage for 7 years.

## 3. Clean Desk & Screen Locking Policy
- Workstations must automatically lock after 5 minutes of inactivity.
- Physical documents containing sensitive customer or employee details must be shredded immediately after processing.`
  }
];

export default function Documents() {
  const { isLight } = useTheme();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [uploadNotice, setUploadNotice] = useState(null);

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [creationTab, setCreationTab] = useState('editor'); // 'editor' | 'upload'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ingestionStep, setIngestionStep] = useState(0);

  // Form State for Direct Editor
  const [docTitle, setDocTitle] = useState('');
  const [docCategory, setDocCategory] = useState('HR');
  const [docFilename, setDocFilename] = useState('');
  const [docContent, setDocContent] = useState('');

  // Form State for File Upload
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadCategory, setUploadCategory] = useState('General');
  const fileInputRef = useRef(null);

  // Document Content Preview Modal State
  const [previewDoc, setPreviewDoc] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewViewMode, setPreviewViewMode] = useState('reader'); // 'reader' | 'chunks'

  // RAG Semantic Search Playground State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchingRAG, setIsSearchingRAG] = useState(false);
  const [ragResults, setRagResults] = useState(null);

  const fetchDocs = async () => {
    setLoading(true);
    try {
      const data = await documentService.getDocuments();
      setDocuments(data);
    } catch (err) {
      console.error("Failed to load documents", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleApplyTemplate = (tpl) => {
    setDocTitle(tpl.title);
    setDocCategory(tpl.category);
    setDocFilename(tpl.filename);
    setDocContent(tpl.content);
  };

  // Direct Editor Creation
  const handleCreateDocument = async (e) => {
    e?.preventDefault();
    if (!docTitle.trim() || !docContent.trim()) {
      alert("Please provide both a Title and Document Content.");
      return;
    }

    setIsSubmitting(true);
    setIngestionStep(1); // Parsing structure

    setTimeout(async () => {
      setIngestionStep(2); // Computing 384-d embeddings
      
      try {
        const payload = {
          title: docTitle.trim(),
          category: docCategory,
          filename: docFilename.trim() || undefined,
          content: docContent.trim()
        };

        const res = await documentService.createDocument(payload);
        setIngestionStep(3); // Upserting to Qdrant

        setTimeout(() => {
          setUploadNotice({ 
            type: 'success', 
            message: `Successfully created '${res.title}' with ${res.chunks_indexed} vectorized chunks in Qdrant.` 
          });
          setIsCreateModalOpen(false);
          // Reset form
          setDocTitle('');
          setDocFilename('');
          setDocContent('');
          setIsSubmitting(false);
          setIngestionStep(0);
          fetchDocs();
        }, 600);

      } catch (err) {
        console.error("Creation error:", err);
        setUploadNotice({ type: 'error', message: `Knowledge Base creation failed: ${err.message}` });
        setIsSubmitting(false);
        setIngestionStep(0);
      }
    }, 400);
  };

  // File Upload Ingestion
  const handleUploadSubmit = async (e) => {
    e?.preventDefault();
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }

    setIsSubmitting(true);
    setIngestionStep(1);

    try {
      setIngestionStep(2);
      const res = await documentService.uploadDocument(selectedFile, uploadCategory);
      setIngestionStep(3);
      
      setTimeout(() => {
        setUploadNotice({ 
          type: 'success', 
          message: `Indexed '${selectedFile.name}' into Qdrant (${res.chunks_indexed} vectorized chunks).` 
        });
        setIsCreateModalOpen(false);
        setSelectedFile(null);
        setIsSubmitting(false);
        setIngestionStep(0);
        fetchDocs();
      }, 500);
    } catch (err) {
      console.error("Upload error:", err);
      setUploadNotice({ type: 'error', message: `Upload failed: ${err.message}` });
      setIsSubmitting(false);
      setIngestionStep(0);
    }
  };

  const handleDelete = async (docId, filename) => {
    if (!window.confirm(`Are you sure you want to remove '${filename}' from the Qdrant knowledge base? All associated vector embeddings will be purged.`)) return;
    try {
      await documentService.deleteDocument(docId);
      setDocuments(prev => prev.filter(d => d.id !== docId));
      setUploadNotice({ type: 'success', message: `Document '${filename}' and its vector embeddings removed.` });
    } catch (err) {
      alert(`Delete error: ${err.message}`);
    }
  };

  const handleOpenPreview = async (doc) => {
    setPreviewLoading(true);
    setPreviewViewMode('reader');
    setPreviewDoc(doc);
    try {
      const fullDoc = await documentService.getDocumentContent(doc.id);
      setPreviewDoc(fullDoc);
    } catch (err) {
      console.error("Failed to load document content:", err);
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleRunRAGSearch = async (overrideQuery) => {
    const query = overrideQuery || searchQuery;
    if (!query.trim()) return;

    if (overrideQuery) setSearchQuery(overrideQuery);
    setIsSearchingRAG(true);
    setRagResults(null);

    try {
      const res = await documentService.searchDocuments(
        query.trim(), 
        selectedCategory === 'All' ? null : selectedCategory,
        3
      );
      setRagResults(res);
    } catch (err) {
      console.error("RAG search failed:", err);
      setRagResults({ error: err.message, results: [] });
    } finally {
      setIsSearchingRAG(false);
    }
  };

  // Filter documents
  const filteredDocs = documents.filter(doc => {
    const matchesSearch = 
      doc.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.filename?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.category?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || doc.category?.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const getDocThumb = (category) => {
    const cat = (category || '').toLowerCase();
    if (cat.includes('hr')) return 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80';
    if (cat.includes('sales')) return 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=80';
    if (cat.includes('support')) return 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80';
    if (cat.includes('compliance')) return 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80';
    return 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80';
  };

  // Metrics summary
  const totalChunks = documents.reduce((acc, d) => acc + (d.chunks || 0), 0);
  const categoriesList = ['All', 'HR', 'Sales', 'Support', 'Compliance'];

  // Estimate chunks in editor
  const estimatedChunks = Math.max(1, (docContent.split('\n## ').length || 1));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', height: '100%', paddingBottom: '3rem' }}>
      
      {/* Visual Header Banner */}
      <div style={{
        background: isLight 
          ? 'linear-gradient(135deg, rgba(240, 253, 250, 0.96) 0%, rgba(236, 253, 245, 0.94) 50%, rgba(238, 242, 255, 0.96) 100%), url("https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80") center/cover no-repeat'
          : 'linear-gradient(135deg, rgba(20, 184, 166, 0.28) 0%, rgba(13, 148, 136, 0.22) 50%, rgba(99, 102, 241, 0.18) 100%), url("https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80") center/cover no-repeat',
        borderRadius: 'var(--radius-lg)',
        border: isLight ? '1px solid rgba(20, 184, 166, 0.35)' : '1px solid rgba(20, 184, 166, 0.35)',
        padding: '2.4rem 2.8rem',
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
            gap: '0.5rem', 
            padding: '0.35rem 0.85rem', 
            borderRadius: 'var(--radius-full)', 
            background: isLight ? 'rgba(20, 184, 166, 0.12)' : 'rgba(20, 184, 166, 0.22)', 
            border: isLight ? '1px solid rgba(20, 184, 166, 0.35)' : '1px solid rgba(20, 184, 166, 0.45)', 
            color: isLight ? '#0d9488' : '#2dd4bf', 
            fontSize: '0.82rem', 
            fontWeight: 700, 
            marginBottom: '0.85rem' 
          }}>
            <Sparkles size={14} color={isLight ? '#0d9488' : '#2dd4bf'} /> Qdrant Semantic Vector Knowledge Base
          </div>
          <h1 style={{ fontSize: '2.3rem', fontWeight: '800', marginBottom: '0.5rem', color: isLight ? '#0f172a' : '#fff', letterSpacing: '-0.5px' }}>
            Enterprise Knowledge Base (RAG)
          </h1>
          <p style={{ color: isLight ? '#475569' : 'var(--text-sub)', fontSize: '0.96rem', lineHeight: 1.6, margin: 0 }}>
            Official company documentation, employee policies, commercial sales playbooks, and support triage SOPs vectorized for real-time agent retrieval without hallucinations.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: '0.85rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => {
              setCreationTab('editor');
              setIsCreateModalOpen(true);
            }}
            style={{ 
              background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)', 
              color: 'white', 
              border: '1px solid rgba(45, 212, 191, 0.4)', 
              padding: '0.85rem 1.4rem', 
              borderRadius: 'var(--radius-md)', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.6rem', 
              fontWeight: 700, 
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(20, 184, 166, 0.35)'
            }}
            className="hover-lift"
          >
            <Plus size={18} />
            Add Knowledge Base
          </button>

          <button
            onClick={() => {
              setCreationTab('upload');
              setIsCreateModalOpen(true);
            }}
            style={{ 
              background: 'rgba(255, 255, 255, 0.08)', 
              color: '#e2e8f0', 
              border: '1px solid var(--border-color)', 
              padding: '0.85rem 1.2rem', 
              borderRadius: 'var(--radius-md)', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              fontWeight: 600, 
              cursor: 'pointer' 
            }}
            className="hover-lift"
          >
            <Upload size={17} />
            Upload File
          </button>
        </div>
      </div>

      {/* Enterprise RAG Infrastructure Metrics Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <div style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.2rem 1.4rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(20, 184, 166, 0.15)', border: '1px solid rgba(20, 184, 166, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2dd4bf' }}>
            <BookOpen size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>Active Knowledge Collections</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>{documents.length} Databases</div>
          </div>
        </div>

        <div style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.2rem 1.4rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8' }}>
            <Layers size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>Vectorized Chunks in Qdrant</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#818cf8' }}>{totalChunks} Chunks</div>
          </div>
        </div>

        <div style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.2rem 1.4rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(234, 179, 8, 0.15)', border: '1px solid rgba(234, 179, 8, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#facc15' }}>
            <Cpu size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>Embedding Engine</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>BAAI / 384-d Cosine</div>
          </div>
        </div>

        <div style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.2rem 1.4rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399' }}>
            <Database size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>Vector Index Status</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#34d399' }}>Connected (Port 6333)</div>
          </div>
        </div>
      </div>

      {uploadNotice && (
        <div style={{
          background: uploadNotice.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
          border: `1px solid ${uploadNotice.type === 'success' ? '#10b981' : '#ef4444'}`,
          color: uploadNotice.type === 'success' ? '#10b981' : '#ef4444',
          padding: '1rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <CheckCircle2 size={20} />
            <span style={{ fontSize: '0.95rem' }}>{uploadNotice.message}</span>
          </div>
          <button 
            onClick={() => setUploadNotice(null)}
            style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', opacity: 0.8 }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Filter Toolbar & Department Badges */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {categoriesList.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                background: selectedCategory === cat ? 'rgba(20, 184, 166, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                border: `1px solid ${selectedCategory === cat ? '#14b8a6' : 'var(--border-color)'}`,
                color: selectedCategory === cat ? '#2dd4bf' : 'var(--text-sub)',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {cat === 'All' ? 'All Knowledge Bases' : `${cat} Department`}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search policies or playbooks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              background: isLight ? '#ffffff' : 'rgba(2, 6, 23, 0.85)',
              border: isLight ? '1px solid rgba(203, 213, 225, 0.9)' : '1px solid var(--border-color)',
              padding: '0.65rem 1rem 0.65rem 2.6rem',
              borderRadius: 'var(--radius-md)',
              color: isLight ? '#0f172a' : 'white',
              fontSize: '0.9rem',
              boxShadow: isLight ? '0 1px 3px rgba(15, 23, 42, 0.05)' : 'none'
            }}
          />
        </div>
      </div>

      {/* Documents Grid */}
      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <RefreshCw className="animate-spin" size={34} style={{ margin: '0 auto 1rem', color: '#14b8a6' }} />
          <p style={{ fontSize: '1rem' }}>Querying Qdrant vector index and knowledge documents...</p>
        </div>
      ) : filteredDocs.length === 0 ? (
        <div style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          border: isLight ? '2px dashed rgba(203, 213, 225, 0.9)' : '2px dashed var(--border-color)', 
          borderRadius: 'var(--radius-lg)', 
          background: isLight ? 'rgba(241, 245, 249, 0.6)' : 'rgba(2, 6, 23, 0.2)', 
          padding: '3.5rem', 
          textAlign: 'center' 
        }}>
          <FolderOpen size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.5, color: '#14b8a6' }} />
          <h2 style={{ fontSize: '1.25rem', color: isLight ? '#0f172a' : 'var(--text-main)', marginBottom: '0.5rem' }}>No Knowledge Bases Found</h2>
          <p style={{ maxWidth: '480px', color: isLight ? '#64748b' : 'var(--text-sub)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            No documents matched your criteria. Add a new company policy, sales guide, or support SOP to empower the autonomous multi-agent copilot.
          </p>
          <button
            onClick={() => {
              setCreationTab('editor');
              setIsCreateModalOpen(true);
            }}
            style={{ background: '#14b8a6', color: 'white', border: 'none', padding: '0.75rem 1.3rem', borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 15px rgba(20, 184, 166, 0.3)' }}
          >
            <Plus size={16} /> Create Knowledge Base Now
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {filteredDocs.map((doc) => (
            <div key={doc.id} style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--panel-shadow)', display: 'flex', flexDirection: 'column' }} className="hover-lift">
              <div style={{ height: '120px', position: 'relative', overflow: 'hidden' }}>
                <img 
                  src={getDocThumb(doc.category)} 
                  alt={doc.category} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <div style={{ position: 'absolute', inset: 0, background: isLight ? 'linear-gradient(180deg, transparent 35%, rgba(255, 255, 255, 0.92) 100%)' : 'linear-gradient(180deg, rgba(2, 6, 23, 0.2) 0%, rgba(2, 6, 23, 0.92) 100%)' }} />
                <span style={{ position: 'absolute', top: '10px', left: '12px', padding: '0.25rem 0.7rem', borderRadius: '12px', background: isLight ? '#ffffff' : 'rgba(2, 6, 23, 0.85)', border: isLight ? '1px solid rgba(226, 232, 240, 0.9)' : '1px solid rgba(255,255,255,0.18)', fontSize: '0.74rem', fontWeight: 600, color: isLight ? '#0f172a' : '#fff', display: 'flex', alignItems: 'center', gap: '0.35rem', boxShadow: isLight ? '0 2px 6px rgba(15, 23, 42, 0.08)' : 'none' }}>
                  <ShieldCheck size={13} color="#2dd4bf" /> {doc.category} Department
                </span>
                <span style={{ position: 'absolute', bottom: '10px', right: '12px', padding: '0.25rem 0.65rem', borderRadius: '8px', background: 'rgba(20, 184, 166, 0.95)', fontSize: '0.74rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Layers size={13} /> {doc.chunks} Embeddings
                </span>
              </div>

              <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.35rem 0', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.3 }}>{doc.title || doc.filename}</h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Source file: {doc.filename}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', background: 'rgba(255,255,255,0.02)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)' }}>Vector Distance</span>
                    <strong style={{ color: '#2dd4bf', fontSize: '0.85rem' }}>Cosine (384-d)</strong>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)' }}>Document Size</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 600 }}>{doc.file_size}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.65rem', borderTop: '1px solid var(--glass-border)' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Indexed: {doc.uploaded_at}</span>
                  
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleOpenPreview(doc)}
                      style={{ background: 'rgba(20, 184, 166, 0.15)', border: '1px solid rgba(20, 184, 166, 0.3)', color: '#2dd4bf', padding: '0.45rem 0.75rem', cursor: 'pointer', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', fontWeight: 600 }}
                      title="Inspect Document & Vector Chunks"
                    >
                      <Eye size={15} /> Inspect
                    </button>
                    <button
                      onClick={() => handleDelete(doc.id, doc.filename)}
                      style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)', color: '#ef4444', padding: '0.45rem 0.6rem', cursor: 'pointer', borderRadius: '6px' }}
                      title="Purge from Qdrant"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Realistic Interactive RAG Semantic Search Playground */}
      <div style={{
        marginTop: '1rem',
        background: isLight ? '#f8fafc' : 'rgba(2, 6, 23, 0.6)',
        border: isLight ? '1px solid rgba(99, 102, 241, 0.25)' : '1px solid rgba(99, 102, 241, 0.35)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.8rem 2rem',
        boxShadow: isLight ? '0 10px 30px -5px rgba(15, 23, 42, 0.05)' : 'var(--panel-shadow)',
        position: 'relative'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', background: isLight ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.2)', border: isLight ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid rgba(99, 102, 241, 0.4)', color: isLight ? '#4f46e5' : '#a5b4fc', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              <Zap size={13} color={isLight ? '#4f46e5' : '#a5b4fc'} /> Live RAG Retrieval Tester
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: isLight ? '#0f172a' : '#fff' }}>
              Test Semantic Vector Search Against Qdrant
            </h3>
            <p style={{ margin: '0.35rem 0 0 0', color: isLight ? '#475569' : 'var(--text-sub)', fontSize: '0.88rem' }}>
              Query the dense vector index to see how our RAG engine retrieves exact paragraphs and scores similarity before passing context to the LLM.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {[
              { label: '"Sick leave policy"', query: "What are the rules for sick leave?" },
              { label: '"Sales discount rules"', query: "What is the discount threshold for sales?" },
              { label: '"Critical ticket SLA"', query: "What is the response SLA for critical tickets?" }
            ].map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleRunRAGSearch(chip.query)}
                style={{ 
                  background: isLight ? '#ffffff' : 'rgba(255,255,255,0.05)', 
                  border: isLight ? '1px solid rgba(203, 213, 225, 0.9)' : '1px solid var(--border-color)', 
                  color: isLight ? '#0f172a' : '#e2e8f0', 
                  padding: '0.4rem 0.8rem', 
                  borderRadius: 'var(--radius-md)', 
                  fontSize: '0.78rem', 
                  cursor: 'pointer',
                  fontWeight: 600,
                  boxShadow: isLight ? '0 1px 3px rgba(15, 23, 42, 0.04)' : 'none'
                }}
                className="hover-lift"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
          <input
            type="text"
            placeholder="Type any question to test semantic retrieval (e.g., 'Can I work from home 3 days a week?')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleRunRAGSearch(); }}
            style={{
              flex: 1,
              background: isLight ? '#ffffff' : 'rgba(15, 23, 42, 0.9)',
              border: isLight ? '1px solid rgba(203, 213, 225, 0.9)' : '1px solid rgba(99, 102, 241, 0.4)',
              padding: '0.85rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              color: isLight ? '#0f172a' : 'white',
              fontSize: '0.95rem',
              boxShadow: isLight ? '0 1px 3px rgba(15, 23, 42, 0.04)' : 'none'
            }}
          />
          <button
            onClick={() => handleRunRAGSearch()}
            disabled={isSearchingRAG || !searchQuery.trim()}
            style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              color: 'white',
              border: 'none',
              padding: '0.85rem 1.6rem',
              borderRadius: 'var(--radius-md)',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: (isSearchingRAG || !searchQuery.trim()) ? 'not-allowed' : 'pointer',
              opacity: (isSearchingRAG || !searchQuery.trim()) ? 0.6 : 1,
              boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)'
            }}
            className="hover-lift"
          >
            {isSearchingRAG ? <RefreshCw size={17} className="animate-spin" /> : <Search size={17} />}
            {isSearchingRAG ? 'Vector Searching...' : 'Run Vector Search'}
          </button>
        </div>

        {/* RAG Search Results */}
        {ragResults && (
          <div style={{ marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.85rem', color: '#a5b4fc', fontWeight: 600 }}>
                Retrieved {ragResults.matches_count || ragResults.results?.length || 0} Vector Matches from Qdrant:
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Query: "{ragResults.query}"
              </span>
            </div>

            {(!ragResults.results || ragResults.results.length === 0) ? (
              <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                No semantic matches found above the confidence threshold.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {ragResults.results.map((hit, idx) => (
                  <div key={idx} style={{ 
                    background: isLight ? '#ffffff' : 'rgba(15, 23, 42, 0.75)', 
                    border: isLight ? '1px solid rgba(226, 232, 240, 0.9)' : '1px solid rgba(99, 102, 241, 0.25)', 
                    borderRadius: 'var(--radius-md)', 
                    padding: '1.1rem 1.25rem',
                    boxShadow: isLight ? '0 1px 3px rgba(15, 23, 42, 0.05)' : 'none'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ background: '#4f46e5', color: '#fff', fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.55rem', borderRadius: '4px' }}>
                          Match #{idx + 1}
                        </span>
                        <strong style={{ fontSize: '0.92rem', color: isLight ? '#0f172a' : '#fff' }}>{hit.title}</strong>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>({hit.source})</span>
                      </div>
                      <span style={{ background: isLight ? 'rgba(16, 185, 129, 0.12)' : 'rgba(16, 185, 129, 0.2)', border: isLight ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(16, 185, 129, 0.4)', color: isLight ? '#047857' : '#34d399', fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)' }}>
                        Cosine Similarity: {hit.score}%
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.88rem', color: isLight ? '#334155' : 'var(--text-sub)', whiteSpace: 'pre-wrap', lineHeight: 1.5, background: isLight ? '#f1f5f9' : 'rgba(2, 6, 23, 0.4)', padding: '0.75rem 1rem', borderRadius: '6px', borderLeft: '3px solid #6366f1' }}>
                      {hit.text}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* REALISTIC MODAL: ADD NEW KNOWLEDGE BASE                  */}
      {/* ======================================================== */}
      {isCreateModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: isLight ? 'rgba(15, 23, 42, 0.45)' : 'rgba(2, 6, 23, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1.5rem'
        }}>
          <div style={{
            background: isLight ? '#ffffff' : '#0b1329',
            border: isLight ? '1px solid rgba(203, 213, 225, 0.9)' : '1px solid rgba(20, 184, 166, 0.4)',
            borderRadius: 'var(--radius-lg)',
            width: '100%',
            maxWidth: '820px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: isLight ? '0 25px 50px -12px rgba(15, 23, 42, 0.2)' : '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
          }}>
            {/* Modal Header */}
            <div style={{ padding: '1.5rem 1.8rem', borderBottom: isLight ? '1px solid rgba(226, 232, 240, 0.9)' : '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: isLight ? '#f8fafc' : 'rgba(15, 23, 42, 0.6)' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: isLight ? '#0d9488' : '#2dd4bf', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                  <Sparkles size={14} /> Knowledge Ingestion Pipeline
                </div>
                <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: isLight ? '#0f172a' : '#fff' }}>
                  Add New Knowledge Base
                </h2>
              </div>
              <button
                onClick={() => !isSubmitting && setIsCreateModalOpen(false)}
                disabled={isSubmitting}
                style={{ background: 'transparent', border: 'none', color: isLight ? '#64748b' : 'var(--text-muted)', cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Ingestion Tabs */}
            <div style={{ display: 'flex', borderBottom: isLight ? '1px solid rgba(226, 232, 240, 0.9)' : '1px solid var(--border-color)', background: isLight ? '#f1f5f9' : 'rgba(2, 6, 23, 0.4)' }}>
              <button
                onClick={() => setCreationTab('editor')}
                style={{
                  flex: 1,
                  padding: '0.9rem',
                  background: creationTab === 'editor' ? (isLight ? '#ffffff' : 'rgba(20, 184, 166, 0.15)') : 'transparent',
                  border: 'none',
                  borderBottom: `2px solid ${creationTab === 'editor' ? '#14b8a6' : 'transparent'}`,
                  color: creationTab === 'editor' ? (isLight ? '#0d9488' : '#2dd4bf') : (isLight ? '#64748b' : 'var(--text-sub)'),
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <FileText size={17} /> Direct Markdown / Policy Editor
              </button>

              <button
                onClick={() => setCreationTab('upload')}
                style={{
                  flex: 1,
                  padding: '0.9rem',
                  background: creationTab === 'upload' ? (isLight ? '#ffffff' : 'rgba(20, 184, 166, 0.15)') : 'transparent',
                  border: 'none',
                  borderBottom: `2px solid ${creationTab === 'upload' ? '#14b8a6' : 'transparent'}`,
                  color: creationTab === 'upload' ? (isLight ? '#0d9488' : '#2dd4bf') : (isLight ? '#64748b' : 'var(--text-sub)'),
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <Upload size={17} /> Upload Document File (.md, .txt, .pdf, .csv)
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1.8rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* Quick Template Selector */}
              {creationTab === 'editor' && (
                <div>
                  <span style={{ fontSize: '0.8rem', color: isLight ? '#64748b' : 'var(--text-muted)', display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                    ⚡ Quick Load Corporate Policy Templates:
                  </span>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {KNOWLEDGE_TEMPLATES.map((tpl, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleApplyTemplate(tpl)}
                        style={{
                          background: isLight ? '#ffffff' : 'rgba(255, 255, 255, 0.05)',
                          border: isLight ? '1px solid rgba(203, 213, 225, 0.9)' : '1px solid rgba(255, 255, 255, 0.12)',
                          color: isLight ? '#0f172a' : '#e2e8f0',
                          padding: '0.35rem 0.75rem',
                          borderRadius: 'var(--radius-md)',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          boxShadow: isLight ? '0 1px 3px rgba(15, 23, 42, 0.04)' : 'none'
                        }}
                        className="hover-lift"
                      >
                        <FileCheck size={13} color="#2dd4bf" /> {tpl.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {creationTab === 'editor' ? (
                <form id="create-kb-form" onSubmit={handleCreateDocument} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', color: isLight ? '#475569' : 'var(--text-sub)', marginBottom: '0.4rem', fontWeight: 600 }}>
                        Knowledge Base Title *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Global Employee Remote Work Guidelines"
                        value={docTitle}
                        onChange={(e) => setDocTitle(e.target.value)}
                        required
                        style={{
                          width: '100%',
                          background: isLight ? '#ffffff' : 'rgba(2, 6, 23, 0.75)',
                          border: isLight ? '1px solid rgba(203, 213, 225, 0.9)' : '1px solid var(--border-color)',
                          padding: '0.75rem 1rem',
                          borderRadius: 'var(--radius-md)',
                          color: isLight ? '#0f172a' : 'white',
                          fontSize: '0.9rem'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', color: isLight ? '#475569' : 'var(--text-sub)', marginBottom: '0.4rem', fontWeight: 600 }}>
                        Department / Category *
                      </label>
                      <select
                        value={docCategory}
                        onChange={(e) => setDocCategory(e.target.value)}
                        style={{
                          width: '100%',
                          background: isLight ? '#ffffff' : 'rgba(2, 6, 23, 0.9)',
                          border: isLight ? '1px solid rgba(203, 213, 225, 0.9)' : '1px solid var(--border-color)',
                          padding: '0.75rem 1rem',
                          borderRadius: 'var(--radius-md)',
                          color: isLight ? '#0f172a' : 'white',
                          fontSize: '0.9rem'
                        }}
                      >
                        <option value="HR">HR & People</option>
                        <option value="Sales">Sales & Commercial</option>
                        <option value="Support">Helpdesk & Support</option>
                        <option value="Compliance">Security & Compliance</option>
                        <option value="Engineering">Engineering & IT</option>
                        <option value="General">General Company SOP</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <label style={{ fontSize: '0.82rem', color: isLight ? '#475569' : 'var(--text-sub)', fontWeight: 600 }}>
                        Markdown Document Body * (Use <code style={{ color: '#0d9488' }}>##</code> headers to split into semantic chunks)
                      </label>
                      <span style={{ fontSize: '0.76rem', color: isLight ? '#0d9488' : '#2dd4bf', fontWeight: 600 }}>
                        Estimated Chunks: ~{estimatedChunks}
                      </span>
                    </div>
                    <textarea
                      placeholder={`# Title\n\n## 1. Overview\nDescribe the policy overview...\n\n## 2. Guidelines\nSpecific actionable points for AI agents to retrieve...`}
                      value={docContent}
                      onChange={(e) => setDocContent(e.target.value)}
                      required
                      rows={10}
                      style={{
                        width: '100%',
                        background: isLight ? '#ffffff' : 'rgba(2, 6, 23, 0.75)',
                        border: isLight ? '1px solid rgba(203, 213, 225, 0.9)' : '1px solid var(--border-color)',
                        padding: '1rem',
                        borderRadius: 'var(--radius-md)',
                        color: isLight ? '#0f172a' : 'white',
                        fontFamily: 'monospace',
                        fontSize: '0.88rem',
                        lineHeight: 1.6,
                        resize: 'vertical'
                      }}
                    />
                  </div>

                  {/* Vector Pipeline Specifications Badge */}
                  <div style={{ background: isLight ? '#f0fdfa' : 'rgba(20, 184, 166, 0.08)', border: isLight ? '1px solid rgba(20, 184, 166, 0.3)' : '1px solid rgba(20, 184, 166, 0.25)', borderRadius: 'var(--radius-md)', padding: '0.85rem 1.1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Database size={16} color={isLight ? '#0d9488' : '#2dd4bf'} />
                      <span style={{ fontSize: '0.82rem', color: isLight ? '#475569' : 'var(--text-sub)' }}>
                        Target Qdrant Collection: <strong style={{ color: isLight ? '#0f172a' : '#fff' }}>enterprise_docs</strong>
                      </span>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: isLight ? '#475569' : 'var(--text-sub)' }}>
                      Embedder: <strong style={{ color: isLight ? '#0d9488' : '#2dd4bf' }}>BAAI/bge-small-en-v1.5 (384-d Cosine)</strong>
                    </div>
                  </div>
                </form>
              ) : (
                <form id="upload-kb-form" onSubmit={handleUploadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', color: isLight ? '#475569' : 'var(--text-sub)', marginBottom: '0.4rem', fontWeight: 600 }}>
                      Department / Category *
                    </label>
                    <select
                      value={uploadCategory}
                      onChange={(e) => setUploadCategory(e.target.value)}
                      style={{
                        width: '100%',
                        background: isLight ? '#ffffff' : 'rgba(2, 6, 23, 0.9)',
                        border: isLight ? '1px solid rgba(203, 213, 225, 0.9)' : '1px solid var(--border-color)',
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        color: isLight ? '#0f172a' : 'white',
                        fontSize: '0.9rem'
                      }}
                    >
                      <option value="General">General / Company-wide</option>
                      <option value="HR">HR & People</option>
                      <option value="Sales">Sales & Revenue</option>
                      <option value="Support">Helpdesk & Support</option>
                      <option value="Compliance">Security & Compliance</option>
                    </select>
                  </div>

                  {/* Dropzone */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      border: isLight ? '2px dashed rgba(20, 184, 166, 0.6)' : '2px dashed rgba(20, 184, 166, 0.5)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '3rem 2rem',
                      textAlign: 'center',
                      background: isLight ? 'rgba(240, 253, 250, 0.6)' : 'rgba(2, 6, 23, 0.4)',
                      cursor: 'pointer',
                      transition: 'border 0.2s ease'
                    }}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setSelectedFile(file);
                      }}
                      style={{ display: 'none' }}
                      accept=".md,.txt,.pdf,.csv"
                    />
                    <Upload size={38} style={{ color: isLight ? '#0d9488' : '#2dd4bf', margin: '0 auto 0.75rem' }} />
                    <h3 style={{ margin: '0 0 0.35rem 0', color: isLight ? '#0f172a' : '#fff', fontSize: '1.1rem' }}>
                      {selectedFile ? selectedFile.name : 'Click to select or drop policy document'}
                    </h3>
                    <p style={{ margin: 0, color: isLight ? '#64748b' : 'var(--text-muted)', fontSize: '0.85rem' }}>
                      Supports Markdown (.md), Text (.txt), PDF (.pdf), and CSV (.csv) up to 25 MB
                    </p>
                    {selectedFile && (
                      <div style={{ marginTop: '1rem', display: 'inline-block', background: isLight ? 'rgba(20, 184, 166, 0.15)' : 'rgba(20, 184, 166, 0.2)', border: '1px solid #14b8a6', padding: '0.35rem 0.85rem', borderRadius: 'var(--radius-full)', color: isLight ? '#0d9488' : '#2dd4bf', fontSize: '0.8rem', fontWeight: 600 }}>
                        Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                      </div>
                    )}
                  </div>
                </form>
              )}

              {/* Ingestion Steps Progress (if submitting) */}
              {isSubmitting && (
                <div style={{ background: isLight ? '#f8fafc' : 'rgba(2, 6, 23, 0.8)', border: isLight ? '1px solid rgba(20, 184, 166, 0.35)' : '1px solid rgba(20, 184, 166, 0.4)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <RefreshCw size={20} className="animate-spin" color={isLight ? '#0d9488' : '#2dd4bf'} />
                    <span style={{ fontWeight: 700, color: isLight ? '#0f172a' : '#fff', fontSize: '0.95rem' }}>
                      {ingestionStep === 1 && 'Parsing document & extracting section headings...'}
                      {ingestionStep === 2 && 'Generating 384-dimensional dense vectors (FastEmbed)...'}
                      {ingestionStep === 3 && 'Upserting points to Qdrant collection [enterprise_docs]...'}
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: isLight ? '#e2e8f0' : 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${(ingestionStep / 3) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #14b8a6, #2dd4bf)', transition: 'width 0.4s ease' }} />
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{ padding: '1.25rem 1.8rem', borderTop: isLight ? '1px solid rgba(226, 232, 240, 0.9)' : '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', gap: '1rem', background: isLight ? '#f8fafc' : 'rgba(15, 23, 42, 0.6)' }}>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                disabled={isSubmitting}
                style={{ background: 'transparent', border: isLight ? '1px solid rgba(203, 213, 225, 0.9)' : '1px solid var(--border-color)', color: isLight ? '#475569' : '#cbd5e1', padding: '0.75rem 1.4rem', borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
              >
                Cancel
              </button>

              {creationTab === 'editor' ? (
                <button
                  type="submit"
                  form="create-kb-form"
                  disabled={isSubmitting || !docTitle.trim() || !docContent.trim()}
                  style={{
                    background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.8rem',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 700,
                    cursor: (isSubmitting || !docTitle.trim() || !docContent.trim()) ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    opacity: (isSubmitting || !docTitle.trim() || !docContent.trim()) ? 0.6 : 1
                  }}
                >
                  {isSubmitting ? <RefreshCw size={17} className="animate-spin" /> : <Sparkles size={17} />}
                  {isSubmitting ? 'Vectorizing...' : 'Vectorize & Ingest to Qdrant'}
                </button>
              ) : (
                <button
                  type="submit"
                  form="upload-kb-form"
                  disabled={isSubmitting || !selectedFile}
                  style={{
                    background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.8rem',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 700,
                    cursor: (isSubmitting || !selectedFile) ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    opacity: (isSubmitting || !selectedFile) ? 0.6 : 1
                  }}
                >
                  {isSubmitting ? <RefreshCw size={17} className="animate-spin" /> : <Upload size={17} />}
                  {isSubmitting ? 'Ingesting...' : 'Ingest Document File'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* REALISTIC MODAL: DOCUMENT CONTENT & CHUNKS INSPECTOR     */}
      {/* ======================================================== */}
      {previewDoc && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: isLight ? 'rgba(15, 23, 42, 0.45)' : 'rgba(2, 6, 23, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1.5rem'
        }}>
          <div style={{
            background: isLight ? '#ffffff' : '#0b1329',
            border: isLight ? '1px solid rgba(203, 213, 225, 0.9)' : '1px solid rgba(20, 184, 166, 0.4)',
            borderRadius: 'var(--radius-lg)',
            width: '100%',
            maxWidth: '900px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: isLight ? '0 25px 50px -12px rgba(15, 23, 42, 0.2)' : '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
          }}>
            {/* Inspector Header */}
            <div style={{ padding: '1.5rem 1.8rem', borderBottom: isLight ? '1px solid rgba(226, 232, 240, 0.9)' : '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: isLight ? '#f8fafc' : 'rgba(15, 23, 42, 0.6)' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <span style={{ padding: '0.2rem 0.6rem', borderRadius: '12px', background: isLight ? 'rgba(20, 184, 166, 0.12)' : 'rgba(20, 184, 166, 0.2)', border: isLight ? '1px solid rgba(20, 184, 166, 0.35)' : '1px solid rgba(20, 184, 166, 0.4)', color: isLight ? '#0d9488' : '#2dd4bf', fontSize: '0.74rem', fontWeight: 700 }}>
                    {previewDoc.category} Knowledge Base
                  </span>
                  <span style={{ fontSize: '0.8rem', color: isLight ? '#64748b' : 'var(--text-muted)' }}>
                    • Source: {previewDoc.filename}
                  </span>
                </div>
                <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, color: isLight ? '#0f172a' : '#fff' }}>
                  {previewDoc.title || previewDoc.filename}
                </h2>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                style={{ background: 'transparent', border: 'none', color: isLight ? '#64748b' : 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Mode Switcher */}
            <div style={{ display: 'flex', borderBottom: isLight ? '1px solid rgba(226, 232, 240, 0.9)' : '1px solid var(--border-color)', background: isLight ? '#f1f5f9' : 'rgba(2, 6, 23, 0.4)' }}>
              <button
                onClick={() => setPreviewViewMode('reader')}
                style={{
                  flex: 1,
                  padding: '0.85rem',
                  background: previewViewMode === 'reader' ? (isLight ? '#ffffff' : 'rgba(20, 184, 166, 0.15)') : 'transparent',
                  border: 'none',
                  borderBottom: `2px solid ${previewViewMode === 'reader' ? '#14b8a6' : 'transparent'}`,
                  color: previewViewMode === 'reader' ? (isLight ? '#0d9488' : '#2dd4bf') : (isLight ? '#64748b' : 'var(--text-sub)'),
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <BookOpen size={16} /> Full Document Reader View
              </button>

              <button
                onClick={() => setPreviewViewMode('chunks')}
                style={{
                  flex: 1,
                  padding: '0.85rem',
                  background: previewViewMode === 'chunks' ? (isLight ? '#ffffff' : 'rgba(20, 184, 166, 0.15)') : 'transparent',
                  border: 'none',
                  borderBottom: `2px solid ${previewViewMode === 'chunks' ? '#14b8a6' : 'transparent'}`,
                  color: previewViewMode === 'chunks' ? (isLight ? '#0d9488' : '#2dd4bf') : (isLight ? '#64748b' : 'var(--text-sub)'),
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <Layers size={16} /> Qdrant Vector Chunks Inspector ({previewDoc.chunks_list?.length || previewDoc.chunks || 0} Chunks)
              </button>
            </div>

            {/* Content Body */}
            <div style={{ padding: '1.8rem', overflowY: 'auto', flex: 1 }}>
              {previewLoading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  <RefreshCw size={28} className="animate-spin" style={{ margin: '0 auto 1rem', color: '#14b8a6' }} />
                  <p>Loading document text from repository...</p>
                </div>
              ) : previewViewMode === 'reader' ? (
                <div style={{ background: isLight ? '#f8fafc' : 'rgba(2, 6, 23, 0.5)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: isLight ? '1px solid rgba(226, 232, 240, 0.9)' : '1px solid var(--border-color)' }}>
                  <pre style={{ margin: 0, fontFamily: 'inherit', whiteSpace: 'pre-wrap', lineHeight: 1.7, color: isLight ? '#0f172a' : '#e2e8f0', fontSize: '0.92rem' }}>
                    {previewDoc.content || "Document content not available on disk."}
                  </pre>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {(previewDoc.chunks_list && previewDoc.chunks_list.length > 0) ? (
                    previewDoc.chunks_list.map((chunk, idx) => (
                      <div key={idx} style={{ background: isLight ? '#f8fafc' : 'rgba(15, 23, 42, 0.8)', border: isLight ? '1px solid rgba(226, 232, 240, 0.9)' : '1px solid rgba(20, 184, 166, 0.25)', borderRadius: 'var(--radius-md)', padding: '1.2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                          <span style={{ background: '#0d9488', color: '#fff', fontSize: '0.74rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                            Vector Chunk #{idx + 1}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: isLight ? '#0d9488' : '#2dd4bf', background: isLight ? 'rgba(20, 184, 166, 0.12)' : 'rgba(20, 184, 166, 0.1)', padding: '0.2rem 0.55rem', borderRadius: '4px' }}>
                            Embedding: 384 float32 dimensions
                          </span>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.88rem', color: isLight ? '#334155' : '#cbd5e1', lineHeight: 1.6, whiteSpace: 'pre-wrap', background: isLight ? '#ffffff' : 'rgba(2, 6, 23, 0.5)', padding: '0.85rem', borderRadius: '6px', borderLeft: '3px solid #14b8a6', border: isLight ? '1px solid rgba(226, 232, 240, 0.8)' : 'none' }}>
                          {chunk}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No discrete chunks parsed.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Inspector Footer */}
            <div style={{ padding: '1.25rem 1.8rem', borderTop: isLight ? '1px solid rgba(226, 232, 240, 0.9)' : '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: isLight ? '#f8fafc' : 'rgba(15, 23, 42, 0.6)' }}>
              <div style={{ fontSize: '0.82rem', color: isLight ? '#64748b' : 'var(--text-muted)' }}>
                Index: <strong style={{ color: isLight ? '#0f172a' : '#fff' }}>enterprise_docs</strong> • Metric: <strong style={{ color: isLight ? '#0d9488' : '#2dd4bf' }}>Cosine Distance</strong>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                style={{ background: '#14b8a6', color: 'white', border: 'none', padding: '0.65rem 1.4rem', borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 15px rgba(20, 184, 166, 0.3)' }}
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
