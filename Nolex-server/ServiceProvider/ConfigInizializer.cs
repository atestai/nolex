using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace Nolex_server.ServiceProvider;

public class ParseError
{
    public int Line { get; set; }
    public string Message { get; set; } = string.Empty;
}

public class ParseResult
{
    public string File { get; set; } = string.Empty;
    public string Path { get; set; } = string.Empty;
    public Dictionary<string, Dictionary<string, string>> Data { get; set; } = new(StringComparer.OrdinalIgnoreCase);
    public List<ParseError> Errors { get; set; } = new();
    public bool HasErrors => Errors.Count > 0;
    public string? FileError { get; set; }
}
public static class ConfigInizializer
{

    private static void TryLoadConfigurationAssemblies()
    {
        try
        {
            var baseDir = AppContext.BaseDirectory;
            var configsDir = Path.Combine(baseDir, "Configurations");
            if (!Directory.Exists(configsDir))
                return;

            var dlls = Directory.EnumerateFiles(configsDir, "*.dll", SearchOption.TopDirectoryOnly);
            foreach (var dll in dlls)
            {
                try
                {
                    // If already loaded, skip
                    var name = AssemblyName.GetAssemblyName(dll);
                    if (AppDomain.CurrentDomain.GetAssemblies().Any(a => AssemblyName.ReferenceMatchesDefinition(a.GetName(), name)))
                        continue;

                    Assembly.LoadFrom(dll);
                    Console.WriteLine($"INFO: Loaded config assembly {Path.GetFileName(dll)}");
                }
                catch
                {
                    // ignore failures to load individual assemblies
                }
            }
        }
        catch
        {
            // non-fatal
        }
    }

    public static async Task InitializeAsync(IServiceProvider services)
    {
        using var scope = services.CreateScope();
        var sp = scope.ServiceProvider;

        var logger = sp.GetRequiredService<ILogger<Program>>();
        logger.LogInformation("Configuration initialization started.");

        try
        {
            var baseDir = AppContext.BaseDirectory;
            var path = Path.Combine(baseDir, "appConfigs");

            var results = await ParseIniDirectoryAsync(path).ConfigureAwait(false);

            if (results == null || results.Count == 0)
            {
                Console.WriteLine("WARN: No .ini configuration files found in the directory.");
                return;
            }

            Console.WriteLine($"INFO: ✓ Parsed {results.Count} configuration file(s).");

            // Try to pre-load any assemblies found in Configurations directory (optional, safe attempt)
            TryLoadConfigurationAssemblies();

            foreach (var result in results)
            {
                if (result.HasErrors)
                {
                    Console.WriteLine($"WARN: Configuration file {result.File} has errors and may not be fully loaded.");
                    foreach (var err in result.Errors)
                    {
                        Console.WriteLine($"   Line {err.Line}: {err.Message}");
                    }
                    if (!string.IsNullOrEmpty(result.FileError))
                        Console.WriteLine($"   File error: {result.FileError}");
                }
                else
                {
                    Console.WriteLine($"INFO: Configuration file {result.File} loaded successfully.");
                }

                foreach (var section in result.Data)
                {
                    if (string.IsNullOrEmpty(section.Key))
                        continue;
                    await LoadAndConfigureClassAsync(section.Key, section.Value).ConfigureAwait(false);
                }
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error during configuration initialization.");
        }

        logger.LogInformation("Configuration initialization completed.");
        await Task.CompletedTask;
    }

    private static async Task<List<ParseResult>> ParseIniDirectoryAsync(string directoryPath)
    {
        var results = new List<ParseResult>();

        if (!Directory.Exists(directoryPath))
        {
            // Mirror JS behavior: log and return empty list (or throw if you prefer)
            Console.WriteLine($"WARN: Directory not found: {directoryPath}");
            return results;
        }

        var iniFiles = Directory.EnumerateFiles(directoryPath, "*.ini", SearchOption.TopDirectoryOnly);

        foreach (var filePath in iniFiles)
        {
            var pr = new ParseResult
            {
                File = System.IO.Path.GetFileName(filePath),
                Path = filePath
            };

            try
            {
                var lines = await File.ReadAllLinesAsync(filePath).ConfigureAwait(false);

                const string globalSection = "";
                string currentSection = globalSection;
                if (!pr.Data.ContainsKey(globalSection))
                    pr.Data[globalSection] = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);

                for (int i = 0; i < lines.Length; i++)
                {
                    var lineNumber = i + 1;
                    var raw = lines[i] ?? string.Empty;
                    var line = raw.Trim();

                    if (string.IsNullOrEmpty(line) || line.StartsWith(";") || line.StartsWith("#"))
                        continue;

                    if (line.StartsWith("[") && line.Contains("]"))
                    {
                        var endIdx = line.IndexOf(']');
                        if (endIdx > 1)
                        {
                            var sectionName = line.Substring(1, endIdx - 1).Trim();
                            if (string.IsNullOrEmpty(sectionName))
                            {
                                pr.Errors.Add(new ParseError { Line = lineNumber, Message = "Empty section name" });
                            }
                            else
                            {
                                currentSection = sectionName;
                                if (!pr.Data.ContainsKey(currentSection))
                                    pr.Data[currentSection] = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
                            }
                        }
                        else
                        {
                            pr.Errors.Add(new ParseError { Line = lineNumber, Message = "Malformed section header" });
                        }
                        continue;
                    }

                    var eqIdx = line.IndexOf('=');
                    if (eqIdx > 0)
                    {
                        var key = line.Substring(0, eqIdx).Trim();
                        var value = line.Substring(eqIdx + 1).Trim();

                        if (value.Length >= 2 &&
                            ((value.StartsWith("\"") && value.EndsWith("\"")) || (value.StartsWith("'") && value.EndsWith("'"))))
                        {
                            value = value.Substring(1, value.Length - 2);
                        }

                        if (string.IsNullOrEmpty(key))
                        {
                            pr.Errors.Add(new ParseError { Line = lineNumber, Message = "Empty key before '='" });
                            continue;
                        }

                        if (!pr.Data.ContainsKey(currentSection))
                            pr.Data[currentSection] = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);

                        pr.Data[currentSection][key] = value;
                    }
                    else
                    {
                        pr.Errors.Add(new ParseError { Line = lineNumber, Message = "Unrecognized or malformed line" });
                    }
                }
            }
            catch (Exception ex)
            {
                pr.FileError = ex.Message;
            }

            results.Add(pr);
        }

