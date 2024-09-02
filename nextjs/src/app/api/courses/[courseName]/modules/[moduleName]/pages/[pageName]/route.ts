import { fileStorageService } from "@/services/fileStorage/fileStorageService";

export async function GET(
  _request: Request,
  {
    params: { courseName, moduleName, pageName },
  }: { params: { courseName: string; moduleName: string; pageName: string } }
) {
  const settings = await fileStorageService.getPage(
    courseName,
    moduleName,
    pageName
  );
  return Response.json(settings);
}

export async function PUT(
  request: Request,
  {
    params: { courseName, moduleName, pageName },
  }: { params: { courseName: string; moduleName: string; pageName: string } }
) {
  const page = await request.json()
  await fileStorageService.updatePage(
    courseName,
    moduleName,
    pageName,
    page
  );
  return Response.json({});
}
