using Management.Services;
using Microsoft.Extensions.Configuration;

public class FileConfiguration(IConfiguration config)
{
  public string GetBasePath()
  {
    string? storageDirectory = config["storageDirectory"];
    var basePath = storageDirectory ?? Path.GetFullPath("../storage");

    if (!Directory.Exists(basePath))
      throw new Exception("storage folder not found");

    return basePath;

  }
}
