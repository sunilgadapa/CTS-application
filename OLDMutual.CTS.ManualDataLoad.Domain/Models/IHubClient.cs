using System.Threading.Tasks;

namespace OLDMutual.CTS.ManualDataLoad.Domain.Models
{
    public interface IHubClient
    {
        Task BroadcastMessage();
    }
}
