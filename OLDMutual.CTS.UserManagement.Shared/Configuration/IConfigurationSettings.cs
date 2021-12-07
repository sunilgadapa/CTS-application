using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Text;

namespace OLDMutual.CTS.UserManagement.Shared.Configuration
{
    public interface IConfigurationSettings
    {
        SqlConnectionStringBuilder GetConnectionString();
    }
}
