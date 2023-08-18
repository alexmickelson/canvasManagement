global using System.Text.Json.Serialization;
global using System.Text.Json;
global using System.ComponentModel.DataAnnotations;
global using Management.Services.Canvas;
global using CanvasModel.EnrollmentTerms;
global using CanvasModel.Courses;
global using CanvasModel;
global using LocalModels;
global using Management.Planner;
global using Management.Web.Shared.Components;
global using Management.Web.Shared;

using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using dotenv.net;

DotEnv.Load();

var builder = WebApplication.CreateBuilder(args);

var canvas_token = Environment.GetEnvironmentVariable("CANVAS_TOKEN");
if (canvas_token == null)
  throw new Exception("CANVAS_TOKEN is null");
var canvas_url = Environment.GetEnvironmentVariable("CANVAS_URL");
if (canvas_url == null)
{
  Console.WriteLine("CANVAS_URL is null, defaulting to https://snow.instructure.com");
  Environment.SetEnvironmentVariable("CANVAS_URL", "https://snow.instructure.com");
}

// Add services to the container.
builder.Services.AddRazorPages();
builder.Services.AddServerSideBlazor();

builder.Services.AddScoped<IWebRequestor, WebRequestor>();
builder.Services.AddScoped<CanvasServiceUtils>();
builder.Services.AddScoped<CanvasAssignmentService>();
builder.Services.AddScoped<CanvasQuizService>();
builder.Services.AddScoped<CanvasService, CanvasService>();

builder.Services.AddScoped<YamlManager>();
builder.Services.AddScoped<CoursePlanner>();
builder.Services.AddScoped<AssignmentEditorContext>();
builder.Services.AddScoped<QuizEditorContext>();
builder.Services.AddScoped<DragContainer>();

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

app.Run();
