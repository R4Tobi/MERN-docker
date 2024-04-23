module.exports = {
  apps: [
    {
      name: "nextjs-frontend",
      script: "npm",
      args: "start",
      cwd: "/app/",
      watch: true,
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
