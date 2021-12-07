using System.Data.SqlClient;

namespace OLDMutual.CTS.Reporting.Shared.Configuration
{
    public interface IConfigurationSettings
    {
        SqlConnectionStringBuilder GetConnectionString();
        /// <summary>
        /// Get Enviroment data
        /// </summary>
        /// <returns>dev/qa/prod</returns>
        (string, string) GetEnvironment();
    }
}
