"use server"

import { fileStorageService } from "@/services/fileStorage/fileStorageService"

export async function getEmptyDirectories() {
  return await fileStorageService.getEmptyDirectories()
}