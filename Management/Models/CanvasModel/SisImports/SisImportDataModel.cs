
namespace CanvasModel.SisImports;
public class SisImportDataModel
{

  [JsonPropertyName("import_type")]
  public string ImportType { get; set; }

  [JsonPropertyName("supplied_batches")]
  public IEnumerable<string> SuppliedBatches { get; set; }

  [JsonPropertyName("counts")]
  public SisImportCountsModel? Counts { get; set; }
}
