namespace OLDMutual.CTS.DataSubmission.Domain.Models
{
    public class ViewUnPromotedData
    {
        public int Sars_Unpromoted_Data_Id { get; set; }
        public int Record_NO { get; set; }
        public string Client_ID { get; set; }
        public string Policy_NO { get; set; }
        public string Product_Code { get; set; }
        public string Product_Instance { get; set; }
        public string Source_System { get; set; }
        public string Fund_Entity { get; set; }
        public string Unpromoted_reason { get; set; }
        public int totalrows { get; set; }
    }
}
