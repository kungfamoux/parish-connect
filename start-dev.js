const { spawn } = require('child_process');
const path = require('path');

// Start API server
const apiServer = spawn('npm', ['run', 'api'], {
  stdio: 'inherit',
  cwd: __dirname,
  shell: true
});

// Start Vite dev server
const viteServer = spawn('npm', ['run', 'dev:client'], {
  stdio: 'inherit',
  cwd: __dirname,
  shell: true
});

// Handle output
apiServer.stdout.on('data', (data) => {
  console.log(`[API] ${data}`);
});

apiServer.stderr.on('data', (data) => {
  console.error(`[API] ${data}`);
});

viteServer.stdout.on('data', (data) => {
  console.log(`[VITE] ${data}`);
});

viteServer.stderr.on('data', (data) => {
  console.error(`[VITE] ${data}`);
});

// Handle exit
apiServer.on('close', (code) => {
  console.log(`API server exited with code ${code}`);
  process.exit(code);
});

viteServer.on('close', (code) => {
  console.log(`Vite server exited with code ${code}`);
  process.exit(code);
});
