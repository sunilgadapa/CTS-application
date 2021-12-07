using System;
using System.Collections.Generic;
using System.Text;

namespace OLDMutual.CTS.Identity.Shared.AWS_Secret_Manager
{
    public interface IAwsSecretManager
    {
        string GetSecret(string secretName);
    }
}
