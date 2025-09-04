namespace Backend.Utils;

public static class DateTimeExtensions
{
  private static readonly TimeSpan _1ms = TimeSpan.FromMilliseconds(1);

  public static DateTimeOffset UtcDateTruncateToMilliseconds(this DateTimeOffset source)
      => new DateTimeOffset(source.UtcDateTime
                                 .AddTicks(-source.UtcDateTime.Ticks % _1ms.Ticks),
                            TimeSpan.Zero);
}
