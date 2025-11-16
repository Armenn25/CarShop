using CarShop.Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CarShop.Domain.Entities.Catalog;

public sealed class BrandEntity : BaseEntity
{
    public string BrandName { get; set; } = default!;

    public ICollection<CarEntity> Cars {  get; private set; }=new List<CarEntity>();
}
