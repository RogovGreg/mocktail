using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Content.Migrations
{
    /// <inheritdoc />
    public partial class AddTemplateVersionToGeneratedContent : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TemplateVersion",
                table: "GeneratedContent",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TemplateVersion",
                table: "GeneratedContent");
        }
    }
}
