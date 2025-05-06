using Shared.Content.Protos;
using Grpc.Core;

public static class ContentHandlers
{
    public static async Task<IResult> GetContent(string userId, ContentService.ContentServiceClient client)
    {
        var request = new ListContentRequest { UserId = userId };
        var response = await client.ListContentAsync(new Shared.Content.Protos.ListContentRequest { UserId = userId });
        return Results.Ok(response.Items);
    }

    public static async Task<IResult> CreateContent(CreateContentRequest request, ContentService.ContentServiceClient client)
    {
        var response = await client.CreateContentAsync(new Shared.Content.Protos.CreateContentRequest { UserId = request.UserId, ContentBody = request.ContentBody });
        return Results.Ok(response.Item);
    }
}

public record CreateContentRequest(string UserId, string ContentBody);
public record ContentItem(string Id, string UserId, string ContentBody, string CreatedAt);
