// KIDORA — PM2 process config untuk backend
// Guna: pm2 start ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'kidora-backend',
      cwd: '/var/www/kidora/server',
      script: 'src/server.js',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
    },
  ],
};
