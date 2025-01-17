module.exports = {
    apps: [
        {
            name: "react-app",
            script: "serve",
            args: "-s build -l 3000", // Replace 3000 with your preferred port
            env: {
                NODE_ENV: "production",
            },
        },
    ],
};
