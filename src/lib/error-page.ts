export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Application Error</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { 
        font: 14px/1.6 system-ui, -apple-system, sans-serif; 
        background: #020205; 
        color: #fff; 
        display: grid; 
        place-items: center; 
        min-height: 100vh; 
        margin: 0; 
        padding: 2rem; 
      }
      .card { 
        max-width: 32rem; 
        width: 100%; 
        text-align: center; 
        padding: 3rem; 
        background: rgba(255, 255, 255, 0.03);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 2rem;
        box-shadow: 0 20px 50px rgba(0,0,0,0.5);
      }
      h1 { 
        font-size: 1.5rem; 
        margin: 0 0 1rem; 
        font-weight: 800;
        letter-spacing: -0.02em;
        text-transform: uppercase;
      }
      p { 
        color: rgba(255, 255, 255, 0.6); 
        margin: 0 0 2rem; 
        font-size: 0.95rem;
      }
      .actions { 
        display: flex; 
        gap: 1rem; 
        justify-content: center; 
        flex-wrap: wrap; 
      }
      a, button { 
        padding: 0.75rem 1.5rem; 
        border-radius: 9999px; 
        font-weight: 700;
        font-size: 0.875rem;
        cursor: pointer; 
        text-decoration: none; 
        border: 1px solid rgba(255, 255, 255, 0.1);
        transition: all 0.2s;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
      .primary { 
        background: linear-gradient(to right, #ec4899, #9333ea); 
        color: #fff; 
        border: none;
        box-shadow: 0 0 20px rgba(236, 72, 153, 0.3);
      }
      .primary:hover {
        transform: scale(1.05);
        box-shadow: 0 0 30px rgba(236, 72, 153, 0.5);
      }
      .secondary { 
        background: rgba(255, 255, 255, 0.05); 
        color: #fff; 
      }
      .secondary:hover {
        background: rgba(255, 255, 255, 0.1);
      }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>System Encountered an Issue</h1>
      <p>The page failed to initialize correctly. This might be due to a temporary connection drop or a system update.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Refresh Page</button>
        <a class="secondary" href="/">Return Home</a>
      </div>
    </div>
  </body>
</html>`;
}
