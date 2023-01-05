
using CanvasModel.Accounts;

namespace CanvasModel.Roles;
public class RoleModel
{

  [JsonPropertyName("label")]
  public string Label { get; set; }

  [JsonPropertyName("base_role_type")]
  public string BaseRoleType { get; set; }

  [JsonPropertyName("account")]
  public AccountModel Account { get; set; }

  [JsonPropertyName("workflow_state")]
  public string WorkflowState { get; set; }

  [JsonPropertyName("permissions")]
  public Dictionary<string, RolePermissionsModel> Permissions { get; set; }
}