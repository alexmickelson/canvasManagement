using CanvasModel.Courses;
using CanvasModel.EnrollmentTerms;
using FluentAssertions;
using Moq;
using RestSharp;
using System.Net;

namespace Management.Test;

public class CanvasServiceTests
{
  [Test]
  public async Task CanReadCanvasSemesters()
  {
    var expectedTerms = new EnrollmentTermModel[] {
      new EnrollmentTermModel(
        Id: 1,
        Name: "one",
        StartAt: new DateTime(2022, 1, 1),
        EndAt: new DateTime(2022, 2, 1)
      ),
    };
    var data = new RedundantEnrollmentTermsResponse(EnrollmentTerms: expectedTerms);
    var response = new RestResponse<RedundantEnrollmentTermsResponse>();
    response.Data = data;

    var mockRequestor = new Mock<IWebRequestor>();
    mockRequestor
      .Setup(s => s.GetAsync<RedundantEnrollmentTermsResponse>(It.IsAny<RestRequest>()))
      .ReturnsAsync(response);

    var service = new CanvasService(mockRequestor.Object);
    var canvasTerms = await service.GetTerms();

    canvasTerms.Should().BeEquivalentTo(expectedTerms);
  }

}