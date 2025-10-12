using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Content.Migrations
{
    /// <inheritdoc />
    public partial class RemoveUniqueConstraintOnProjectIdEndpointPath : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_GeneratedContent_ProjectId_EndpointPath",
                table: "GeneratedContent");

            migrationBuilder.CreateIndex(
                name: "IX_GeneratedContent_ProjectId_EndpointPath",
                table: "GeneratedContent",
                columns: new[] { "ProjectId", "EndpointPath" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_GeneratedContent_ProjectId_EndpointPath",
                table: "GeneratedContent");

            migrationBuilder.CreateIndex(
                name: "IX_GeneratedContent_ProjectId_EndpointPath",
                table: "GeneratedContent",
                columns: new[] { "ProjectId", "EndpointPath" },
                unique: true);
        }
    }
}
