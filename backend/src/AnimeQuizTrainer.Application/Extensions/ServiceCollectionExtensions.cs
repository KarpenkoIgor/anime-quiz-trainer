using Microsoft.Extensions.DependencyInjection;

namespace AnimeQuizTrainer.Application.Extensions;

public static class ServiceCollectionExtensions
{
    /// <summary>
    /// Registers pure Application-layer services (validators, mappers, etc.).
    /// Service interface implementations live in Infrastructure and are registered via AddInfrastructure().
    /// </summary>
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        return services;
    }
}
