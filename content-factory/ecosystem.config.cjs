module.exports = {
  apps: [
    {
      name: 'content-factory',
      script: 'src/index.js',
      cwd: __dirname,
      node_args: '--experimental-modules',
      env: {
        NODE_ENV: 'production'
      },
      watch: false,
      max_memory_restart: '256M',
      error_file: 'data/logs/pm2-error.log',
      out_file: 'data/logs/pm2-out.log',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      restart_delay: 5000,
      max_restarts: 10,
      autorestart: true
    }
  ]
};
