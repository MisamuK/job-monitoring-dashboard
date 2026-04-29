using Microsoft.AspNetCore.Mvc;
using JobMonitoringAPI.Models;

namespace JobMonitoringAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class JobsController : ControllerBase
{
    private static List<Job> Jobs = new();

    [HttpGet]
    public IActionResult GetJobs()
    {
        return Ok(Jobs.OrderByDescending(j => j.CreatedAt));
    }

    [HttpPost]
    public IActionResult CreateJob([FromBody] Job job)
    {
        job.Id = Guid.NewGuid();
        job.CreatedAt = DateTime.UtcNow;
        job.Status = "Running";

        Jobs.Add(job);

        Task.Run(async () =>
        {
            await Task.Delay(5000);

            var random = new Random();
            bool success = random.Next(0, 100) > 25;

            job.Status = success ? "Completed" : "Failed";
        });

        return Ok(job);
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteJob(Guid id)
    {
        var job = Jobs.FirstOrDefault(j => j.Id == id);

        if (job == null)
            return NotFound();

        Jobs.Remove(job);

        return NoContent();
    }
}