using Microsoft.AspNetCore.Components.Server.ProtectedBrowserStorage;

public class BrowserStorageManagement : ICanvasTokenManagement
{
  // private string moduleStorageKey = "module storage key";
  // private string assignmentStorageKey = "assignment storage key";
  private string canvasKey = "canvas key";

  private ProtectedLocalStorage storage { get; }

  public BrowserStorageManagement(ProtectedLocalStorage BrowserStorage)
  {
    storage = BrowserStorage;
  }

  public async Task<string?> GetCanvasToken()
  {
    var result = await storage.GetAsync<string>(canvasKey);
    if (!result.Success)
      return null;
    return result.Value;
  }

  public async Task SaveCanvasToken(string token)
  {
    await storage.SetAsync(canvasKey, token);
  }
}
