using System.Data;
using Dapper;

namespace Nolex_server.Models;

public record WeatherForecastModel
{
    public int Id { get; set; } = 0;
    public DateTime Date { get; set; } = DateTime.Now;
    public int TemperatureC { get; set; } = 0;
    public string? Summary { get; set; }

    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}


public class WeatherForecastRepository(IDbConnection db) : ARepository<WeatherForecastModel>
{   
    private readonly IDbConnection _db = db;

    override public async Task<IEnumerable<WeatherForecastModel>> GetAllAsync( int offset = 0, int limit = 100)
    {
        var result = _db.QueryAsync<WeatherForecastModel>("SELECT * FROM WeatherForecast LIMIT @Offset, @Limit;", 
        new { Offset = offset, Limit = limit });
        
        return await result;
    }

    override public async Task<WeatherForecastModel?> GetByIdAsync(int id)
    {
        var result = await _db.QueryFirstOrDefaultAsync<WeatherForecastModel>(
            "SELECT * FROM WeatherForecast WHERE Id = @Id;",
            new { Id = id }
        );
        return result;
    }
}
