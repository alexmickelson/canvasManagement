// public class ModuleTests
// {
//   [Test]
//   public void CanAddModule()
//   {
//     var manager = new ModuleManager();
//     var module = new CourseModule("First Module", new LocalAssignment[] { });
//     manager.AddModule(module);

//     manager.Modules.Count().Should().Be(1);
//     manager.Modules.First().Should().Be(module);
//   }

//   [Test]
//   public void CanAddAssignmentToCorrectModule()
//   {
//     var manager = new ModuleManager();
//     manager.AddModule(new CourseModule("First Module", new LocalAssignment[] { }));
//     manager.AddModule(new CourseModule("Second Module", new LocalAssignment[] { }));
//     manager.AddModule(new CourseModule("Third Module", new LocalAssignment[] { }));
//     manager.AddModule(new CourseModule("Fourth Module", new LocalAssignment[] { }));

//     var assignment = new LocalAssignment
//     {
//       name = "testname",
//       description = "testDescription",
//       published = false,
//       lock_at_due_date = true,
//       rubric = new RubricItem[] { },
//       lock_at = null,
//       due_at = DateTime.Now,
//       points_possible = 10,
//       submission_types = new SubmissionType[] { SubmissionType.online_text_entry }
//     };

//     manager.AddAssignment(3, assignment);
//     manager.Modules.Count().Should().Be(4);
//     manager.Modules.ElementAt(3).Assignments.Count().Should().Be(1);
//   }
// }