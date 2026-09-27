import React from 'react';

export default function Loading() {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center w-100" style={{ minHeight: '60vh' }}>
      <div className="spinner-border text-primary mb-3" style={{ width: '2.5rem', height: '2.5rem', borderWidth: '0.2em' }} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <div className="text-muted fw-medium small">Mempersiapkan data...</div>
    </div>
  );
}
