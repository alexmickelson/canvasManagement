
using CanvasModel.EnrollmentTerms;

public class DeserializationTests
{
  [Fact]
  public void TestTerm()
  {

    var canvasContentResponse = @"{
      ""enrollment_terms"": [
        {
          ""id"": 1,
          ""name"": ""one"",
          ""start_at"": ""2022-01-01T00:00:00Z"",
          ""end_at"": ""2022-02-01T00:00:00Z"",
          ""created_at"": ""2011-04-26T23:34:35Z"",
          ""workflow_state"": ""active"",
          ""grading_period_group_id"": null
        }
      ]
    }";

    var result = JsonSerializer.Deserialize<RedundantEnrollmentTermsResponse>(canvasContentResponse);

    result.Should().NotBeNull();
    result?.EnrollmentTerms?.First().Id.Should().Be(1);
  }
}
