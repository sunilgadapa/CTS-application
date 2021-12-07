namespace OLDMutual.CTS.UserManagement.Shared.AWS_Secret_Manager
{
    public interface IAwsSecretManager
    {
        string GetSecret(string secretName);
    }
}
