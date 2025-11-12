public class CarUserEntity // this is just a dummy class for jwt token
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public bool IsAdmin { get; set; }
    public bool IsManager { get; set; }
    public bool IsEmployee { get; set; }
    public int TokenVersion { get; set; } = 1;
}
