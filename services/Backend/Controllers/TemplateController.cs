using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyService.Data;
using MyService.Models;

namespace MyService.Controllers
{
  [ApiController]
  [Route("templates")]
  public class TemplatesController : ControllerBase
  {
    private readonly AppDbContext _db;
    public TemplatesController(AppDbContext db) => _db = db;

    // GET api/templates
    [HttpGet]
    public async Task<IEnumerable<Template>> Get() =>
        await _db.Templates.ToListAsync();

    // GET api/templates/{id}
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<Template>> Get(Guid id)
    {
      var template = await _db.Templates.FindAsync(id);
      if (template == null) return NotFound();
      return template;
    }

    // POST /templates
    [HttpPost]
    public async Task<ActionResult<Template>> Post([FromBody] Template template)
    {
      _db.Templates.Add(template);
      await _db.SaveChangesAsync();
      return CreatedAtAction(nameof(Get), new { id = template.Id }, template);
    }

    // PUT api/templates/{id}
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Put(Guid id, [FromBody] Template template)
    {
      template.Id = id;

      _db.Entry(template).State = EntityState.Modified;
      await _db.SaveChangesAsync();
      return NoContent();
    }

    // DELETE api/templates/{id}
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
      var template = await _db.Templates.FindAsync(id);
      if (template == null) return NotFound();
      _db.Templates.Remove(template);
      await _db.SaveChangesAsync();
      return NoContent();
    }
  }
}
