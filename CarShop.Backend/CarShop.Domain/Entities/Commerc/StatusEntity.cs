using CarShop.Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace CarShop.Domain.Entities.Commerc;

public sealed class StatusEntity:BaseEntity
{
    public string StatusName { get; set; } = default!;
    public string? Description { get; set; }

    public ICollection<InquiryEntity> Inquiries {  get;private set; }=new List<InquiryEntity>();
}
