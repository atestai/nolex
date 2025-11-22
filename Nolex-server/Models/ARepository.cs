using System;

namespace Nolex_server.Models;

public class ARepository<T> : IRepository<T>
{
    public virtual Task<int> CreateAsync(T item)
    {
        throw new NotImplementedException();
    }

    public virtual Task<bool> DeleteAsync(int id)
    {
        throw new NotImplementedException();
    }

    public virtual Task<IEnumerable<T>> GetAllAsync( int offset = 0, int limit = 100)
    {
        throw new NotImplementedException();
    }

    public virtual Task<T?> GetByIdAsync(int id)
    {
        throw new NotImplementedException();
    }

    public virtual Task<bool> UpdateAsync(T item)
    {
        throw new NotImplementedException();
    }
}
