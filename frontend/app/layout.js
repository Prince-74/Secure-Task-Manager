import "./globals.css";
import React from "react";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Secure Task Manager</title>
      </head>
      <body>
        <div className="app-shell">
          <header className="app-header">
            <div className="app-header-inner">
              <div className="app-header-content">
                <h1 className="app-title">Secure Task Manager</h1>
                <p className="app-subtitle">Encrypted multi-user task system</p>
                <div className="app-header-divider" />
              </div>
            </div>
          </header>
          <main className="app-main">
            <div className="app-main-inner">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}

