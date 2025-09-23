using Microsoft.EntityFrameworkCore;
using MyService.Data;
using MyService.Models;
using System.Text;
using System.Text.Json;
using Shared.Content.Protos;

public static class BackendHandlers
{
  public class ProjectFilterParameters
  {
    public string? SearchString { get; set; }
    public Guid? Member { get; set; }
    public DateTimeOffset? CreatedAt { get; set; }
    public DateTimeOffset? UpdatedAt { get; set; }
    public Guid? CreatedBy { get; set; }
    public Guid? UpdatedBy { get; set; }
  }

  public class TemplateFilterParameters
  {
    public string? SearchString { get; set; }
    public DateTimeOffset? CreatedAt { get; set; }
    public DateTimeOffset? UpdatedAt { get; set; }
    public Guid? CreatedBy { get; set; }
    public Guid? UpdatedBy { get; set; }
    public Guid? RelatedProjectId { get; set; }
    public Guid? UsedIn { get; set; }
  }

  public static async Task<IEnumerable<Project>> GetProjects(
    [AsParameters] ProjectFilterParameters filters,
    AppDbContext db)
  {
    var query = db.Projects.AsQueryable();

    if (!string.IsNullOrEmpty(filters.SearchString))
      query = query.Where(project =>
        project.Title.Contains(filters.SearchString) ||
        project.Id.ToString().Contains(filters.SearchString) ||
        project.KeyWords.Any(k => k == filters.SearchString)
      );

    if (filters.Member.HasValue)
      query = query.Where(project => project.Members.Contains(filters.Member.Value));

    if (filters.CreatedAt.HasValue)
      query = query.Where(project => project.CreatedAt == filters.CreatedAt);

    if (filters.UpdatedAt.HasValue)
      query = query.Where(project => project.UpdatedAt == filters.UpdatedAt);

    if (filters.CreatedBy.HasValue)
      query = query.Where(project => project.CreatedBy == filters.CreatedBy);

    if (filters.UpdatedBy.HasValue)
      query = query.Where(project => project.UpdatedBy == filters.UpdatedBy);

    return await query.ToListAsync();
  }

  public static async Task<IResult> GetProjectById(Guid id, AppDbContext db)
  {
    var tpl = await db.Projects.FindAsync(id);
    return tpl is not null ? Results.Ok(tpl) : Results.NotFound();
  }

  public static async Task<IResult> CreateProject(Project project, AppDbContext db)
  {
    db.Projects.Add(project);
    await db.SaveProjectChangesAsync();
    return Results.Created($"/project/{project.Id}", project);
  }

  public static async Task<IResult> UpdateProject(Guid id, Project project, AppDbContext db)
  {
    var exists = await db.Projects.AnyAsync(t => t.Id == id);
    if (!exists) return Results.NotFound();

    project.Id = id;
    db.Entry(project).State = EntityState.Modified;
    await db.SaveProjectChangesAsync();
    return Results.NoContent();
  }

  public static async Task<IResult> DeleteProject(Guid id, AppDbContext db)
  {
    var tpl = await db.Projects.FindAsync(id);
    if (tpl is null) return Results.NotFound();

    db.Projects.Remove(tpl);
    await db.SaveProjectChangesAsync();
    return Results.NoContent();
  }

  public static async Task<IEnumerable<Template>> GetTemplates(
    [AsParameters] TemplateFilterParameters filters,
    AppDbContext db)
  {
    var query = db.Templates.AsQueryable();

    if (!string.IsNullOrEmpty(filters.SearchString))
      query = query.Where(template =>
        template.Name.Contains(filters.SearchString) ||
        template.Id.ToString().Contains(filters.SearchString) ||
        (template.Path != null && template.Path.Contains(filters.SearchString)) ||
        template.Tags.Any(tag => tag == filters.SearchString)
      );

    if (filters.CreatedAt.HasValue)
      query = query.Where(template => template.CreatedAt == filters.CreatedAt);

    if (filters.UpdatedAt.HasValue)
      query = query.Where(template => template.UpdatedAt == filters.UpdatedAt);

    if (filters.CreatedBy.HasValue)
      query = query.Where(template => template.CreatedBy == filters.CreatedBy);

    if (filters.UpdatedBy.HasValue)
      query = query.Where(template => template.UpdatedBy == filters.UpdatedBy);

    if (filters.RelatedProjectId.HasValue)
      query = query.Where(template => template.RelatedProjectId == filters.RelatedProjectId);

    if (filters.UsedIn.HasValue)
      query = query.Where(template => template.UsedIn.Contains(filters.UsedIn.Value));

    return await query.ToListAsync();
  }

