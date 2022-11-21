using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace DigitalScreensMap_API.Migrations
{
    public partial class db_v2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Monitors_Rooms_RoomId",
                table: "Monitors");

            migrationBuilder.DropForeignKey(
                name: "FK_Monitors_Vessels_VesselId",
                table: "Monitors");

            migrationBuilder.DropForeignKey(
                name: "FK_Positions_Monitors_Id",
                table: "Positions");

            migrationBuilder.DropForeignKey(
                name: "FK_Rooms_Vessels_VesselId",
                table: "Rooms");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Vessels",
                table: "Vessels");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Rooms",
                table: "Rooms");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Positions",
                table: "Positions");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Monitors",
                table: "Monitors");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "Vessels");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "Rooms");

            migrationBuilder.DropColumn(
                name: "ImageSource",
                table: "Rooms");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "Positions");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "Monitors");

            migrationBuilder.DropColumn(
                name: "IP_address",
                table: "Monitors");

            migrationBuilder.DropColumn(
                name: "MAC_address",
                table: "Monitors");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Vessels",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddColumn<long>(
                name: "VesselId",
                table: "Vessels",
                nullable: false,
                defaultValue: 0L)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AlterColumn<long>(
                name: "VesselId",
                table: "Rooms",
                nullable: true,
                oldClrType: typeof(long),
                oldType: "bigint");

            migrationBuilder.AddColumn<long>(
                name: "RoomId",
                table: "Rooms",
                nullable: false,
                defaultValue: 0L)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddColumn<long>(
                name: "PositionId",
                table: "Positions",
                nullable: false,
                defaultValue: 0L)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddColumn<long>(
                name: "MonitorId",
                table: "Positions",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AlterColumn<long>(
                name: "VesselId",
                table: "Monitors",
                nullable: true,
                oldClrType: typeof(long),
                oldType: "bigint");

            migrationBuilder.AlterColumn<long>(
                name: "RoomId",
                table: "Monitors",
                nullable: true,
                oldClrType: typeof(long),
                oldType: "bigint");

            migrationBuilder.AlterColumn<string>(
                name: "Code",
                table: "Monitors",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddColumn<long>(
                name: "MonitorId",
                table: "Monitors",
                nullable: false,
                defaultValue: 0L)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddColumn<string>(
                name: "IpAddress",
                table: "Monitors",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MacAddress",
                table: "Monitors",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Vessels",
                table: "Vessels",
                column: "VesselId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Rooms",
                table: "Rooms",
                column: "RoomId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Positions",
                table: "Positions",
                column: "PositionId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Monitors",
                table: "Monitors",
                column: "MonitorId");

            migrationBuilder.CreateTable(
                name: "Images",
                columns: table => new
                {
                    ImageId = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ImageTitle = table.Column<string>(nullable: true),
                    ImageData = table.Column<byte[]>(nullable: true),
                    RoomId = table.Column<long>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Images", x => x.ImageId);
                    table.ForeignKey(
                        name: "FK_Images_Rooms_RoomId",
                        column: x => x.RoomId,
                        principalTable: "Rooms",
                        principalColumn: "RoomId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Positions_MonitorId",
                table: "Positions",
                column: "MonitorId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Images_RoomId",
                table: "Images",
                column: "RoomId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Monitors_Rooms_RoomId",
                table: "Monitors",
                column: "RoomId",
                principalTable: "Rooms",
                principalColumn: "RoomId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Monitors_Vessels_VesselId",
                table: "Monitors",
                column: "VesselId",
                principalTable: "Vessels",
                principalColumn: "VesselId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Positions_Monitors_MonitorId",
                table: "Positions",
                column: "MonitorId",
                principalTable: "Monitors",
                principalColumn: "MonitorId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Rooms_Vessels_VesselId",
                table: "Rooms",
                column: "VesselId",
                principalTable: "Vessels",
                principalColumn: "VesselId",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Monitors_Rooms_RoomId",
                table: "Monitors");

            migrationBuilder.DropForeignKey(
                name: "FK_Monitors_Vessels_VesselId",
                table: "Monitors");

            migrationBuilder.DropForeignKey(
                name: "FK_Positions_Monitors_MonitorId",
                table: "Positions");

            migrationBuilder.DropForeignKey(
                name: "FK_Rooms_Vessels_VesselId",
                table: "Rooms");

            migrationBuilder.DropTable(
                name: "Images");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Vessels",
                table: "Vessels");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Rooms",
                table: "Rooms");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Positions",
                table: "Positions");

            migrationBuilder.DropIndex(
                name: "IX_Positions_MonitorId",
                table: "Positions");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Monitors",
                table: "Monitors");

            migrationBuilder.DropColumn(
                name: "VesselId",
                table: "Vessels");

            migrationBuilder.DropColumn(
                name: "RoomId",
                table: "Rooms");

            migrationBuilder.DropColumn(
                name: "PositionId",
                table: "Positions");

            migrationBuilder.DropColumn(
                name: "MonitorId",
                table: "Positions");

            migrationBuilder.DropColumn(
                name: "MonitorId",
                table: "Monitors");

            migrationBuilder.DropColumn(
                name: "IpAddress",
                table: "Monitors");

            migrationBuilder.DropColumn(
                name: "MacAddress",
                table: "Monitors");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Vessels",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string));

            migrationBuilder.AddColumn<long>(
                name: "Id",
                table: "Vessels",
                type: "bigint",
                nullable: false,
                defaultValue: 0L)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AlterColumn<long>(
                name: "VesselId",
                table: "Rooms",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(long),
                oldNullable: true);

            migrationBuilder.AddColumn<long>(
                name: "Id",
                table: "Rooms",
                type: "bigint",
                nullable: false,
                defaultValue: 0L)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddColumn<string>(
                name: "ImageSource",
                table: "Rooms",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "Id",
                table: "Positions",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AlterColumn<long>(
                name: "VesselId",
                table: "Monitors",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(long),
                oldNullable: true);

            migrationBuilder.AlterColumn<long>(
                name: "RoomId",
                table: "Monitors",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(long),
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Code",
                table: "Monitors",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string));

            migrationBuilder.AddColumn<long>(
                name: "Id",
                table: "Monitors",
                type: "bigint",
                nullable: false,
                defaultValue: 0L)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddColumn<string>(
                name: "IP_address",
                table: "Monitors",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MAC_address",
                table: "Monitors",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Vessels",
                table: "Vessels",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Rooms",
                table: "Rooms",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Positions",
                table: "Positions",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Monitors",
                table: "Monitors",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Monitors_Rooms_RoomId",
                table: "Monitors",
                column: "RoomId",
                principalTable: "Rooms",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Monitors_Vessels_VesselId",
                table: "Monitors",
                column: "VesselId",
                principalTable: "Vessels",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Positions_Monitors_Id",
                table: "Positions",
                column: "Id",
                principalTable: "Monitors",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Rooms_Vessels_VesselId",
                table: "Rooms",
                column: "VesselId",
                principalTable: "Vessels",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
