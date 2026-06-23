using System.Text.Json.Serialization;
using LiveLife.Interfaces;

namespace LiveLife.Models;

public class LevelData
{
    [JsonPropertyName("size")]
    public int Size { get; set; }
    
    [JsonPropertyName("pixels")]
    public List<PixelData> Pixels { get; set; } = [];
}

public class PixelData
{
    [JsonPropertyName("type")]
    public PixelType Type { get; set; } = PixelType.Empty;
    
    [JsonPropertyName("component")]
    public IComponent? Component { get; set; }
}