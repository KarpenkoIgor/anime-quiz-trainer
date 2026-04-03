using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using AnimeQuizTrainer.Domain.Entities;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace AnimeQuizTrainer.Infrastructure.Services;

public class JwtService(IConfiguration config)
{
    private readonly string _secretKey = config["Jwt:SecretKey"]!;
    private readonly string _issuer = config["Jwt:Issuer"]!;
    private readonly string _audience = config["Jwt:Audience"]!;
    private readonly int _accessExpirationMinutes = int.Parse(config["Jwt:AccessTokenExpirationMinutes"]!);
    private readonly int _refreshExpirationDays = int.Parse(config["Jwt:RefreshTokenExpirationDays"]!);

    public (string token, DateTime expiresAt) GenerateAccessToken(User user)
    {
        var expiresAt = DateTime.UtcNow.AddMinutes(_accessExpirationMinutes);
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secretKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim("username", user.Username),
            new Claim("isAdmin", user.IsAdmin.ToString().ToLower()),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var token = new JwtSecurityToken(
            issuer: _issuer,
            audience: _audience,
            claims: claims,
            expires: expiresAt,
            signingCredentials: credentials);

        return (new JwtSecurityTokenHandler().WriteToken(token), expiresAt);
    }

    public RefreshToken GenerateRefreshToken(Guid userId)
    {
        return new RefreshToken
        {
            Token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64)),
            UserId = userId,
            ExpiresAt = DateTime.UtcNow.AddDays(_refreshExpirationDays)
        };
    }
}
