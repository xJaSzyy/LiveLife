namespace LiveLife.Models;

public class Pixel
{
    public int X { get; set; }
    public int Y { get; set; }
    public PixelType Type { get; set; } = PixelType.Empty;

    public IComponent? Component { get; set; }
}

public interface IComponent;
public class SandComponent : IComponent
{
    public float Humidity { get; set; } = 0;
}