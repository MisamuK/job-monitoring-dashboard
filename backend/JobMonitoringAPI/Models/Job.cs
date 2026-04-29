namespace JobMonitoringAPI.Models;

public class Job
{
    public Guid Id { get; set; }

    public string Name { get; set; } = "";

    public string Status { get; set; } = "Pending";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}