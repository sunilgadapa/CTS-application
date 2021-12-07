using Amazon.SecretsManager;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Identity.Web;
using Microsoft.OpenApi.Models;
using OLDMutual.CTS.Reporting.Data.Dapper_ORM.Dapper;
using OLDMutual.CTS.Reporting.Data.Data_Access_Layer;
using OLDMutual.CTS.Reporting.Data.Interfaces;
using OLDMutual.CTS.Reporting.Domain.Models;
using OLDMutual.CTS.Reporting.Service.Interfaces;
using OLDMutual.CTS.Reporting.Service.Services;
using OLDMutual.CTS.Reporting.Shared.AWS_Secret_Manager;
using OLDMutual.CTS.Reporting.Shared.Configuration;

namespace OLDMutual.CTS.Reporting
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
            services
           .AddMicrosoftIdentityWebAppAuthentication(Configuration)
           .EnableTokenAcquisitionToCallDownstreamApi(PowerBiServiceApi.RequiredScopes)
           .AddInMemoryTokenCaches();

            services.AddCors();
            services.AddControllers()
                .AddJsonOptions(options =>
                        options.JsonSerializerOptions.PropertyNamingPolicy = null);
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "OLDMutual.CTS.Reporting", Version = "v1" });
            });           
            //Register dapper in scope    
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            services.AddSingleton<IDapper, Dapperr>();
            services.AddSingleton<IConfigurationSettings, ConfigurationSettings>();
            services.AddSingleton<IAwsSecretManager, AwsSecretManager>();
            services.AddAWSService<IAmazonSecretsManager>();
            services.AddScoped<IPowerBIReportLogService, PowerBIReportLogService>();
            services.AddScoped<IAadService, AadService>();
            services.AddScoped<IEmbedService, EmbedService>();
            services.AddScoped<IPowerBiServiceApi, PowerBiServiceApi>();
            services.AddScoped<IConfigValidatorService, ConfigValidatorService>();
            services.AddScoped<IPowerBiReportLogDao, PowerBiReportLogDao>();

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddMicrosoftIdentityWebApi(Configuration, "AzureAd");

            var powerBISetting = Configuration.GetSection("PowerBI");
            services.Configure<PowerBISettings>(powerBISetting);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "OLDMutual.CTS.Reporting v1"));
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
