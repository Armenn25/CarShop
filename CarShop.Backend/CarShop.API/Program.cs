using CarShop.API;
using CarShop.API.Middlewares;
using CarShop.Application;
using CarShop.Infrastructure;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddControllers();

// ----------------------------------------------------
//   Add Dependency Injections for all layers
// ----------------------------------------------------
builder.Services.AddAPI(builder.Configuration, builder.Environment);
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);


var app = builder.Build();

// ----------------------------------------------------
//   Global exception handling and status code pages
// ----------------------------------------------------
app.UseExceptionHandler();
app.UseStatusCodePages();

// ----------------------------------------------------
//   Swagger UI 
// ----------------------------------------------------
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "CarShop API v1");
    c.RoutePrefix = string.Empty;
});

// ----------------------------------------------------
//   CORS, HTTPS, and Routing
// ----------------------------------------------------
app.UseCors("AllowAll");
app.UseHttpsRedirection();

// ----------------------------------------------------
//   Authentication & Authorization
// ----------------------------------------------------
app.UseAuthentication(); // JWT 
app.UseAuthorization();


app.MapControllers();

// this is route prefix!
// app.MapGet("/", ctx =>
// {
//     ctx.Response.Redirect("/swagger");
//     return Task.CompletedTask;
// });


app.Run();
