using CarShop.Domain.Entities.Commerc;

namespace CarShop.Infrastructure.Database.Seeders;

/// <summary>
/// Dynamic seeder koji se pokreće u runtime-u,
/// obično pri startu aplikacije (npr. u Program.cs).
/// Koristi se za unos demo/test podataka koji nisu dio migracije.
/// </summary>
public static class DynamicDataSeeder
{
    public static async Task SeedAsync(DatabaseContext context)
    {
        // Osiguraj da baza postoji (bez migracija)
        //await context.Database.EnsureCreatedAsync();

        //await SeedUserRolesAsync(context);
        //await SeedUsersAsync(context);
        //await SeedStatusesAsync(context);
        //await SeedCategoriesAsync(context);
        //await SeedBrandsAsync(context);
        //await SeedCarsAsync(context);
        //await SeedInquiriesAsync(context);
        //await SeedReviewsAsync(context);
    }

    private static async Task SeedUserRolesAsync(DatabaseContext context)
    {
        if (await context.UserRoles.AnyAsync())
            return;

        var now = DateTime.UtcNow;
        var roles = new[]
        {
            new UserRoleEntity
            {
                RoleName = "Admin",
                RoleDescription = "Pun pristup administraciji sistema.",
                CreatedAtUtc = now
            },
            new UserRoleEntity
            {
                RoleName = "Manager",
                RoleDescription = "Upravljanje ponudom vozila i korisnicima.",
                CreatedAtUtc = now
            },
            new UserRoleEntity
            {
                RoleName = "Customer",
                RoleDescription = "Krajnji korisnik koji pregledava vozila.",
                CreatedAtUtc = now
            }
        };

        await context.UserRoles.AddRangeAsync(roles);
        await context.SaveChangesAsync();
        Console.WriteLine("✅ Dynamic seed: user roles added.");
    }

    /// <summary>
    /// Kreira demo korisnike ako ih još nema u bazi.
    /// </summary>
    private static async Task SeedUsersAsync(DatabaseContext context)
    {
        if (await context.Users.AnyAsync())
            return;

        var roles = await context.UserRoles.AsNoTracking().ToDictionaryAsync(x => x.RoleName, x => x.Id);
        if (roles.Count == 0)
            return;

        var hasher = new PasswordHasher<CarShopUserEntity>();
        var now = DateTime.UtcNow;

        var users = new[]
        {
            new CarShopUserEntity
            {
                Username = "admin",
                Email = "admin@carshop.local",
                PasswordHash = hasher.HashPassword(null!, "Admin123!"),
                FirstName = "Admin",
                LastName = "User",
                Phone = "+385911234567",
                Address = "Admin Street 1",
                RoleId = roles["Admin"],
                IsActive = true,
                RegistrationDate = now,
                LastLoginDate = now,
                CreatedAtUtc = now
            },
            new CarShopUserEntity
            {
                Username = "manager",
                Email = "manager@carshop.local",
                PasswordHash = hasher.HashPassword(null!, "User123!"),
                FirstName = "Market",
                LastName = "Manager",
                Phone = "+385981112223",
                Address = "Manager Street 1",
                RoleId = roles["Manager"],
                IsActive = true,
                RegistrationDate = now,
                CreatedAtUtc = now
            },
            new CarShopUserEntity
            {
                Username = "demo",
                Email = "demo@carshop.local",
                PasswordHash = hasher.HashPassword(null!, "Demo123!"),
                FirstName = "Demo",
                LastName = "User",
                Phone = "+385991112233",
                Address = "Demo Street 1",
                RoleId = roles["Customer"],
                IsActive = true,
                RegistrationDate = now,
                CreatedAtUtc = now
            },
            new CarShopUserEntity
            {
                Username = "tester",
                Email = "tester@carshop.local",
                PasswordHash = hasher.HashPassword(null!, "Tester123!"),
                FirstName = "Test",
                LastName = "Account",
                Phone = "+385971234567",
                Address = "Test Street 1",
                RoleId = roles["Customer"],
                IsActive = true,
                RegistrationDate = now,
                CreatedAtUtc = now
            }
        };

        await context.Users.AddRangeAsync(users);
        await context.SaveChangesAsync();
        Console.WriteLine("✅ Dynamic seed: demo users added.");
    }

