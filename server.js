const liveServer = require("live-server");

const port = process.env.PORT || 3033; // Default port

// if index.html jjjjjjjjj

// See: https://github.com/tapio/live-server?tab=readme-ov-file#usage-from-node
const params = {
	port,
	root: "./public", // Set root directory that's being served. Defaults to cwd.
	host: "0.0.0.0", // Set the address to bind to. Defaults to 0.0.0.0 or process.env.IP.
	open: false, // When false, it won't load your browser by default.
	// wait: 1000, // Waits for all changes, before reloading. Defaults to 0 sec.
	mount: [["./dist", "/dist"]], // Mount a directory to serve files from. Defaults to cwd.
	ignore: ["./dist/*.html"], // One or more paths to ignore. Comma separated list or array of paths.
	// logLevel: 2, // 0 = errors only, 1 = some, 2 = lots
};

liveServer.start(params);
