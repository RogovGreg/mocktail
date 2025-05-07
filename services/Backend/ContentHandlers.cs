using Shared.Content.Protos;
using Grpc.Core;

public static class ContentHandlers
{
    public static async Task<IResult> GetContent(string userId, ContentService.ContentServiceClient client)
    {
        var request = new ListContentRequest { UserId = userId };
        var response = await client.ListContentAsync(new Shared.Content.Protos.ListContentRequest { UserId = userId });
        return Results.Json(response.Items);
    }

    public static async Task<IResult> CreateContent(CreateContentRequest request, ContentService.ContentServiceClient client)
    {
        if (string.IsNullOrEmpty(request.UserId))
        {
            return Results.BadRequest("UserId is required");
        }
        if (string.IsNullOrEmpty(request.ContentBody))
        {
            return Results.BadRequest("ContentBody is required");
        }

        var response = await client.CreateContentAsync(new Shared.Content.Protos.CreateContentRequest { UserId = request.UserId, ContentBody = request.ContentBody });
        return Results.Ok(response.Item);
    }
}

public record CreateContentRequest(string UserId, string ContentBody);
public record ContentItem(string Id, string UserId, string ContentBody, string CreatedAt);
