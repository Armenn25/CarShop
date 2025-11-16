using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CarShop.Domain.Common;

namespace CarShop.Domain.Entities.Identity;
public sealed class UserRoleEntity : BaseEntity
{
    public string RoleName { get; set; } = default!;
    public string? RoleDescription { get; set; }

    public ICollection<CarShopUserEntity> Users { get; private set; } = new List<CarShopUserEntity>();
}
