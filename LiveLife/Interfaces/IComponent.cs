using System.Text.Json.Serialization;
using LiveLife.PixelComponents;

namespace LiveLife.Interfaces;

[JsonPolymorphic(TypeDiscriminatorPropertyName = "type")]
[JsonDerivedType(typeof(SandComponent), "sand")]
public interface IComponent
{
}