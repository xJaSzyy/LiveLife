using System.Text.Json;
using LiveLife.Models;

namespace LiveLife.Services;

public class LevelLoaderService(HttpClient http, int gridSize)
{
    public async Task<List<Pixel>> GenerateWorldByLevel(int level)
    {
        var world = await GenerateLevel(level);

        return world ?? GetEmptyWorld();
    }

    private async Task<List<Pixel>?> GenerateLevel(int level)
    {
        return await LoadLevel("level" + level);
    }
    
    private async Task<List<Pixel>?> LoadLevel(string name)
    {
        var world = new List<Pixel>();

        try
        {
            var json = await http.GetStringAsync($"levels/{name}.json");

            var level = JsonSerializer.Deserialize<LevelData>(json);

            if (level == null)
            {
                return null;
            }

            for (var i = 0; i < level.Pixels.Length; i++)
            {
                world.Add(new Pixel
                {
                    X = i % gridSize,
                    Y = i / gridSize,
                    Type = level.Pixels[i]
                });
            }

            return world;
        }
        catch
        {
            return null;
        }
    }
    
    private List<Pixel> GetEmptyWorld()
    {
        var world = new List<Pixel>();
        
        for (var i = 0; i < gridSize * gridSize; i++)
        {
            world.Add(new Pixel
            {
                X = i % gridSize,
                Y = i / gridSize,
                Type = PixelType.Empty
            });
        }

        return world;
    }
}