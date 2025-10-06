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
    var project = await db.Projects.FindAsync(template.RelatedProjectId);
    if (project == null)
    {
      return Results.BadRequest($"Project with Id '{template.RelatedProjectId}' does not exist.");
    }
    
    db.Templates.Add(template);
    
    // Add template ID to project's templates array
    var templatesList = project.Templates.ToList();
    templatesList.Add(template.Id);
    project.Templates = templatesList.ToArray();
    
    await db.SaveChangesAsync();
    return Results.Created($"/templates/{template.Id}", template);
  }

  public static async Task<IResult> UpdateTemplate(Guid id, Template template, AppDbContext db, ContentService.ContentServiceClient client)
  {
    var existingTemplate = await db.Templates.FindAsync(id);
    if (existingTemplate == null) return Results.NotFound();

    var projectExists = await db.Projects.AnyAsync(p => p.Id == template.RelatedProjectId);
    if (!projectExists)
    {
      return Results.BadRequest($"Project with Id '{template.RelatedProjectId}' does not exist.");
    }

    // Check if schema or other generation-relevant fields changed
    bool schemaChanged = existingTemplate.Schema != template.Schema;
    bool pathChanged = existingTemplate.Path != template.Path;
    
    if (schemaChanged || pathChanged)
    {
      // Increment version when schema or path changes
      template.Version = existingTemplate.Version + 1;
      
      // Mark old content as stale in Content service
      try
      {
        var markStaleRequest = new MarkContentAsStaleRequest
        {
          TemplateId = id.ToString(),
          FromVersion = existingTemplate.Version
        };
        await client.MarkContentAsStaleAsync(markStaleRequest);
      }
      catch (Exception ex)
      {
        Console.WriteLine($"Warning: Failed to mark content as stale: {ex.Message}");
        // Continue with template update even if stale marking fails
      }
    }
    else
    {
      // Keep the same version for non-generation changes
      template.Version = existingTemplate.Version;
    }

    template.Id = id;
    template.CreatedAt = existingTemplate.CreatedAt;
    template.CreatedBy = existingTemplate.CreatedBy;
    
    db.Entry(existingTemplate).CurrentValues.SetValues(template);
    await db.SaveChangesAsync();
    return Results.NoContent();
  }

  public static async Task<IResult> DeleteTemplate(Guid id, AppDbContext db)
  {
    var tpl = await db.Templates.FindAsync(id);
    if (tpl is null) return Results.NotFound();

    // Remove template ID from project's templates array
    var project = await db.Projects.FindAsync(tpl.RelatedProjectId);
    if (project != null)
    {
      var templatesList = project.Templates.ToList();
      templatesList.Remove(id);
      project.Templates = templatesList.ToArray();
    }

    db.Templates.Remove(tpl);
    await db.SaveChangesAsync();
    return Results.NoContent();
  }

  public static async Task<IResult> GenerateTemplateData(Guid id, AppDbContext db, ContentService.ContentServiceClient client, HttpContext context)
  {
    var template = await db.Templates.FindAsync(id);
    if (template is null) 
    {
      return Results.NotFound();
    }

    // Get user ID from JWT token
    var userId = context.User.FindFirst("sub")?.Value ?? 
                 context.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
    if (string.IsNullOrEmpty(userId))
    {
      return Results.Unauthorized();
    }

    // Get project title
    var project = await db.Projects.FindAsync(template.RelatedProjectId);
    var projectTitle = project?.Title ?? "Unknown Project";
    
    var request = new GenerateFromTemplateRequest
    {
      TemplateId = id.ToString(),
      TemplateVersion = template.Version,
      UserId = userId,
      TemplateName = template.Name,
      Schema = template.Schema,
      Path = template.Path ?? "",
      ProjectId = template.RelatedProjectId.ToString(),
      ProjectTitle = projectTitle
    };

    try
    {
      var response = await client.GenerateFromTemplateAsync(request);
      
      // Update template with generation tracking
      template.LastGeneratedAt = DateTimeOffset.UtcNow;
      template.LatestGeneratedVersion = template.Version;
      await db.SaveChangesAsync();
      
      return Results.Ok(new
      {
        ContentId = response.ContentId,
        Status = response.Status,
        Message = response.Message,
        TemplateId = response.TemplateId,
        TemplateVersion = response.TemplateVersion,
        ProjectId = response.ProjectId,
        EndpointPath = response.EndpointPath
      });
    }
    catch (Exception ex)
    {
      Console.WriteLine($"Error calling Content service: {ex.Message}");
      return Results.StatusCode(StatusCodes.Status500InternalServerError);
    }
  }

  public static async Task<IResult> GetGeneratedContentStatus(Guid id, AppDbContext db, ContentService.ContentServiceClient client)
  {
    try
    {
      var request = new GetGeneratedContentStatusRequest
      {
        ContentId = id.ToString()
      };

      var response = await client.GetGeneratedContentStatusAsync(request);
      
      if (!response.Success)
      {
        return Results.NotFound(new { Message = response.ErrorMessage });
      }

      // Get the template to check if content is stale
      var template = await db.Templates.FindAsync(Guid.Parse(response.TemplateId));
      var isStale = template != null && response.TemplateVersion < template.Version;

      // Determine the effective status
      string effectiveStatus = response.Status;
      if (isStale && response.Status == "Completed")
      {
        effectiveStatus = "Stale";
      }

      return Results.Ok(new
      {
        ContentId = response.ContentId,
        Status = effectiveStatus,
        TemplateId = response.TemplateId,
        TemplateVersion = response.TemplateVersion,
        ProjectId = response.ProjectId,
        EndpointPath = response.EndpointPath,
        CreatedAt = response.CreatedAt,
        UpdatedAt = response.UpdatedAt,
        IsStale = isStale,
        LatestTemplateVersion = template?.Version ?? response.TemplateVersion
      });
    }
    catch (Exception ex)
    {
      Console.WriteLine($"Error getting generated content status: {ex.Message}");
      return Results.StatusCode(StatusCodes.Status500InternalServerError);
    }
  }

}
