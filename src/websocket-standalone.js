import { createServer } from "node:http";
import { Server } from "socket.io";
import chokidar from "chokidar";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

const port = 3001;
const folderToWatch = path.join(process.cwd(), "./storage", "/");
console.log("watching folder", folderToWatch);
const usePolling = process.env.FILE_POLLING === "true";
const enable_images = process.env.NEXT_PUBLIC_ENABLE_FILE_SYNC === "true";
console.log("FILE_POLLING:", usePolling);
console.log("NEXT_PUBLIC_ENABLE_FILE_SYNC:", enable_images);

const watcher = chokidar.watch(folderToWatch, {
  persistent: true,
  usePolling,
});

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("websocket connection created");
  const changeHandler = (filePath) => {
    const relativePath = filePath.replace(folderToWatch, "");
    console.log(`Sending file changed websocket message: ${relativePath}`);
    socket.emit("fileChanged", relativePath);
  };
  watcher.on("change", changeHandler);
  watcher.on("unlink", changeHandler);
  watcher.on("add", changeHandler);

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    watcher.off("change", changeHandler);
    watcher.off("unlink", changeHandler);
    watcher.off("add", changeHandler);
  });
});

httpServer
  .once("error", (err) => {
    console.error(err);
    process.exit(1);
  })
  .listen(port, () => {
    console.log(`> WebSocket server ready on port ${port}`);
  });
