namespace Nolex_server.Models;

public interface IRepository<T>
{
    Task<IEnumerable<T>> GetAllAsync( int offset = 0, int limit = 100);
    Task<T?> GetByIdAsync(int id);
    Task<int> CreateAsync(T item);
    Task<bool> UpdateAsync(T item);
    Task<bool> DeleteAsync(int id);
}
