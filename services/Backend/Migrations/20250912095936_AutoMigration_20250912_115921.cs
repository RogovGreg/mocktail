using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class AutoMigration_20250912_115921 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Endpoints",
                table: "Projects");

            migrationBuilder.RenameColumn(
                name: "KeyWords",
                table: "Templates",
                newName: "Tags");

            migrationBuilder.RenameColumn(
                name: "templates",
                table: "Projects",
                newName: "Templates");

            migrationBuilder.AddColumn<string>(
                name: "Path",
                table: "Templates",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<List<string>>(
                name: "KeyWords",
                table: "Projects",
                type: "text[]",
                nullable: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Path",
                table: "Templates");

            migrationBuilder.DropColumn(
                name: "KeyWords",
                table: "Projects");

            migrationBuilder.RenameColumn(
                name: "Tags",
                table: "Templates",
                newName: "KeyWords");

            migrationBuilder.RenameColumn(
                name: "Templates",
                table: "Projects",
                newName: "templates");

            migrationBuilder.AddColumn<List<Guid>>(
                name: "Endpoints",
                table: "Projects",
                type: "uuid[]",
                nullable: true);
        }
    }
}
