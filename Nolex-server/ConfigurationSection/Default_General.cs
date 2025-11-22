using System;

namespace Nolex_server.ConfigurationSection;

public static class Default_General
{
    static Default_General()
    {
        AppName = "Nolex-server";
        Environment = "Development";
        Version = "0.9.0-alpha";
    }
    public static string AppName { get; set; }
    public static string Environment { get; set; }
    public static string Version { get; set; }  
    
}
