using CarShop.Domain.Common;
using CarShop.Domain.Entities.Catalog;
using CarShop.Domain.Entities.Commerce;
using CarShop.Domain.Entities.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CarShop.Domain.Entities.Commerce;

public sealed class CartEntity : BaseEntity
{
    public int UserId { get; set; }
    public CarShopUserEntity User { get; set; } = default!;

    public int CarId { get; set; }
    public CarEntity Car { get; set; }
    public decimal Subtotal { get; set; }
    public decimal Tax { get; set; }
    public decimal Total { get; private set; }
    public void RecalculateTotal()
    {
        Total = Subtotal + Tax;
    }
}
