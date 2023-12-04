using Management.Services;

public class FileConfiguration
{

  public static string GetBasePath()
  {
    string? storageDirectory = Environment.GetEnvironmentVariable("storageDirectory");
    var basePath = storageDirectory ?? Path.GetFullPath("../storage");

    if (!Directory.Exists(basePath))
      throw new Exception("storage folder not found");

    return basePath;

  }
}