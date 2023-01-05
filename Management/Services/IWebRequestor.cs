using RestSharp;

public interface IWebRequestor
{
  Task<RestResponse<T[]>> GetManyAsync<T>(RestRequest request);
  Task<RestResponse<T>> GetAsync<T>(RestRequest request);
}
