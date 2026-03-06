// admin/pages/test/TestPage.tsx
import React from 'react';

const TestPage = () => {
  return (
    <div style={{ 
      padding: '40px', 
      backgroundColor: '#f0f0f0',
      minHeight: '100vh'
    }}>
      <h1 style={{ 
        fontSize: '32px', 
        color: '#333',
        marginBottom: '20px'
      }}>
        ✅ TEST PAGE BEKERJA!
      </h1>
      <p style={{ fontSize: '18px', color: '#666' }}>
        Jika ini muncul, berarti rendering berhasil.
      </p>
      <div style={{ 
        marginTop: '20px',
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <p>Ini adalah test page untuk memastikan routing dan layout bekerja.</p>
      </div>
    </div>
  );
};

export default TestPage;