using System.Diagnostics;
using System.Net.Http.Headers;
using Akka.Actor;
using Akka.DependencyInjection;
using Management.Services.Canvas;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.DependencyInjection;
namespace Management.Actors;


// RecieveActor configures messages in constructor
// UntypedActor configures messages in an onrecieved function
public class CanvasApiActor : ReceiveActor
{
  private readonly IServiceScope _scope;
  private readonly ILogger<CanvasApiActor> _logger;
  private readonly IHubContext<SignalRHub> _hub;
  public CanvasApiActor(IServiceProvider serviceProvider) // props go here
  {
    _scope = serviceProvider.CreateScope();
    _logger = _scope.ServiceProvider.GetRequiredService<ILogger<CanvasApiActor>>();
    _hub = _scope.ServiceProvider.GetRequiredService<IHubContext<SignalRHub>>();

    _logger.LogInformation("creating canvas actor");

    var canvasService = _scope.ServiceProvider.GetRequiredService<CanvasService>();
    ReceiveAsync<GetModulesMessage>(async m =>
    {
      using var activity = m.Activity("canvas actor getting modules from canvas api");

      var modules = await canvasService.Modules.GetModules(m.CanvasCourseId);
      Sender.Tell(new CanvasModulesMessage(m.RequestId, m.CanvasCourseId, modules, activity?.TraceId, activity?.SpanId));

      await _hub.Clients.Client(m.ClientConnectionId).SendAsync("SentFromActor");
    });
  }


  protected override void PostStop()
  {
    _scope.Dispose();
    base.PostStop();
  }

  // used to wrap the arguments in a comprehension for future instanciation of the actor
  // does this work with DI?
  // public static Props Props(CanvasService canvasService) =>
  //   Akka.Actor.Props.Create(() => new CanvasApiActor(canvasService));

}
