public interface ICanvasTokenManagement
{
  Task<string?> GetCanvasToken();
  Task SaveCanvasToken(string token);
}