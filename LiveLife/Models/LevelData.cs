using System.Text.Json.Serialization;

namespace LiveLife.Models;

public class LevelData
{
    [JsonPropertyName("size")]
    public int Size { get; set; }
    
    [JsonPropertyName("pixels")]
    public PixelType[] Pixels { get; set; } = [];
}