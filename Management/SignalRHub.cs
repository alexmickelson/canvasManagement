using Microsoft.AspNetCore.SignalR;

public class SignalRHub : Hub
{
  public async Task SendMessage(string user, string message)
  {
    await Clients.All.SendAsync("ReceiveMessage", user, message);
  }
  public override Task OnConnectedAsync()
  {
    var connectionId = Context.ConnectionId;
    // Store the connection ID for later use, e.g., in a database or in-memory store
    return base.OnConnectedAsync();
  }
}
