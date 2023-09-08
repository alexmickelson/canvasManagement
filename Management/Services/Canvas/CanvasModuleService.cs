
using CanvasModel.Modules;
using LocalModels;
using RestSharp;

namespace Management.Services.Canvas;

public class CanvasModuleService
{

  private readonly IWebRequestor webRequestor;
  private readonly CanvasServiceUtils utils;

  public CanvasModuleService(IWebRequestor webRequestor, CanvasServiceUtils utils)
  {
    this.webRequestor = webRequestor;
    this.utils = utils;
  }


  public async Task<IEnumerable<CanvasModule>> GetModules(ulong courseId)
  {
    var url = $"courses/{courseId}/modules";
    var request = new RestRequest(url);
    var modules = await utils.PaginatedRequest<IEnumerable<CanvasModule>>(request);
    return modules.SelectMany(c => c).ToArray();
  }

  public async Task<CanvasModule> CreateModule(ulong courseId, string name)
  {
    Console.WriteLine($"Creating Module: {name}");
    var url = $"courses/{courseId}/modules";
    var request = new RestRequest(url);
    var body = new
    {
      module = new
      {
        name
      }
    };
    request.AddBody(body);

    var (newModule, _) = await webRequestor.PostAsync<CanvasModule>(request);
    return newModule ?? throw new Exception($"failed to create new canvas module {name}");
  }

  public async Task UpdateModule(ulong courseId, ulong moduleId, string name, uint position)
  {
    Console.WriteLine($"Updating Module: {name}");
    var url = $"courses/{courseId}/modules/{moduleId}";
    var body = new { module = new { name = name, position = position } };
    var request = new RestRequest(url);
    request.AddBody(body);

    await webRequestor.PutAsync(request);
  }

  public async Task<IEnumerable<CanvasModuleItem>> GetModuleItems(ulong courseId, ulong moduleId)
  {
    var url = $"courses/{courseId}/modules/{moduleId}/items";
    var request = new RestRequest(url);
    var (items, response) = await webRequestor.GetAsync<IEnumerable<CanvasModuleItem>>(request);
    if (items == null)
      throw new Exception($"Error getting canvas module items for {url}");
    return items;
  }

  public async Task<Dictionary<ulong, IEnumerable<CanvasModuleItem>>> GetAllModulesItems(
    ulong courseId,
    IEnumerable<CanvasModule> modules
  )
  {
    var itemsTasks = modules.Select(
      async (m) =>
      {
        var items = await GetModuleItems(courseId, m.Id);
        return (m, items);
      }
    );

    var output = new Dictionary<ulong, IEnumerable<CanvasModuleItem>>();
    var itemTasksResult = await Task.WhenAll(itemsTasks);
    foreach (var (module, items) in itemTasksResult)
    {
      if (module == null || items == null)
        throw new Exception(
          "i'm not sure how we got here, but module and items are null after looking up module items"
        );
      output[module.Id] = items;
    }
    return output;
  }
}