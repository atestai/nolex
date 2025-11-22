
using Nolex_server;
using System.Data;
using Microsoft.Data.Sqlite;
using Nolex_server.ServiceProvider;
using Nolex_server.ConfigurationSection;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddScoped<IDbConnection>(sp =>
{
    var connStr = builder.Configuration.GetConnectionString("DefaultConnection") ?? $"Data Source={Default_Database.DbPath};";   
    var c = new SqliteConnection(connStr);
    c.Open(); 
    return c;
});


builder.Services.AddOpenApi();

var repositoryTypes = typeof(Program).Assembly.GetTypes()
    .Where(t => t.Name.EndsWith("Repository") && !t.IsAbstract && !t.IsInterface);

foreach (var type in repositoryTypes)
{
    builder.Services.AddScoped(type);
}


var app = builder.Build();
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    await ConfigInizializer.InitializeAsync(services);
    await DbInitializer.InitializeAsync(services);
}

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.MapInfoEndPoint();

await app.RunAsync();

