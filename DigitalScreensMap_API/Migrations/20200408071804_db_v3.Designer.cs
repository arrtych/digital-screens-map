﻿// <auto-generated />
using System;
using DigitalScreensMap_API.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace DigitalScreensMap_API.Migrations
{
    [DbContext(typeof(MonitorContex))]
    [Migration("20200408071804_db_v3")]
    partial class db_v3
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "3.1.2")
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("DigitalScreensMap_API.Models.Image", b =>
                {
                    b.Property<long>("ImageId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<byte[]>("ImageData")
                        .HasColumnType("varbinary(max)");

                    b.Property<string>("ImageTitle")
                        .HasColumnType("nvarchar(max)");

                    b.Property<long>("RoomId")
                        .HasColumnType("bigint");

                    b.HasKey("ImageId");

                    b.HasIndex("RoomId")
                        .IsUnique();

                    b.ToTable("Images");
                });

            modelBuilder.Entity("DigitalScreensMap_API.Models.Monitor", b =>
                {
                    b.Property<long>("MonitorId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Code")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Info")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("IpAddress")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("MacAddress")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.Property<long?>("RoomId")
                        .HasColumnType("bigint");

                    b.Property<long?>("VesselId")
                        .HasColumnType("bigint");

                    b.HasKey("MonitorId");

                    b.HasIndex("RoomId");

                    b.HasIndex("VesselId");

                    b.ToTable("Monitors");
                });

            modelBuilder.Entity("DigitalScreensMap_API.Models.Position", b =>
                {
                    b.Property<long>("PositionId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<long>("MonitorId")
                        .HasColumnType("bigint");

                    b.Property<int>("x1")
                        .HasColumnType("int");

                    b.Property<int>("x2")
                        .HasColumnType("int");

                    b.Property<int>("y1")
                        .HasColumnType("int");

                    b.Property<int>("y2")
                        .HasColumnType("int");

                    b.HasKey("PositionId");

                    b.HasIndex("MonitorId")
                        .IsUnique();

                    b.ToTable("Positions");
                });

            modelBuilder.Entity("DigitalScreensMap_API.Models.Room", b =>
                {
                    b.Property<long>("RoomId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.Property<long?>("VesselId")
                        .HasColumnType("bigint");

                    b.HasKey("RoomId");

                    b.HasIndex("VesselId");

                    b.ToTable("Rooms");
                });

            modelBuilder.Entity("DigitalScreensMap_API.Models.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("FirstName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("LastName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Password")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Token")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Username")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("DigitalScreensMap_API.Models.Vessel", b =>
                {
                    b.Property<long?>("VesselId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("VesselId");

                    b.ToTable("Vessels");
                });

            modelBuilder.Entity("DigitalScreensMap_API.Models.Image", b =>
                {
                    b.HasOne("DigitalScreensMap_API.Models.Room", "Room")
                        .WithOne("Image")
                        .HasForeignKey("DigitalScreensMap_API.Models.Image", "RoomId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("DigitalScreensMap_API.Models.Monitor", b =>
                {
                    b.HasOne("DigitalScreensMap_API.Models.Room", "Room")
                        .WithMany("Monitor")
                        .HasForeignKey("RoomId");

                    b.HasOne("DigitalScreensMap_API.Models.Vessel", "Vessel")
                        .WithMany("Monitors")
                        .HasForeignKey("VesselId");
                });

            modelBuilder.Entity("DigitalScreensMap_API.Models.Position", b =>
                {
                    b.HasOne("DigitalScreensMap_API.Models.Monitor", "Monitor")
                        .WithOne("Position")
                        .HasForeignKey("DigitalScreensMap_API.Models.Position", "MonitorId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("DigitalScreensMap_API.Models.Room", b =>
                {
                    b.HasOne("DigitalScreensMap_API.Models.Vessel", "Vessel")
                        .WithMany("Rooms")
                        .HasForeignKey("VesselId");
                });
#pragma warning restore 612, 618
        }
    }
}
