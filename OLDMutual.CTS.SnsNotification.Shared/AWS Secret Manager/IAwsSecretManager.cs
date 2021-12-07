namespace OLDMutual.CTS.SnsNotification.Shared.AWS_Secret_Manager
{
    public interface IAwsSecretManager
    {
        string GetSecret(string secretName);
    }
}
