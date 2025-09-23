using Microsoft.EntityFrameworkCore;
using Content.Data;
using Content.Entities;

namespace Content.Repositories;

public class GeneratedContentRepository : IGeneratedContentRepository
{
    private readonly ContentDbContext _context;

    public GeneratedContentRepository(ContentDbContext context)
    {
        _context = context;
    }

    public async Task<GeneratedContent?> GetByIdAsync(Guid id)
    {
        return await _context.GeneratedContent
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<GeneratedContent?> GetByProjectAndPathAsync(Guid projectId, string endpointPath)
    {
        return await _context.GeneratedContent
            .FirstOrDefaultAsync(x => x.ProjectId == projectId && x.EndpointPath == endpointPath);
    }

    public async Task<IEnumerable<GeneratedContent>> GetByUserIdAsync(Guid userId)
    {
        return await _context.GeneratedContent
            .Where(x => x.UserId == userId)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<GeneratedContent>> GetByProjectIdAsync(Guid projectId)
    {
        return await _context.GeneratedContent
            .Where(x => x.ProjectId == projectId)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<GeneratedContent>> GetByTemplateIdAsync(Guid templateId)
    {
        return await _context.GeneratedContent
            .Where(x => x.TemplateId == templateId)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync();
    }

    public async Task<GeneratedContent> AddAsync(GeneratedContent content)
    {
        content.CreatedAt = DateTimeOffset.UtcNow;
        content.UpdatedAt = DateTimeOffset.UtcNow;
        
        _context.GeneratedContent.Add(content);
        await _context.SaveChangesAsync();
        
        return content;
    }

    public async Task<GeneratedContent> UpdateAsync(GeneratedContent content)
    {
        content.UpdatedAt = DateTimeOffset.UtcNow;
        
        _context.GeneratedContent.Update(content);
        await _context.SaveChangesAsync();
        
        return content;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var content = await _context.GeneratedContent.FindAsync(id);
        if (content == null)
            return false;

        _context.GeneratedContent.Remove(content);
        await _context.SaveChangesAsync();
        
        return true;
    }

    public async Task<bool> ExistsAsync(Guid projectId, string endpointPath)
    {
        return await _context.GeneratedContent
            .AnyAsync(x => x.ProjectId == projectId && x.EndpointPath == endpointPath);
    }
}
