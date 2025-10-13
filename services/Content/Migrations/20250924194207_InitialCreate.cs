using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Content.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "GeneratedContent",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TemplateId = table.Column<Guid>(type: "uuid", nullable: false),
                    ProjectId = table.Column<Guid>(type: "uuid", nullable: false),
                    EndpointPath = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    GeneratedData = table.Column<string>(type: "jsonb", nullable: false),
                    Schema = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()"),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()"),
                    Status = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false, defaultValue: "Completed"),
                    TemplateName = table.Column<string>(type: "text", nullable: false),
                    ProjectTitle = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GeneratedContent", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_GeneratedContent_CreatedAt",
                table: "GeneratedContent",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_GeneratedContent_ProjectId_EndpointPath",
                table: "GeneratedContent",
                columns: new[] { "ProjectId", "EndpointPath" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_GeneratedContent_TemplateId",
                table: "GeneratedContent",
                column: "TemplateId");

            migrationBuilder.CreateIndex(
                name: "IX_GeneratedContent_UserId",
                table: "GeneratedContent",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "GeneratedContent");
        }
    }
}