        return results;
    }

    private static async Task LoadAndConfigureClassAsync(string moduleName, Dictionary<string, string> configValues)
    {
        // Behavior mirror JS: class name = "Default_{moduleName}"
        var className = $"Default_{moduleName}";

        // Try to locate the type in loaded assemblies
        var type = GetTypeByName(className);
        if (type == null)
        {
            Console.WriteLine($"WARN: Could not find type '{className}' in loaded assemblies.");
            return;
        }

        // For each key/value, try to set a public static property or field on the type
        foreach (var kv in configValues)
        {
            var key = kv.Key;
            var rawValue = kv.Value;

            // First find a property (case-insensitive)
            var prop = type.GetProperties(BindingFlags.Public | BindingFlags.Static)
                           .FirstOrDefault(p => string.Equals(p.Name, key, StringComparison.OrdinalIgnoreCase));

            if (prop != null)
            {
                try
                {
                    var converted = ConvertToType(rawValue, prop.PropertyType);
                    prop.SetValue(null, converted);
                    Console.WriteLine($"✓ Set {className}.{prop.Name} = {converted} ({prop.PropertyType.Name})");
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"WARN: Failed to set property {className}.{prop.Name}: {ex.Message}");
                }
                continue;
            }

            // Next fallback to fields (case-insensitive)
            var field = type.GetFields(BindingFlags.Public | BindingFlags.Static)
                            .FirstOrDefault(f => string.Equals(f.Name, key, StringComparison.OrdinalIgnoreCase));

            if (field != null)
            {
                try
                {
                    var converted = ConvertToType(rawValue, field.FieldType);
                    field.SetValue(null, converted);
                    Console.WriteLine($"✓ Set {className}.{field.Name} = {converted} ({field.FieldType.Name})");
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"WARN: Failed to set field {className}.{field.Name}: {ex.Message}");
                }
                continue;
            }

            // If not found, optionally create or skip; we'll log
            Console.WriteLine($"WARN: {className} does not contain a public static property or field named '{key}'.");
        }

        await Task.CompletedTask;
    }

    private static Type? GetTypeByName(string simpleName)
    {
        try
        {
            var assemblies = AppDomain.CurrentDomain.GetAssemblies();

            foreach (var asm in assemblies)
            {
                Type[] types;
                try
                {
                    types = asm.GetTypes();
                }
                catch (ReflectionTypeLoadException ex)
                {
                    types = ex.Types.Where(t => t != null).ToArray()!;
                }

                foreach (var t in types)
                {
                    if (t == null) continue;
                    if (string.Equals(t.Name, simpleName, StringComparison.OrdinalIgnoreCase))
                        return t;
                }
            }
        }
        catch
        {
            // ignore
        }
        return null;
    }

    private static object? ConvertToType(string raw, Type targetType)
    {
        if (targetType == typeof(string))
            return raw;

        var underlying = Nullable.GetUnderlyingType(targetType) ?? targetType;

        try
        {
            if (underlying.IsEnum)
            {
                if (Enum.TryParse(underlying, raw, true, out var enumVal))
                    return enumVal;
                // if numeric enum
                if (long.TryParse(raw, out var enumNum))
                    return Enum.ToObject(underlying, enumNum);
            }

            if (underlying == typeof(bool))
            {
                if (bool.TryParse(raw, out var b)) return b;
                // accept 0/1
                if (int.TryParse(raw, out var ib)) return ib != 0;
            }

            if (underlying == typeof(int))
            {
                if (int.TryParse(raw, out var i)) return i;
            }

            if (underlying == typeof(long))
            {
                if (long.TryParse(raw, out var l)) return l;
            }

            if (underlying == typeof(double))
            {
                if (double.TryParse(raw, System.Globalization.NumberStyles.Any, System.Globalization.CultureInfo.InvariantCulture, out var d)) return d;
            }

            if (underlying == typeof(decimal))
            {
                if (decimal.TryParse(raw, System.Globalization.NumberStyles.Any, System.Globalization.CultureInfo.InvariantCulture, out var m)) return m;
            }

            if (underlying == typeof(DateTime))
            {
                if (DateTime.TryParse(raw, System.Globalization.CultureInfo.InvariantCulture, System.Globalization.DateTimeStyles.RoundtripKind, out var dt))
                    return dt;
                if (DateTime.TryParse(raw, out dt))
                    return dt;
            }

            // fallback to ChangeType if possible
            return Convert.ChangeType(raw, underlying, System.Globalization.CultureInfo.InvariantCulture);
        }
        catch
        {
            return raw;
        }
    }

}
