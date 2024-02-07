// using CanvasModel.Courses;
// using CanvasModel.EnrollmentTerms;
// using FluentAssertions;
// using Moq;
// using RestSharp;
// using System.Net;

// namespace Management.Test;

// public class CanvasServiceTests
// {
//   [Test]
//   public async Task CanReadCanvasSemesters()
//   {
//     var expectedTerms = new EnrollmentTermModel[] {
//       new EnrollmentTermModel(
//         Id: 1,
//         Name: "one",
//         StartAt: new DateTime(2022, 1, 1),
//         EndAt: new DateTime(2022, 2, 1)
//       ),
//     };
//     Mock<IWebRequestor> mockRequestor = getTermsMock(expectedTerms);

//     var service = new CanvasService(mockRequestor.Object);
//     var canvasTerms = await service.GetTerms();

//     canvasTerms.Should().BeEquivalentTo(expectedTerms);
//   }

//   [Test]
//   public async Task CanGetActiveTerms()
//   {
//     var expectedTerms = new EnrollmentTermModel[] {
//       new EnrollmentTermModel(
//         Id: 1,
//         Name: "one",
//         StartAt: new DateTime(2022, 5, 1),
//         EndAt: new DateTime(2022, 7, 1)
//       ),
//       new EnrollmentTermModel(
//         Id: 2,
//         Name: "two",
//         StartAt: new DateTime(2022, 7, 1),
//         EndAt: new DateTime(2022, 9, 1)
//       ),
//       new EnrollmentTermModel(
//         Id: 3,
//         Name: "three",
//         StartAt: new DateTime(2022, 9, 1),
//         EndAt: new DateTime(2022, 10, 1)
//       ),
//       new EnrollmentTermModel(
//         Id: 4,
//         Name: "four",
//         StartAt: new DateTime(2022, 10, 1),
//         EndAt: new DateTime(2022, 11, 1)
//       ),
//     };
//     Mock<IWebRequestor> mockRequestor = getTermsMock(expectedTerms);
//     var service = new CanvasService(mockRequestor.Object);

//     var queryDate = new DateTime(2022, 6, 1);
//     var canvasTerms = await service.GetCurrentTermsFor(queryDate);

//     canvasTerms.Count().Should().Be(3);

//     var termIds = canvasTerms.Select(t => t.Id);
//     var expectedIds = new int[] { 1, 2, 3 };
//     termIds.Should().BeEquivalentTo(expectedIds);
//   }

//   private static Mock<IWebRequestor> getTermsMock(EnrollmentTermModel[] expectedTerms)
//   {
//     var data = new RedundantEnrollmentTermsResponse(EnrollmentTerms: expectedTerms);
//     var response = new RestResponse<RedundantEnrollmentTermsResponse>();
//     response.Data = data;

//     var mockRequestor = new Mock<IWebRequestor>();
//     mockRequestor
//       .Setup(s => s.GetAsync<RedundantEnrollmentTermsResponse>(It.IsAny<RestRequest>()))
//       .ReturnsAsync(response);
//     return mockRequestor;
//   }

// }
