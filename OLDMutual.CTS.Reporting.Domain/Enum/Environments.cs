using System.Runtime.Serialization;

namespace OLDMutual.CTS.Reporting.Domain.Enum
{
    public enum Environments
    {
        [EnumMember(Value = "Dev")]
        Dev = 1,
        [EnumMember(Value = "Qa")]
        Qa = 2,
        [EnumMember(Value = "Uat")]
        Sat = 3,
        [EnumMember(Value = "prod")]
        prod = 4
    }
}
