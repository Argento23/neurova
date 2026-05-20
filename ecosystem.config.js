module.exports = {
    apps: [
        {
            name: 'content-factory',
            cwd: './content-factory',
            script: 'src/index.js',
            node_args: '--experimental-modules',
            env: {
                NODE_ENV: 'production'
            },
            max_restarts: 10,
            restart_delay: 5000,
            exp_backoff_restart_delay: 100,
            watch: false,
            max_memory_restart: '500M'
        },
        {
            name: 'austria-saas',
            cwd: './austria-saas',
            script: 'npm',
            args: 'run start:production',
            env: {
                PORT: 3002,
                NODE_ENV: 'production'
            }
        },
        {
            name: 'cilo-b2b',
            cwd: './cilo-b2b',
            script: 'npm',
            args: 'run start:production',
            env: {
                PORT: 3001,
                NODE_ENV: 'production'
            }
        },
        {
            name: 'template-saas',
            cwd: './template-saas',
            script: 'npm',
            args: 'run start:production',
            env: {
                PORT: 3003,
                NODE_ENV: 'production'
            }
        },
        {
            name: 'adsniper-saas',
            cwd: './adsniper-saas',
            script: 'npm',
            args: 'run start:production',
            env: {
                PORT: 3004,
                NODE_ENV: 'production'
            }
        }
    ]
};
