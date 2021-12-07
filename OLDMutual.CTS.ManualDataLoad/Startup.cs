using Amazon.S3;
using Amazon.SecretsManager;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Identity.Web;
using Microsoft.OpenApi.Models;
using OLDMutual.CTS.ManualDataLoad.Data.Dapper_ORM.Dapper;
using OLDMutual.CTS.ManualDataLoad.Data.Data_Access_Layer;
using OLDMutual.CTS.ManualDataLoad.Data.Interfaces;
using OLDMutual.CTS.ManualDataLoad.Domain.Models;
using OLDMutual.CTS.ManualDataLoad.Service.Interfaces;
using OLDMutual.CTS.ManualDataLoad.Service.Services;
using OLDMutual.CTS.ManualDataLoad.Shared.AWS_Secret_Manager;
using OLDMutual.CTS.ManualDataLoad.Shared.Configuration;

namespace OLDMutual.CTS.ManualDataLoad
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
            services.AddSignalR();
            services.AddControllers()
                .AddJsonOptions(options =>
                        options.JsonSerializerOptions.PropertyNamingPolicy = null);
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "OLDMutual.CTS.ManualDataLoad", Version = "v1" });
            });           
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            services.AddSingleton<IDapper, Dapperr>();
            services.AddSingleton<IConfigurationSettings, ConfigurationSettings>();
            services.AddSingleton<IAwsSecretManager, AwsSecretManager>();
            services.AddAWSService<IAmazonSecretsManager>();
            services.AddScoped<IManualDataLoadService, ManualDataLoadService>();
            services.AddAWSService<IAmazonS3>();
            services.AddScoped<IManualDataLoad, ManualDataLoadDao>();
            services.AddScoped<IAwsS3File, AwsS3FileDao>();
            services.AddTransient<IAwsS3BucketFileService, AwsS3BucketFileService>();
            services.AddTransient<IAwsS3BucketHelperService, AwsS3BucketHelperService>();                       
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddMicrosoftIdentityWebApi(Configuration, "AzureAd");
            
            services.Configure<FormOptions>(x =>
            {
                x.MultipartBodyLengthLimit = 209715200;
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "OLDMutual.CTS.ManualDataLoad v1"));
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

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapHub<BroadcastHub>("/notify");
            });
        }
    }
}
