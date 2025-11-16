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

        //await SeedUsersAsync(context);
    }


    /// <summary>
    /// Kreira demo korisnike ako ih još nema u bazi.
    /// </summary>
    private static async Task SeedUsersAsync(DatabaseContext context)
    {
        if (await context.Users.AnyAsync())
            return;

        var hasher = new PasswordHasher<CarShopUserEntity>();

        var now = DateTime.UtcNow;

        var admin = new CarShopUserEntity
        {
            Username = "admin",
            Email = "admin@CarShop.local",
            PasswordHash = hasher.HashPassword(null!, "Admin123!"),
            FirstName = "Admin",
            LastName = "User",
            Phone = "+385911234567",
            Address = "Admin Street 1",
            RoleId = 1,
            IsActive = true,
            CreatedAtUtc = now
        };

        var manager = new CarShopUserEntity
        {
            Username = "manager",
            Email = "manager@CarShop.local",
            PasswordHash = hasher.HashPassword(null!, "User123!"),
            FirstName = "Market",
            LastName = "Manager",
            Phone = "+385981112223",
            Address = "Manager Street 1",
            RoleId = 2,
            IsActive = true,
            CreatedAtUtc = now
        };

        var demoUser = new CarShopUserEntity
        {
            Username = "demo",
            Email = "demo@CarShop.local",
            PasswordHash = hasher.HashPassword(null!, "Demo123!"),
            FirstName = "Demo",
            LastName = "User",
            Phone = "+385991112233",
            Address = "Demo Street 1",
            RoleId = 3,
            IsActive = true,
            CreatedAtUtc = now
        };

        var testUser = new CarShopUserEntity
        {
            Username = "tester",
            Email = "tester@CarShop.local",
            PasswordHash = hasher.HashPassword(null!, "Tester123!"),
            FirstName = "Test",
            LastName = "Account",
            Phone = "+385971234567",
            Address = "Test Street 1",
            RoleId = 3,
            IsActive = true,
            CreatedAtUtc = now
        };
        context.Users.AddRange(admin, manager, demoUser, testUser);
        await context.SaveChangesAsync();
        Console.WriteLine("✅ Dynamic seed: demo users added.");
    }
}