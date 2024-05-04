global using System.ComponentModel.DataAnnotations;
global using System.Text.Json;
global using System.Text.Json.Serialization;

global using CanvasModel;
global using CanvasModel.Courses;
global using CanvasModel.EnrollmentTerms;

global using LocalModels;

global using Management.Planner;
global using Management.Services;
global using Management.Services.Canvas;
global using Management.Web.Shared;
global using Management.Web.Shared.Components;

using dotenv.net;

using Microsoft.AspNetCore.Hosting.Server;
using Microsoft.AspNetCore.Hosting.Server.Features;
using Microsoft.AspNetCore.ResponseCompression;

using OpenTelemetry;
using OpenTelemetry.Logs;
using OpenTelemetry.Metrics;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;

DotEnv.Load();

var builder = WebApplication.CreateBuilder(args);

ConfigurationSetup.Canvas(builder);

const string serviceName = "canvas-management";

builder.Logging.AddOpenTelemetry(options =>
{
  options
    .SetResourceBuilder(
      ResourceBuilder
        .CreateDefault()
        .AddService(serviceName)
    )
    .AddOtlpExporter(o =>
    {
      o.Endpoint = new Uri("http://localhost:4317/");
    });
  // .AddConsoleExporter();
});

builder.Services.AddOpenTelemetry()
  .ConfigureResource(resource => resource.AddService(serviceName))
  .WithTracing(tracing => tracing
    .AddSource(DiagnosticsConfig.SourceName)
    .AddOtlpExporter(o =>
    {
      o.Endpoint = new Uri("http://localhost:4317/");
    })
    .AddAspNetCoreInstrumentation()
    .AddProcessor(new BatchActivityExportProcessor(new CustomConsoleExporter()))
  )
  .WithMetrics(metrics => metrics
    .AddOtlpExporter(o =>
    {
      o.Endpoint = new Uri("http://localhost:4317/");
    }
  )
  .AddAspNetCoreInstrumentation()
);

// Add services to the container.
builder.Services.AddRazorPages();
builder.Services.AddServerSideBlazor();

builder.Services.AddLogging();

builder.Services.AddSingleton(typeof(MyLogger<>));

// stateless services
builder.Services.AddSingleton<IWebRequestor, WebRequestor>();
builder.Services.AddSingleton<CanvasServiceUtils>();
builder.Services.AddSingleton<ICanvasAssignmentService, CanvasAssignmentService>();
builder.Services.AddSingleton<ICanvasCoursePageService, CanvasCoursePageService>();
builder.Services.AddSingleton<ICanvasAssignmentGroupService, CanvasAssignmentGroupService>();
builder.Services.AddSingleton<ICanvasQuizService, CanvasQuizService>();
builder.Services.AddSingleton<ICanvasModuleService, CanvasModuleService>();
builder.Services.AddSingleton<ICanvasService, CanvasService>();

builder.Services.AddSingleton<MarkdownCourseSaver>();
builder.Services.AddSingleton<CourseMarkdownLoader>();

builder.Services.AddSingleton<FileStorageManager>();

// one actor system, maybe different actor for different pages?
builder.Services.AddSingleton<AkkaService>();
builder.Services.AddHostedService(sp => sp.GetRequiredService<AkkaService>());


// TODO: need to handle scoped requirements
builder.Services.AddSingleton(sp =>
{
  var akka = sp.GetRequiredService<AkkaService>();
  return new CanvasQueue(akka.CanvasQueueActor ?? throw new Exception("Canvas queue actor not properly created"));
});
builder.Services.AddSingleton<IFileStorageManager>(sp =>
{
  var akka = sp.GetRequiredService<AkkaService>();
  return new LocalStorageCache(akka.StorageActor ?? throw new Exception("Canvas queue actor not properly created"));
});


builder.Services.AddScoped<CoursePlanner>();
builder.Services.AddScoped<AssignmentEditorContext>();
builder.Services.AddScoped<PageEditorContext>();
builder.Services.AddScoped<QuizEditorContext>();
builder.Services.AddScoped<DragContainer>();

builder.Services.AddSingleton<FileConfiguration>();

builder.Services.AddResponseCompression(opts =>
{
  opts.MimeTypes = ResponseCompressionDefaults.MimeTypes.Concat(new[] { "application/octet-stream" });
});

builder.Services.AddSignalR(e =>
{
  e.MaximumReceiveMessageSize = 102400000;
});



var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
  app.UseExceptionHandler("/Error");
  // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
  app.UseHsts();
}

app.UseHttpsRedirection();

app.UseStaticFiles();

app.UseRouting();
app.UseResponseCompression();

app.MapBlazorHub();
app.MapFallbackToPage("/_Host");


app.Start();

var addresses = app.Services.GetService<IServer>()?.Features.Get<IServerAddressesFeature>()?.Addresses ?? [];

foreach (var address in addresses)
{
  Console.WriteLine("Running at: " + address);
}

app.WaitForShutdown();

