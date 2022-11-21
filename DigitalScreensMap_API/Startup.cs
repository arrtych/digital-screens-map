using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using DigitalScreensMap_API.Data;
using DigitalScreensMap_API.Models;
using DigitalScreensMap_API.Repository;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System.Reflection;
using Microsoft.OpenApi.Models;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc.Formatters;
using DigitalScreensMap_API.Exceptions;
using Microsoft.AspNetCore.Server.IISIntegration;
//using TestAuth2Mvc.Settings;
//using TestAuth2Mvc.Data;
//using TestAuth2Mvc.Identity.Models;
using Microsoft.AspNetCore.Identity;
//using TestAuth2Mvc.Identity;
//using TestAuth2Mvc.Services;
using Microsoft.AspNetCore.Authentication.Cookies;
using DigitalScreensMap_API.Auth;
using Microsoft.AspNetCore.Server.HttpSys;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.AspNetCore.Authentication.AzureAD.UI;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Negotiate;
using Microsoft.Extensions.DependencyInjection;

namespace DigitalScreensMap_API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }


        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            //services.AddCors(options =>
            //{
            //    options.AddPolicy("CorsPolicy", builder =>
            //        builder.AllowAnyOrigin()
            //        .AllowAnyMethod()
            //        .AllowAnyHeader());
            //});

            services.AddCors();
            //services.AddAuthentication(IISDefaults.AuthenticationScheme);
            //services.AddAuthentication(NegotiateDefaults.AuthenticationScheme).AddNegotiate();


            services.AddMvc(option => option.EnableEndpointRouting = false);

            services.AddDbContext<MonitorContex>(opts => opts.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));
            services.AddScoped<IMonitorRepository, MonitorRepository>();
            services.AddScoped<IRoomRepository, RoomRepository>();
            services.AddScoped<IVesselRepository, VesselRepository>();
            services.AddScoped<IImageRepository, ImageRepository>();
            services.AddScoped<IPositionRepository, PositionRepository>();
            services.AddScoped<IUserRepository, UserRepository>();

            //var config = new ConfigurationBuilder()
            //    .SetBasePath(Directory.GetCurrentDirectory())
            //    .AddJsonFile("config/appsettings.json", false)
            //    .Build();

            //services.AddAuthentication(AzureADDefaults.AuthenticationScheme)
            //    .AddAzureAD(options => config.Bind("AzureAd", options));

            //services.AddAuthorization(options =>
            //{
            //    options.AddPolicy("admin-only", p =>
            //    {
            //        p.RequireClaim("groups", "b07f4f99-ecf3-44d2-9053-986e192d23f7");
            //    });
            //});
            services.AddControllers();


            //services.Configure<LdapSettings>(Configuration.GetSection("LdapSettings"));

            //services.AddDbContext<LdapDbContext>(options =>
            //    options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));
            //services.AddIdentity<LdapUser, IdentityRole>()
            //    .AddEntityFrameworkStores<LdapDbContext>()
            //    .AddUserManager<LdapUserManager>()
            //    .AddSignInManager<LdapSignInManager>()
            //    .AddDefaultTokenProviders();



            // Add application services.
            //services.AddTransient<ILdapService, LdapService>();

            //services.AddAuthorization(options =>
            //{
            //    options.AddPolicy("AdGroup-DomainAdmins", policy =>
            //                    policy.RequireClaim("AdGroup", "Domain Admins"));
            //});



            var appSettingsSection = Configuration.GetSection("AppSettings");
            services.Configure<AppSettings>(appSettingsSection);
            //JWT Authentication
            var appSettings = appSettingsSection.Get<AppSettings>();
            var key = Encoding.ASCII.GetBytes(appSettings.Key);
            services.AddAuthentication(auth =>
            {
                auth.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                auth.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(jwt =>
            {
                jwt.RequireHttpsMetadata = false;
                jwt.SaveToken = true;
                jwt.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false
                };

            });

            //services.AddAuthorization(options =>
            //{
            //    options.AddPolicy("AtLeast21", policy => policy.RequireRole("FLEET\\Domain Admin"));
            //});


            // Setup the custom simple role authorization with
            // "DemoSimpleRoleProvider" implementation to provide the roles for a user.
            //services.AddSimpleRoleAuthorization<DemoSimpleRoleProvider>();
            //services.Configure<IISServerOptions>(options =>
            //{
            //    options.AutomaticAuthentication = false;
            //});



            // Register the Swagger generator, defining 1 or more Swagger documents
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "DigitalScreenMap API",
                    Version = "v1",
                    Description = "A simple ASP.NET Core Web API for monitors on vessels",
                });
                // Set the comments path for the Swagger JSON and UI.
                var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
                c.IncludeXmlComments(xmlPath);
            });



        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                app.UseHsts();
            }


            // Enable middleware to serve generated Swagger as a JSON endpoint.
            app.UseSwagger(c =>
            {
                //c.RouteTemplate = "/swagger/{documentName}/swagger.json";
            });

            // Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.),
            // specifying the Swagger JSON endpoint.
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "DigitalScreensMap_API");
                //c.RoutePrefix = "DigitalScreensMap_API/swagger";
            });

            /*
            http://localhost:54369/swagger/index.html
            http://localhost:54369/swagger/v1/swagger.json
             */
            // Handles exceptions and generates a custom response body
            //app.UseExceptionHandler("/errors/500");
            app.UseExceptionHandler(config =>
            {
                config.Run(async context =>
                {
                    context.Response.StatusCode = 500;
                    context.Response.ContentType = "application/json";

                    var error = context.Features.Get<IExceptionHandlerFeature>();
                    if (error != null)
                    {
                        var e = error.Error;
                        await context.Response.WriteAsync(new ErrorDto()
                        {
                            Code = 500,
                            Message = e.Message
                        }.ToString(), Encoding.UTF8);
                    }
                });
            });


            // Handles non-success status codes with empty body
            //app.UseStatusCodePagesWithReExecute("/errors/{0}");


            app.UseHttpsRedirection();
            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseCors(
               options => options.SetIsOriginAllowed(x => _ = true).AllowAnyMethod().AllowAnyHeader().AllowCredentials()
            );
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
            //app.UseCors(builder => builder.AllowAnyOrigin());
            //app.UseCors(MyAllowSpecificOrigins);
            //app.UseCors("CorsPolicy");
            //app.UseCors(
            //    options => options.WithOrigins("http://localhost:54369/", "http://localhost:3000/").AllowAnyMethod().AllowAnyHeader().AllowCredentials()
            //); ;
           
            app.UseDefaultFiles();
            app.UseStaticFiles();

            app.Run(async (context) => { await context.Response.WriteAsync("Could not Find anything"); });



        }
    }
}
