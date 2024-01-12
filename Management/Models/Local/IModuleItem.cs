
namespace LocalModels;

public interface IModuleItem
{
  public string Name { get; init; }
  public DateTime DueAt { get; init; }

}
