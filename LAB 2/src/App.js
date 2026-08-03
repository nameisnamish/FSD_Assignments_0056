import React, { useEffect } from 'react';

function App() {
  useEffect(() => {
    // Dynamically load fontawesome icons and page styles if needed
    const linkFA = document.createElement('link');
    linkFA.rel = 'stylesheet';
    linkFA.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    document.head.appendChild(linkFA);

    const linkCSS = document.createElement('link');
    linkCSS.rel = 'stylesheet';
    linkCSS.href = '/styles.css';
    document.head.appendChild(linkCSS);

    const scriptJS = document.createElement('script');
    scriptJS.src = '/script.js';
    scriptJS.async = true;
    document.body.appendChild(scriptJS);

    return () => {
      document.head.removeChild(linkFA);
      document.head.removeChild(linkCSS);
      document.body.removeChild(scriptJS);
    };
  }, []);

  return (
    <iframe 
      src="/index.html" 
      title="Developer Portfolio" 
      style={{ width: '100vw', height: '100vh', border: 'none', position: 'fixed', top: 0, left: 0 }}
    />
  );
}

export default App;
