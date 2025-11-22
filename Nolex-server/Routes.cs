using System;
using System.Data;
using Dapper;
using Nolex_server.Models;

namespace Nolex_server;

public static class Routes
{
    public static void MapInfoEndPoint( this WebApplication app )
    {
        app.MapGet("/info",
            static (IServiceProvider sp) => 
            {
                try
                {
                    if (sp.GetService(typeof(IDbConnection)) is IDbConnection _db)
                    {
                        var result = _db.QueryFirstOrDefault<string>("SELECT datetime('now');");
                        return Results.Json(new { message = "Nolex Server is running!", databaseTime = result });   
                    }
                }
                catch (System.Exception ex)
                {
                    var _logger = sp.GetService<ILogger<WebApplication>>();
                    _logger?.LogError(ex, "Database connection failed.");
                    return Results.StatusCode(500);
                }

                return Results.StatusCode(500);
            }

        ).WithName("GetInfo");


        app.MapGet("/frontendConfig",
            static (IServiceProvider sp) => 
            {
                try
                {
                    return Results.Json(new
                    {
                        query = ConfigurationSection.Default_FrontendSearch.Query,
                        searchBy = ConfigurationSection.Default_FrontendSearch.SearchBy
                    });
                }
                catch (Exception ex)
                {
                    var _logger = sp.GetService<ILogger<WebApplication>>();
                    _logger?.LogError(ex, "Database connection failed.");   
                    return Results.StatusCode(500);
                }
            }
        ).WithName("GetFrontendConfig");


        app.MapGet("weatherForecast",
            async (IServiceProvider sp) =>
            {
                try
                {
                    var repo = sp.GetService<WeatherForecastRepository>();
                    if (repo != null)
                    {
                        var weatherForecasts = await repo.GetAllAsync();
                        return Results.Json(new { weatherForecasts });
                    }
                }
                catch (Exception ex)
                {
                    var _logger = sp.GetService<ILogger<WebApplication>>();
                    _logger?.LogError(ex, "Database connection failed.");
                    return Results.StatusCode(500);
                }

                return Results.StatusCode(500);
            }
        ).WithName("GetWeatherForecast");

        app.MapGet("weatherForecast/{id:int}",
            async (int id, IServiceProvider sp) =>
            {
                try
                {
                    var repo = sp.GetService<WeatherForecastRepository>();
                    if (repo != null)
                    {
                        var weatherForecast = await repo.GetByIdAsync(id);
                        if (weatherForecast != null)
                        {
                            return Results.Json(new { weatherForecast });
                        }
                        else
                        {
                            return Results.NotFound();
                        }
                    }
                }
                catch (Exception ex)
                {
                    var _logger = sp.GetService<ILogger<WebApplication>>();
                    _logger?.LogError(ex, "Database connection failed.");
                    return Results.StatusCode(500);
                }

                return Results.StatusCode(500);
            }
        ).WithName("GetWeatherForecastById");
    }        
}
