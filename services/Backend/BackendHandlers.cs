using Microsoft.EntityFrameworkCore;
using MyService.Data;
using MyService.Models;

public static class BackendHandlers
{
  public static async Task<IEnumerable<Template>> GetTemplates(AppDbContext db)
      => await db.Templates.ToListAsync();

  public static async Task<IResult> GetTemplateById(Guid id, AppDbContext db)
  {
    var tpl = await db.Templates.FindAsync(id);
    return tpl is not null ? Results.Ok(tpl) : Results.NotFound();
  }

  public static async Task<IResult> CreateTemplate(Template template, AppDbContext db)
  {
    db.Templates.Add(template);
    await db.SaveChangesAsync();
    return Results.Created($"/templates/{template.Id}", template);
  }

  public static async Task<IResult> UpdateTemplate(Guid id, Template template, AppDbContext db)
  {
    var exists = await db.Templates.AnyAsync(t => t.Id == id);
    if (!exists) return Results.NotFound();

    template.Id = id;
    db.Entry(template).State = EntityState.Modified;
    await db.SaveChangesAsync();
    return Results.NoContent();
  }

  public static async Task<IResult> DeleteTemplate(Guid id, AppDbContext db)
  {
    var tpl = await db.Templates.FindAsync(id);
    if (tpl is null) return Results.NotFound();

    db.Templates.Remove(tpl);
    await db.SaveChangesAsync();
    return Results.NoContent();
  }
}