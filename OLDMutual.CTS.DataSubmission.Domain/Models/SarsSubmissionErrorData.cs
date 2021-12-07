namespace OLDMutual.CTS.DataSubmission.Domain.Models
{
    public class SarsSubmissionErrorData
    {
        public int Row_Id { get; set; }
        public int Row_Number { get; set; }
        public string F014_Section_Identifier { get; set; }
        public string F015_Record_Type { get; set; }
        public string F016_Record_Status { get; set; }
        public string F017_Unique_Number { get; set; }
        public int F018_Row_Number { get; set; }
        public string F019_Transaction_Due_Date { get; set; }
        public string F020_Dividend_Declarant { get; set; }
        public string F021_Dividend_Declarant { get; set; }
        public bool Status_Flag { get; set; }
        public int TotalRows { get; set; }
    }
}
