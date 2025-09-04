using System.Text.Json;
using System.Text.Json.Serialization;
using System.Globalization;
using Backend.Utils;

namespace Backend.Serialization;

public class UtcMillisecondsConverter : JsonConverter<DateTimeOffset>
{
  private const string Format = "yyyy-MM-dd'T'HH:mm:ss.fff'Z'";

  public override DateTimeOffset Read(ref Utf8JsonReader reader,
                                      Type typeToConvert,
                                      JsonSerializerOptions options)
      => DateTimeOffset.Parse(reader.GetString()!, CultureInfo.InvariantCulture,
                              DateTimeStyles.AssumeUniversal).UtcDateTruncateToMilliseconds();

  public override void Write(Utf8JsonWriter writer,
                             DateTimeOffset value,
                             JsonSerializerOptions options)
      => writer.WriteStringValue(value.UtcDateTruncateToMilliseconds()
                                      .ToString(Format, CultureInfo.InvariantCulture));
}