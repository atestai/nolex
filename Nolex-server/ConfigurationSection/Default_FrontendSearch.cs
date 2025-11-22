using System;

namespace Nolex_server.ConfigurationSection;

public class Default_FrontendSearch
{
    static Default_FrontendSearch()
    {
        Query = "";
        SearchBy = "name";
    }
    public static string Query { get; set; }
    public static string SearchBy { get; set; }
}
