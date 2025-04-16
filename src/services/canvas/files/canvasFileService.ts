import fs from "fs/promises";
import path from "path";
import axios from "axios";
import { canvasApi } from "../canvasServiceUtils";
import { axiosClient } from "@/services/axiosUtils";
import FormData from "form-data";

export const downloadUrlToTempDirectory = async (
  sourceUrl: string
): Promise<{fileName: string, success: boolean}> => {
  try {
    const fileName =
      path.basename(new URL(sourceUrl).pathname) || `tempfile-${Date.now()}`;
    const tempFilePath = path.join("/tmp", fileName);
    const response = await axios.get(sourceUrl, {
      responseType: "arraybuffer",
    });
    await fs.writeFile(tempFilePath, response.data);
    return {fileName: tempFilePath, success: true};
  } catch (error) {
    console.log("Error downloading or saving the file:", sourceUrl, error);
    return {fileName: sourceUrl, success: false};
  }
};

const getFileSize = async (pathToFile: string): Promise<number> => {
  try {
    const stats = await fs.stat(pathToFile);
    return stats.size;
  } catch (error) {
    console.error("Error reading file size:", error);
    throw error;
  }
};

export const uploadToCanvasPart1 = async (
  pathToUpload: string,
  canvasCourseId: number
) => {
  try {
    const url = `${canvasApi}/courses/${canvasCourseId}/files`;

    const formData = new FormData();

    formData.append("name", path.basename(pathToUpload));
    formData.append("size", (await getFileSize(pathToUpload)).toString());

    const response = await axiosClient.post(url, formData);

    const upload_url = response.data.upload_url;
    const upload_params = response.data.upload_params;

    return { upload_url, upload_params };
  } catch (error) {
    console.error("Error uploading file to Canvas part 1:", error);
    throw error;
  }
};

export const uploadToCanvasPart2 = async ({
  pathToUpload,
  upload_url,
  upload_params,
}: {
  pathToUpload: string;
  upload_url: string;
  upload_params: { [key: string]: string };
}) => {
  try {
    const formData = new FormData();

    Object.keys(upload_params).forEach((key) => {
      formData.append(key, upload_params[key]);
    });

    const fileBuffer = await fs.readFile(pathToUpload);
    const fileName = path.basename(pathToUpload);
    formData.append("file", fileBuffer, fileName);

    const response = await axiosClient.post(upload_url, formData, {
      headers: formData.getHeaders(),
      validateStatus: (status) => status < 500,
    });

    if (response.status === 301) {
      const redirectUrl = response.headers.location;
      if (!redirectUrl) {
        throw new Error(
          "Redirect URL not provided in the Location header on redirect from second part of canvas file upload"
        );
      }

      const redirectResponse = await axiosClient.get(redirectUrl);
      console.log("redirect response", redirectResponse.data);
    }
    // console.log("returning from part 2", JSON.stringify(response.data));
    return response.data.url;
  } catch (error) {
    console.error("Error uploading file to Canvas part 2:", error);
    throw error;
  }
};
