import Link from 'next/link';
import { Activity, Zap, Database, BarChart3 } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-vh-100 d-flex flex-column bg-white">
      
      {/* Clean Enterprise Header */}
      <header className="fixed-top bg-white border-bottom">
        <div className="container d-flex justify-content-between align-items-center py-3">
          <div className="d-flex align-items-center gap-2">
            <img src="/logo.jpg" alt="Kaku Food Logo" style={{ height: '36px', width: 'auto', objectFit: 'contain' }} />
          </div>
          <Link href="/login" className="btn btn-primary px-4 fw-medium shadow-sm transition-all">
            Masuk
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow-1" style={{ paddingTop: '80px' }}>
        
        <section className="py-5 text-center">
          <div className="container" style={{ maxWidth: '900px' }}>
            
            <div className="mb-4">
              <span className="small fw-medium" style={{ color: '#800000', letterSpacing: '1px', textTransform: 'uppercase' }}>Sistem Manajemen Inventaris Aktif</span>
            </div>

            <h1 className="fw-bold text-dark mb-4" style={{ fontSize: '2.5rem', letterSpacing: '-0.02em', lineHeight: '1.3' }}>
              Monitoring Infrastruktur & Peralatan <span style={{ color: '#800000' }}>Kaku Food</span>
            </h1>
            
            <p className="text-muted mb-5 mx-auto" style={{ maxWidth: '700px', fontSize: '1.1rem', lineHeight: '1.6' }}>
              Platform enterprise terpusat untuk memantau, mengelola, dan memelihara seluruh inventaris operasional di seluruh cabang Kaku Food secara real-time.
            </p>
            
            <div className="d-flex justify-content-center gap-3">
              <Link href="/login" className="btn btn-primary btn-lg px-5 py-3 fw-medium shadow-sm">
                Buka Dashboard
              </Link>
            </div>

          </div>
        </section>

        {/* Practical Features Grid */}
        <section className="py-5 bg-light border-top">
          <div className="container py-4">
            <div className="text-center mb-5">
              <h2 className="fw-bold mb-3" style={{ fontSize: '1.75rem', letterSpacing: '-0.01em' }}>Dirancang untuk Keandalan Operasional</h2>
              <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>Infrastruktur terpusat untuk mengelola ribuan peralatan tanpa kehilangan jejak.</p>
            </div>
            
            <div className="row g-4 justify-content-center">
              {[
                { icon: Database, title: "Pencatatan Akurat", desc: "Data inventaris tersimpan di server tersentralisasi yang dicadangkan secara rutin." },
                { icon: Activity, title: "Monitoring Terpadu", desc: "Pantau kondisi peralatan secara langsung dan tangani lebih awal jika ada tanda kerusakan." },
                { icon: Zap, title: "Proses Otomatis", desc: "Pelacakan riwayat dan audit trail dilakukan secara otomatis oleh sistem." },
                { icon: BarChart3, title: "Laporan Analitik", desc: "Lihat ringkasan cabang dengan performa operasional tertinggi dan alat terawet." }
              ].map((ft, idx) => (
                <div key={idx} className="col-md-6 col-lg-3">
                  <div className="card h-100 p-4">
                    <div className="text-primary mb-3">
                      <ft.icon size={24} color="#800000" />
                    </div>
                    <h6 className="fw-bold mb-2 text-dark">{ft.title}</h6>
                    <p className="text-muted small mb-0 lh-base">{ft.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      <footer className="border-top bg-white py-3 text-muted small">
        <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center">
          <div className="mb-2 mb-md-0 fw-medium">&copy; 2026 Kaku Food. All rights reserved.</div>
          <div className="d-flex gap-4">
            <span className="text-muted text-decoration-none cursor-pointer hover-text-dark">Kebijakan Privasi</span>
            <span className="text-muted text-decoration-none cursor-pointer hover-text-dark">Syarat & Ketentuan</span>
          </div>
        </div>
      </footer>
      
      <style dangerouslySetInnerHTML={{__html: `
        .hover-text-dark:hover { color: #0f172a !important; }
        .cursor-pointer { cursor: pointer; }
        .transition-all { transition: all 0.2s ease-in-out; }
      `}} />
    </div>
  );
}
