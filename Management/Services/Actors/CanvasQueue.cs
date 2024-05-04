using Akka.Actor;

using Management.Services.Canvas;

public class CanvasQueue(IActorRef canvasQueueActor)
{
  private readonly IActorRef canvasQueueActor = canvasQueueActor;

}