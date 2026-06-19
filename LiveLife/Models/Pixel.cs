using System.Drawing;
using System.Numerics;

namespace LiveLife.Models;

public class Pixel
{
    public int X { get; set; }
    public int Y { get; set; }
    public PixelType Type { get; set; } = PixelType.Empty;
}