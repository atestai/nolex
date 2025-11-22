using System.Data;
using Dapper;

namespace Nolex_server.ServiceProvider;

public static class DbInitializer
{
    public static async Task InitializeAsync(IServiceProvider services)
    {
        using var scope = services.CreateScope();
        var sp = scope.ServiceProvider;

        var conn = sp.GetRequiredService<IDbConnection>();
        var createSql = @"
            CREATE TABLE IF NOT EXISTS WeatherForecast (
                Id INTEGER PRIMARY KEY AUTOINCREMENT,
                Date TEXT NOT NULL,
                TemperatureC INTEGER NOT NULL,
                Summary TEXT
            );
        ";
        await conn.ExecuteAsync(createSql);

        var count = await conn.ExecuteScalarAsync<long>("SELECT COUNT(1) FROM WeatherForecast;");
        if (count == 0)
        {
            var insertSql = "INSERT INTO WeatherForecast (Date, TemperatureC, Summary) VALUES (@Date, @TemperatureC, @Summary);";

            var now = DateTime.UtcNow;
            var seeds = new[]
            {
                new { Date = now.AddDays(-1).ToString("o"), TemperatureC = 10, Summary = "Cloudy" },
                new { Date = now.ToString("o"), TemperatureC = 22, Summary = "Sunny" },
                new { Date = now.AddDays(1).ToString("o"), TemperatureC = 18, Summary = "Partly cloudy" },
                new { Date = now.AddDays(1).ToString("o"), TemperatureC = 18, Summary = "Partly cloudy" },
                new { Date = now.AddDays(-1).ToString("o"), TemperatureC = 10, Summary = "Cloudy" },
                new { Date = now.ToString("o"), TemperatureC = 22, Summary = "Sunny" },
                new { Date = now.AddDays(1).ToString("o"), TemperatureC = 18, Summary = "Partly cloudy" },
                new { Date = now.AddDays(1).ToString("o"), TemperatureC = 18, Summary = "Partly cloudy" }
            };

            using var tx = conn.BeginTransaction();
            foreach (var s in seeds)
            {
                await conn.ExecuteAsync(insertSql, s, tx);
            }
            tx.Commit();
        }

        await Task.CompletedTask;
    }
}