    private static async Task SeedStatusesAsync(DatabaseContext context)
    {
        if (await context.Statuses.AnyAsync())
            return;

        var now = DateTime.UtcNow;
        var statuses = new[]
        {
            new StatusEntity
            {
                StatusName = "Available",
                Description = "Vozilo je dostupno za kupnju.",
                CreatedAtUtc = now
            },
            new StatusEntity
            {
                StatusName = "Reserved",
                Description = "Vozilo je rezervirano za kupca.",
                CreatedAtUtc = now
            },
            new StatusEntity
            {
                StatusName = "Sold",
                Description = "Vozilo je prodano.",
                CreatedAtUtc = now
            },
            new StatusEntity
            {
                StatusName = "Pending",
                Description = "Upit je zaprimljen i čeka obradu.",
                CreatedAtUtc = now
            },
            new StatusEntity
            {
                StatusName = "Completed",
                Description = "Upit je kompletiran.",
                CreatedAtUtc = now
            },
            new StatusEntity
            {
                StatusName = "Failed",
                Description = "Upit nije uspio.",
                CreatedAtUtc = now
            },
            new StatusEntity
            {
                StatusName = "Cancelled",
                Description = "Upit je otkazan.",
                CreatedAtUtc = now
            },
            new StatusEntity
            {
                StatusName = "Shipped",
                Description = "Vozilo je poslano.",
                CreatedAtUtc = now
            },
            new StatusEntity
            {
                StatusName = "Delivered",
                Description = "Vozilo je dostavljeno.",
                CreatedAtUtc = now
            },
            new StatusEntity
            {
                StatusName = "OutForDelivery",
                Description = "Vozilo je na dostavi.",
                CreatedAtUtc = now
            },
            new StatusEntity
            {
                StatusName = "Requested",
                Description = "Upit je zaprimljen i čeka obradu.",
                CreatedAtUtc = now
            },
            new StatusEntity
            {
                StatusName = "Confirmed",
                Description = "Upit je odobrne.",
                CreatedAtUtc = now
            },
            new StatusEntity
            {
                StatusName = "Responded",
                Description = "Na upit je odgovoreno kupcu.",
                CreatedAtUtc = now
            }
        };

        await context.Statuses.AddRangeAsync(statuses);
        await context.SaveChangesAsync();
        Console.WriteLine("✅ Dynamic seed: statuses added.");
    }

    private static async Task SeedCategoriesAsync(DatabaseContext context)
    {
        if (await context.Categories.AnyAsync())
            return;

        var now = DateTime.UtcNow;
        var categories = new[]
        {
            new CategoryEntity { CategoryName = "SUV", CreatedAtUtc = now },
            new CategoryEntity { CategoryName = "Sedan", CreatedAtUtc = now },
            new CategoryEntity { CategoryName = "Coupe", CreatedAtUtc = now },
            new CategoryEntity { CategoryName = "Truck", CreatedAtUtc = now }
        };
        await context.Categories.AddRangeAsync(categories);
        await context.SaveChangesAsync();
        Console.WriteLine("✅ Dynamic seed: categories added.");
    }

    private static async Task SeedBrandsAsync(DatabaseContext context)
    {
        if (await context.Brands.AnyAsync())
            return;

        var now = DateTime.UtcNow;
        var brands = new[]
        {
             new BrandEntity { BrandName = "Audi", CreatedAtUtc = now },
            new BrandEntity { BrandName = "Ford", CreatedAtUtc = now },
            new BrandEntity { BrandName = "Mercedes", CreatedAtUtc = now },
            new BrandEntity { BrandName = "BMW", CreatedAtUtc = now }
        };

        await context.Brands.AddRangeAsync(brands);
        await context.SaveChangesAsync();
        Console.WriteLine("✅ Dynamic seed: brands added.");
    }

