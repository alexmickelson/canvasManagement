using RestSharp;

public interface IWebRequestor
{
  Task<(T[]?, RestResponse)> GetManyAsync<T>(RestRequest request);
  Task<(T?, RestResponse)> GetAsync<T>(RestRequest request);
  Task<RestResponse> PostAsync(RestRequest request);
  Task<(T?, RestResponse)> PostAsync<T>(RestRequest request);
}
