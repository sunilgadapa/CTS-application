using System.Threading.Tasks;

namespace OLDMutual.CTS.Reporting.Service.Interfaces
{
    public interface IAadService
    {
        /// <summary>
        /// Get Access token
        /// </summary>
        /// <returns>Access token</returns>
        Task<string> GetAccessToken();
    }
}
