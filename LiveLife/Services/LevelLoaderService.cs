using LiveLife.Models;

namespace LiveLife.Services;

public class LevelLoaderService(int gridSize)
{
    private readonly List<Pixel> _world = [];
    
    public List<Pixel> GenerateWorldByLevel(int level)
    {
        switch (level)
        {
            case 1:
                GenerateLevel1();
                break;
            case 2:
                GenerateLevel2();
                break;
            default:
                ClearWorld();
                break;
        }

        return _world;
    }

    private void GenerateLevel1()
    {
        ClearWorld();

        _world[244].Type = PixelType.Water;
    }
    
    private void GenerateLevel2()
    {
        ClearWorld();

        _world[129].Type = PixelType.Stone;
        _world[130].Type = PixelType.Stone;
        _world[131].Type = PixelType.Stone;
        _world[132].Type = PixelType.Stone;
    }

    private void ClearWorld()
    {
        _world.Clear();
        
        for (var i = 0; i < gridSize * gridSize; i++)
        {
            _world.Add(new Pixel
            {
                X = i % gridSize,
                Y = i / gridSize,
                Type = PixelType.Empty
            });
        }
    }
}