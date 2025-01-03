import publicProcedure from "../procedures/public";
import { z } from "zod";
import { router } from "../trpcSetup";
import {
  downloadUrlToTempDirectory,
  uploadToCanvasPart1,
  uploadToCanvasPart2,
} from "@/services/canvas/files/canvasFileService";

export const canvasFileRouter = router({
  getCanvasFileUrl: publicProcedure
    .input(
      z.object({
        sourceUrl: z.string(),
        canvasCourseId: z.number(),
      })
    )
    .mutation(async ({ input: { sourceUrl, canvasCourseId } }) => {
      const localTempFile = await downloadUrlToTempDirectory(sourceUrl);
      console.log("local temp file", localTempFile);
      const { upload_url, upload_params } = await uploadToCanvasPart1(
        localTempFile,
        canvasCourseId
      );
      console.log("part 1 done", upload_url, upload_params);
      const canvasUrl = await uploadToCanvasPart2({
        pathToUpload: localTempFile,
        upload_url,
        upload_params,
      });
      console.log("canvas url done");
      return canvasUrl;
    }),
});
