using OLDMutual.CTS.Dashboard.Domain.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace OLDMutual.CTS.Dashboard.Service.Interfaces
{
    public interface IDashboardService
    {
        Task<IEnumerable<DataloadRecentErrorsDto>> GetDataLoadRecentErrors(int PageNumber, int Size);
    }
}
