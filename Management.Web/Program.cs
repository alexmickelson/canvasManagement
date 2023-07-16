global using System.Text.Json.Serialization;
global using System.Text.Json;
global using System.ComponentModel.DataAnnotations;

using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using dotenv.net;

DotEnv.Load();

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorPages();
builder.Services.AddServerSideBlazor();
builder.Services.AddSingleton<IWebRequestor, WebRequestor>();
builder.Services.AddSingleton<CanvasService, CanvasService>();
builder.Services.AddSingleton<CoursePlanner>();
builder.Services.AddSingleton<AssignmentDragContainer>();
builder.Services.AddScoped<StorageManagement>();

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
