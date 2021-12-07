using OLDMutual.CTS.Dashboard.Data.Interfaces;
using OLDMutual.CTS.Dashboard.Domain.Models;
using OLDMutual.CTS.Dashboard.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace OLDMutual.CTS.Dashboard.Service.Services
{
    public class DashboardService : IDashboardService
    {
        private readonly IDashboardDao _dashboardDao;

        public DashboardService(IDashboardDao dashboardDao)
        {
            _dashboardDao = dashboardDao;
        }

        public async Task<IEnumerable<DataloadRecentErrorsDto>> GetDataLoadRecentErrors(int PageNumber, int Size)
        {
            return await _dashboardDao.GetDataLoadRecentErrors(PageNumber, Size);
        }
    }
}
