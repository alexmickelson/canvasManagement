global using System.Text.Json.Serialization;
global using System.Text.Json;
global using System.ComponentModel.DataAnnotations;
global using Management.Services.Canvas;
global using Management.Services;
global using CanvasModel.EnrollmentTerms;
global using CanvasModel.Courses;
global using CanvasModel;
global using LocalModels;
global using Management.Planner;
global using Management.Web.Shared.Components;
global using Management.Web.Shared;

using dotenv.net;
using Microsoft.AspNetCore.Hosting.Server;
using Microsoft.AspNetCore.Hosting.Server.Features;
using OpenTelemetry.Logs;
using OpenTelemetry.Metrics;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;
using OpenTelemetry;

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

builder.Services.AddScoped(typeof(MyLogger<>));

builder.Services.AddScoped<IWebRequestor, WebRequestor>();
builder.Services.AddScoped<CanvasServiceUtils>();
builder.Services.AddScoped<CanvasAssignmentService>();
builder.Services.AddScoped<CanvasAssignmentGroupService>();
builder.Services.AddScoped<CanvasQuizService>();
builder.Services.AddScoped<CanvasModuleService>();
builder.Services.AddScoped<CanvasService, CanvasService>();

builder.Services.AddScoped<MarkdownCourseSaver>();
builder.Services.AddScoped<CourseMarkdownLoader>();
builder.Services.AddScoped<FileStorageManager>();

builder.Services.AddScoped<CoursePlanner>();
builder.Services.AddScoped<AssignmentEditorContext>();
builder.Services.AddScoped<QuizEditorContext>();
builder.Services.AddScoped<DragContainer>();

builder.Services.AddSingleton<FileConfiguration>();

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

app.MapBlazorHub();
app.MapFallbackToPage("/_Host");


app.Start();

var addresses = app.Services.GetService<IServer>()?.Features.Get<IServerAddressesFeature>()?.Addresses ?? [];

foreach (var address in addresses)
{
  Console.WriteLine("Running at: " + address);
}

app.WaitForShutdown();