  public static async Task<IResult> GetTemplateById(Guid id, AppDbContext db)
  {
    var tpl = await db.Templates.FindAsync(id);
    return tpl is not null ? Results.Ok(tpl) : Results.NotFound();
  }

  public static async Task<IResult> CreateTemplate(Template template, AppDbContext db)
  {
    var projectExists = await db.Projects.AnyAsync(p => p.Id == template.RelatedProjectId);
    if (!projectExists)
    {
      return Results.BadRequest($"Project with Id '{template.RelatedProjectId}' does not exist.");
    }
    db.Templates.Add(template);
    await db.SaveChangesAsync();
    return Results.Created($"/templates/{template.Id}", template);
  }

  public static async Task<IResult> UpdateTemplate(Guid id, Template template, AppDbContext db)
  {
    var exists = await db.Templates.AnyAsync(t => t.Id == id);
    if (!exists) return Results.NotFound();

    var projectExists = await db.Projects.AnyAsync(p => p.Id == template.RelatedProjectId);
    if (!projectExists)
    {
      return Results.BadRequest($"Project with Id '{template.RelatedProjectId}' does not exist.");
    }

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

  public static async Task<IResult> GenerateTemplateData(Guid id, AppDbContext db, ContentService.ContentServiceClient client, HttpContext context)
  {
    var template = await db.Templates.FindAsync(id);
    if (template is null) return Results.NotFound();

    // Get user ID from JWT token
    var userId = context.User.FindFirst("sub")?.Value;
    if (string.IsNullOrEmpty(userId))
    {
      return Results.Unauthorized();
    }

    // Create a new GeneratedContent record in Backend database to track the generation request
    var generatedContent = new GeneratedContent
    {
      Id = Guid.NewGuid(),
      TemplateId = id,
      ProjectId = template.RelatedProjectId,
      EndpointPath = template.Path ?? "",
      UserId = Guid.Parse(userId),
      Status = "Pending",
      CreatedAt = DateTimeOffset.UtcNow,
      UpdatedAt = DateTimeOffset.UtcNow
    };

    // Store in Backend database
    db.GeneratedContent.Add(generatedContent);
    await db.SaveChangesAsync();
    var request = new GenerateFromTemplateRequest
    {
      TemplateId = id.ToString(),
      UserId = userId
    };

    try
    {
      var response = await client.GenerateFromTemplateAsync(request);
      return Results.Ok(new
      {
        GeneratedContentId = generatedContent.Id,
        ContentServiceResponse = response
      });
    }
    catch (Exception)
    {
      return Results.StatusCode(StatusCodes.Status500InternalServerError);
    }
  }

  public static async Task<IResult> GetTemplateInfo(Guid id, ContentService.ContentServiceClient client)
  {
    try
    {
      var request = new GetTemplateRequest
      {
        TemplateId = id.ToString()
      };

      var response = await client.GetTemplateAsync(request);
      
      if (!response.Success)
      {
        return Results.NotFound(new { Message = response.ErrorMessage });
      }

      return Results.Ok(new
      {
        TemplateId = response.TemplateId,
        Name = response.Name,
        Schema = response.Schema,
        Path = response.Path,
        ProjectId = response.ProjectId,
        ProjectTitle = response.ProjectTitle
      });
    }
    catch (Exception)
    {
      return Results.StatusCode(StatusCodes.Status500InternalServerError);
    }
  }
}