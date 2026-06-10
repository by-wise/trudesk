module.exports = {
  apps: [{
    name: 'trudesk',
    script: './app.js',
    output: './logs/output.log',
    error: './logs/output.log',
    merge_logs: true
  }]
}
