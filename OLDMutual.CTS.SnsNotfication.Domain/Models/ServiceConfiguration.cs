namespace OLDMutual.CTS.SnsNotification.Domain.Models
{
    public class ServiceConfiguration
    {
        public AwsS3Configuration AWSS3 { get; set; }
    }
    public class AwsS3Configuration
    {
        public string BucketName { get; set; }
    }
}
