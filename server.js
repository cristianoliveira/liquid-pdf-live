const fs = require("node:fs");
const { generatePDF } = require("./index.js");

const liveServer = require("live-server");

const port = process.env.PORT || 3033; // Default port

const changeStack = new Set();
fs.watch("./template", (event, file) => {
	console.log("Event: ", file, event);
	if (changeStack.has(file)) {
		console.log("Already processing this file, skipping...");
		return;
	}
	changeStack.add(file);
	generatePDF()
		.then(() => {
			console.log("PDF generated successfully");
		})
		.catch((err) => {
			console.error("Error generating PDF:", err);
		}).finally(() => {
			// Remove the file from the change stack after processing
			setTimeout(() => {
				changeStack.delete(file);
			}, 500); // Adjust the timeout as needed
		});
})

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
