using System;

namespace Nolex_server.ConfigurationSection;

public static class Default_Database
{
    static Default_Database()
    {
        LimitRecords = 100;
        DbPath = "database.sqlite";
    }
    public static int LimitRecords { get; set; }
    public static string DbPath { get; set; }

}
