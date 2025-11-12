using CarShop.Infrastructure.Common;
using CarShop.Shared.Dtos;
using CarShop.Shared.Options;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

namespace CarShop.API;

public static class DependencyInjection
{
    public static IServiceCollection AddAPI(
        this IServiceCollection services,
        IConfiguration configuration,
        IHostEnvironment env)
    {
        // Controllers + uniform BadRequest handling
        services.AddControllers()
            .ConfigureApiBehaviorOptions(opts =>
            {
                opts.InvalidModelStateResponseFactory = ctx =>
                {
                    var msg = string.Join("; ",
                        ctx.ModelState.Values.SelectMany(v => v.Errors)
                                             .Select(e => string.IsNullOrWhiteSpace(e.ErrorMessage)
                                                 ? "Validation error"
                                                 : e.ErrorMessage));

                    return new Microsoft.AspNetCore.Mvc.BadRequestObjectResult(new ErrorDto
                    {
                        Code = "validation.failed",
                        Message = msg
                    });
                };
            });

        // Bind & validate JwtOptions from configuration
        services.AddOptions<JwtOptions>()
            .Bind(configuration.GetSection(JwtOptions.SectionName))
            .ValidateDataAnnotations()
            .ValidateOnStart();

        // JWT authentication
        services.AddAuthentication(o =>
        {
            o.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            o.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(o =>
        {
            var jwt = configuration.GetSection(JwtOptions.SectionName).Get<JwtOptions>()!;

            o.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidIssuer = jwt.Issuer,
                ValidateAudience = true,
                ValidAudience = jwt.Audience,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt.Key)),
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            };
        });

        // Authorization (default requires authenticated user)
        services.AddAuthorization(o =>
        {
            o.FallbackPolicy = new AuthorizationPolicyBuilder()
                .RequireAuthenticatedUser()
                .Build();
        });

        // Swagger configuration (with JWT support)
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo { Title = "CarShop API", Version = "v1" });

            var xml = Path.Combine(AppContext.BaseDirectory, "CarShop.API.xml");
            if (File.Exists(xml))
                c.IncludeXmlComments(xml, includeControllerXmlComments: true);

            var bearer = new OpenApiSecurityScheme
            {
                Name = "Authorization",
                Description = "Unesi JWT token. Format: **Bearer {token}**",
                In = ParameterLocation.Header,
                Type = SecuritySchemeType.Http,
                Scheme = "bearer",
                BearerFormat = "JWT",
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            };

            c.AddSecurityDefinition("Bearer", bearer);
            c.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
                { bearer, Array.Empty<string>() }
            });
        });

        // Exception handling (custom middleware)
        services.AddExceptionHandler<CarShopExceptionHandler>();
        services.AddProblemDetails();

        return services;
    }
}