    private static async Task SeedCarsAsync(DatabaseContext context)
    {
        if (await context.Cars.AnyAsync())
            return;

        var brands = await context.Brands.AsNoTracking().ToDictionaryAsync(x => x.BrandName, x => x.Id);
        var categories = await context.Categories.AsNoTracking().ToDictionaryAsync(x => x.CategoryName, x => x.Id);
        var statuses = await context.Statuses.AsNoTracking().ToDictionaryAsync(x => x.StatusName, x => x.Id);

        if (brands.Count == 0 || categories.Count == 0 || statuses.Count == 0)
            return;

        var now = DateTime.UtcNow;
        var cars = new[]
        {
             new CarEntity
            {
                BrandId = brands["Toyota"],
                CategoryId = categories["SUV"],
                CarStatusId = statuses["Available"],
                Model = "RAV4 Adventure",
                Vin = "JTM12345678901234",
                ProductionYear = 2023,
                Mileage = 12000,
                Color = "Midnight Blue",
                BodyStyle = "SUV",
                Transmission = "Automatic",
                FuelType = "Hybrid",
                Drivetrain = "AWD",
                Engine = "2.5L Hybrid",
                HorsePower = "203 hp",
                PrimaryImageURL = "https://images.carshop.local/cars/rav4-adventure.png",
                Description = "Pouzdan hibridni SUV sa bogatom opremom i Toyota Safety Sense paketom.",
                Price = 32990m,
                DiscountedPrice = 31500m,
                DateAdded = now,
                CreatedAtUtc = now
            },
            new CarEntity
            {
                BrandId = brands["BMW"],
                CategoryId = categories["Sedan"],
                CarStatusId = statuses["Reserved"],
                Model = "330e xDrive",
                Vin = "WBA12345678905678",
                ProductionYear = 2022,
                Mileage = 18000,
                Color = "Mineral Grey",
                BodyStyle = "Sedan",
                Transmission = "Automatic",
                FuelType = "Plug-in Hybrid",
                Drivetrain = "AWD",
                Engine = "2.0L Turbo + eDrive",
                HorsePower = "288 hp",
                PrimaryImageURL = "https://images.carshop.local/cars/bmw-330e.png",
                Description = "Sportska limuzina sa kombinacijom performansi i električnog dometa do 60 km.",
                Price = 45990m,
                DateAdded = now,
                CreatedAtUtc = now
            },
            new CarEntity
            {
                BrandId = brands["Tesla"],
                CategoryId = categories["Sedan"],
                CarStatusId = statuses["Available"],
                Model = "Model S Long Range",
                Vin = "5YJ12345678907890",
                ProductionYear = 2024,
                Mileage = 5000,
                Color = "Pearl White",
                BodyStyle = "Liftback",
                Transmission = "Automatic",
                FuelType = "Electric",
                Drivetrain = "AWD",
                Engine = "Dual Motor",
                HorsePower = "670 hp",
                PrimaryImageURL = "https://images.carshop.local/cars/tesla-model-s.png",
                Description = "Električna limuzina visokih performansi s dosegom preko 600 km.",
                Price = 89990m,
                DateAdded = now,
                CreatedAtUtc = now
            },
            new CarEntity
            {
                BrandId = brands["Audi"],
                CategoryId = categories["Coupe"],
                CarStatusId = statuses["Sold"],
                Model = "TT RS",
                Vin = "TRU12345678903456",
                ProductionYear = 2021,
                Mileage = 22000,
                Color = "Turbo Blue",
                BodyStyle = "Coupe",
                Transmission = "Automatic",
                FuelType = "Petrol",
                Drivetrain = "Quattro",
                Engine = "2.5L Turbo I5",
                HorsePower = "394 hp",
                PrimaryImageURL = "https://images.carshop.local/cars/audi-tt-rs.png",
                Description = "Kompaktni sportski kupe sa kultnim petcilindričnim motorom.",
                Price = 68990m,
                DiscountedPrice = 65990m,
                DateAdded = now,
                CreatedAtUtc = now
            }
        };

        await context.Cars.AddRangeAsync(cars);
        await context.SaveChangesAsync();
        Console.WriteLine("✅ Dynamic seed: cars added.");
    }

