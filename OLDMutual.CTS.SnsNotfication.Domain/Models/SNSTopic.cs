namespace OLDMutual.CTS.SnsNotification.Domain.Models
{
    public class SnsTopic
    {
        public long id { get; set; }
        public string topicArn { get; set; }
        public string subscriberName { get; set; }
        public string subscriberEmail { get; set; }
        public string message { get; set; }

        public string subject { get; set; }

    }
}
