
namespace CanvasModel.Modules;
public class ModuleItemSequenceModel
{
  [JsonPropertyName("items")]
  public IEnumerable<ModuleItemSequenceNodeModel> Items { get; set; }
}
