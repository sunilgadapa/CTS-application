using System.Threading.Tasks;

namespace OLDMutual.CTS.SnsNotification.Domain.Models
{
    public interface IHubClient
    {
        Task BroadcastMessage();
    }
}
