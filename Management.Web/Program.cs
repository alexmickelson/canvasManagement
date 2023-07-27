global using System.Text.Json.Serialization;
global using System.Text.Json;
global using System.ComponentModel.DataAnnotations;
global using CanvasModel.EnrollmentTerms;
global using CanvasModel.Courses;
global using CanvasModel;
global using LocalModels;
global using Management.Web.Shared.Components;
global using Management.Web.Shared.Course;

using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using dotenv.net;

DotEnv.Load();

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorPages();
builder.Services.AddServerSideBlazor();
builder.Services.AddScoped<ICanvasTokenManagement, BrowserStorageManagement>();
builder.Services.AddScoped<IWebRequestor, WebRequestor>();
builder.Services.AddScoped<CanvasService, CanvasService>();
builder.Services.AddSingleton<YamlManager>();
builder.Services.AddSingleton<CoursePlanner>();
builder.Services.AddSingleton<AssignmentDragContainer>();

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
