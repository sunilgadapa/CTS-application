using Amazon.SecretsManager;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Identity.Web;
using Microsoft.OpenApi.Models;
using OLDMutual.CTS.UserManagement.Data.Dapper_ORM.Dapper;
using OLDMutual.CTS.UserManagement.Data.Data_Access_Layer;
using OLDMutual.CTS.UserManagement.Data.Interfaces;
using OLDMutual.CTS.UserManagement.Service.Interfaces;
using OLDMutual.CTS.UserManagement.Service.Services;
using OLDMutual.CTS.UserManagement.Shared.AWS_Secret_Manager;
using OLDMutual.CTS.UserManagement.Shared.Configuration;

namespace OLDMutual.CTS.UserManagement
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
            services.AddCors();
            services.AddControllers()
                .AddJsonOptions(options =>
                        options.JsonSerializerOptions.PropertyNamingPolicy = null);
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "OLDMutual.CTS.UserManagement", Version = "v1" });
            });          
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            services.AddSingleton<IDapper, Dapperr>();
            services.AddSingleton<IConfigurationSettings, ConfigurationSettings>();
            services.AddSingleton<IAwsSecretManager, AwsSecretManager>();
            services.AddAWSService<IAmazonSecretsManager>();
            services.AddScoped<IUserManagementService, UserManagementService>();
            services.AddScoped<IUserManagement, UserManagementDao>();                  
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddMicrosoftIdentityWebApi(Configuration,"AzureAd");
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "OLDMutual.CTS.UserManagement v1"));
            }
            app.UseCors(x => x
                .AllowAnyMethod()
                .AllowAnyHeader()
                .SetIsOriginAllowed(origin => true) // allow any origin
                .AllowCredentials()); // allow credentials
            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
