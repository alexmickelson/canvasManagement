import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import chokidar from "chokidar";
import path from "path";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

const folderToWatch = path.join(process.cwd(), "./storage", "/");
console.log("watching folder", folderToWatch);

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);
  const watcher = chokidar.watch(folderToWatch, { persistent: true });

  io.on("connection", (socket) => {
    console.log("websocket connection created");
    const changeHandler = (filePath) => {
      const relativePath = filePath.replace(folderToWatch, "");
      console.log(`Sending file changed websocket message: ${relativePath}`);

      socket.emit("fileChanged", relativePath);
    };
    watcher.on("change", changeHandler);

    socket.on("disconnect", () => {
      console.log("Client disconnected");
      watcher.off("change", changeHandler); // Remove the event listener
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
