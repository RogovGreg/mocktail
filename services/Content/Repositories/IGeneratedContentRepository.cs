using Content.Entities;

namespace Content.Repositories;

public interface IGeneratedContentRepository
{
    Task<GeneratedContent?> GetByIdAsync(Guid id);
    Task<GeneratedContent?> GetByProjectAndPathAsync(Guid projectId, string endpointPath);
    Task<IEnumerable<GeneratedContent>> GetByUserIdAsync(Guid userId);
    Task<IEnumerable<GeneratedContent>> GetByProjectIdAsync(Guid projectId);
    Task<IEnumerable<GeneratedContent>> GetByTemplateIdAsync(Guid templateId);
    Task<GeneratedContent> AddAsync(GeneratedContent content);
    Task<GeneratedContent> UpdateAsync(GeneratedContent content);
    Task UpdateStatusAndDataAsync(Guid id, string status, string generatedData);
    Task<bool> DeleteAsync(Guid id);
    Task<bool> ExistsAsync(Guid projectId, string endpointPath);
}
