using Microsoft.Extensions.Configuration;
using Microsoft.Identity.Web;
using Microsoft.PowerBI.Api;
using Microsoft.Rest;
using OLDMutual.CTS.Reporting.Domain.Models;
using OLDMutual.CTS.Reporting.Service.Interfaces;
using System;
using System.Threading.Tasks;

namespace OLDMutual.CTS.Reporting.Service.Services
{

	public class PowerBiServiceApi: IPowerBiServiceApi
	{

		private ITokenAcquisition _tokenAcquisition { get; }
		private string _urlPowerBiServiceApiRoot { get; }

		public PowerBiServiceApi(IConfiguration configuration, ITokenAcquisition tokenAcquisition)
		{
			_urlPowerBiServiceApiRoot = configuration["PowerBI:urlPowerBiServiceApiRoot"];
			_tokenAcquisition = tokenAcquisition;
		}

		public static readonly string[] RequiredScopes = new string[] {
			"https://analysis.windows.net/powerbi/api/Report.Read.All"
		};

		// A method to get the Azure AD token (also known as 'access token')
		public string GetAccessToken()
		{
			return this._tokenAcquisition.GetAccessTokenForUserAsync(RequiredScopes).Result;
		}

		public PowerBIClient GetPowerBiClient()
		{
			var tokenCredentials = new TokenCredentials(GetAccessToken(), "Bearer");
			return new PowerBIClient(new Uri(_urlPowerBiServiceApiRoot), tokenCredentials);
		}

		public async Task<EmbeddedReportViewModel> GetReport(Guid WorkspaceId, Guid ReportId)
		{

			PowerBIClient pbiClient = GetPowerBiClient();

			// Call the Power BI Service API to get embedding data
			var report = await pbiClient.Reports.GetReportInGroupAsync(WorkspaceId, ReportId);

			// Return report embedding data to caller
			return new EmbeddedReportViewModel
			{
				Id = report.Id.ToString(),
				EmbedUrl = report.EmbedUrl,
				Name = report.Name,
				Token = GetAccessToken()
			};
		}

	}

}