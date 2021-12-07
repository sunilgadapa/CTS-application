using OLDMutual.CTS.Dashboard.Domain.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace OLDMutual.CTS.Dashboard.Data.Interfaces
{
    public interface IDashboardDao: IDisposable
    {     
        Task<IEnumerable<DataloadRecentErrorsDto>> GetDataLoadRecentErrors(int PageNumber, int Size);        
    }
}
