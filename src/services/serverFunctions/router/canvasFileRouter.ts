import publicProcedure from "../procedures/public";
import { z } from "zod";
import { router } from "../trpcSetup";
import {
  downloadUrlToTempDirectory,
  uploadToCanvasPart1,
  uploadToCanvasPart2,
} from "@/services/canvas/files/canvasFileService";

const fileStorageLocation = process.env.FILE_STORAGE_LOCATION ?? "/app/public";

export const canvasFileRouter = router({
  getCanvasFileUrl: publicProcedure
    .input(
      z.object({
        sourceUrl: z.string(),
        canvasCourseId: z.number(),
      })
    )
    .mutation(async ({ input: { sourceUrl, canvasCourseId } }) => {
      const { fileName: localFile, success } = sourceUrl.startsWith("/")
        ? { fileName: fileStorageLocation + sourceUrl, success: true }
        : await downloadUrlToTempDirectory(sourceUrl);

      if (!success) {
        console.log("could not download file, returning sourceUrl", sourceUrl);
        // make a toast or some other way of notifying the user
        return sourceUrl;
      }
      console.log("local temp file", localFile);
      const { upload_url, upload_params } = await uploadToCanvasPart1(
        localFile,
        canvasCourseId
      );
      console.log("part 1 done", upload_url, upload_params);
      const canvasUrl = await uploadToCanvasPart2({
        pathToUpload: localFile,
        upload_url,
        upload_params,
      });
      console.log("canvas url done", canvasUrl);
      return canvasUrl;
    }),
});