    private static async Task SeedInquiriesAsync(DatabaseContext context)
    {
        if (await context.Inquiries.AnyAsync())
            return;

        var users = await context.Users.AsNoTracking().ToDictionaryAsync(x => x.Username, x => x.Id);
        var cars = await context.Cars.AsNoTracking().ToDictionaryAsync(x => x.Model, x => x.Id);
        var statuses = await context.Statuses.AsNoTracking().ToDictionaryAsync(x => x.StatusName, x => x.Id);

        if (users.Count == 0 || cars.Count == 0 || statuses.Count == 0)
            return;

        var now = DateTime.UtcNow;
        var inquiries = new[]
        {
             new InquiryEntity
            {
                UserId = users["demo"],
                CarId = cars["RAV4 Adventure"],
                Subject = "Dostupnost Toyota RAV4",
                Message = "Zanima me je li vozilo odmah dostupno i da li je moguće probna vožnja ovaj tjedan?",
                PreferredContactMethod = "Email",
                StatusId = statuses["Inquiry Pending"],
                CreatedAtUtc = now
            },
            new InquiryEntity
            {
                UserId = users["tester"],
                CarId = cars["330e xDrive"],
                Subject = "Leasing opcije",
                Message = "Možete li poslati ponudu leasing financiranja za BMW 330e na 5 godina?",
                PreferredContactMethod = "Phone",
                StatusId = statuses["Inquiry Responded"],
                RespondedAtUtc = now,
                Response = "Poslali smo ponudu s kamatom 3.2% i mogućnošću 20% učešća.",
                CreatedAtUtc = now
            }
        };

        await context.Inquiries.AddRangeAsync(inquiries);
        await context.SaveChangesAsync();
        Console.WriteLine("✅ Dynamic seed: inquiries added.");
    }

    private static async Task SeedReviewsAsync(DatabaseContext context)
    {
        if (await context.Reviews.AnyAsync())
            return;

        var users = await context.Users.AsNoTracking().ToDictionaryAsync(x => x.Username, x => x.Id);
        var cars = await context.Cars.AsNoTracking().ToDictionaryAsync(x => x.Model, x => x.Id);

        if (users.Count == 0 || cars.Count == 0)
            return;

        var now = DateTime.UtcNow;
        var reviews = new[]
        {
            new ReviewEntity
            {
                UserId = users["demo"],
                CarId = cars["Model S Long Range"],
                Rating = 5,
                Title = "Nevjerojatne performanse",
                Content = "Model S je tiha i izuzetno brza, a autopilot je fantastičan na dužim putovanjima.",
                RewievDate = now,
                IsApproved = true,
                CreatedAtUtc = now
            },
            new ReviewEntity
            {
                UserId = users["tester"],
                CarId = cars["RAV4 Adventure"],
                Rating = 4,
                Title = "Praktičan i štedljiv",
                Content = "Odličan gradski SUV, jedino bi infotainment mogao biti brži.",
                RewievDate = now,
                IsApproved = false,
                CreatedAtUtc = now
            }
        };

        await context.Reviews.AddRangeAsync(reviews);
        await context.SaveChangesAsync();
        Console.WriteLine("✅ Dynamic seed: reviews added.");
    }
}