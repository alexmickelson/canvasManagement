using System;
using System.Collections.Generic;


using Model.Users;

namespace Model.SisImports {

    public class SisImportModel {
        
        [JsonPropertyName("id")]
        public ulong Id { get; set; }
        
        [JsonPropertyName("created_at")]
        public DateTime? CreatedAt { get; set; }
        
        [JsonPropertyName("ended_at")]
        public DateTime? EndedAt { get; set; }
        
        [JsonPropertyName("updated_at")]
        public DateTime? UpdatedAt { get; set; }
        
        [JsonPropertyName("workflow_state")]
        public string WorkflowState { get; set; }
        
        [JsonPropertyName("data")]
        public SisImportDataModel Data { get; set; }
        
        [JsonPropertyName("statistics")]
        public object? Statistics { get; set; }
        // public SisImportStatisticsModel Statistics { get; set; }
        
        [JsonPropertyName("progress")]
        public long? Progress { get; set; }
        
        [JsonPropertyName("errors_attachment")]
        public object ErrorsAttachment { get; set; }
        
        [JsonPropertyName("user")]
        public UserModel? User { get; set; }
        
        [JsonPropertyName("processing_warnings")]
        public IEnumerable<IEnumerable<string>>? ProcessingWarnings { get; set; }
        
        [JsonPropertyName("processing_errors")]
        public IEnumerable<IEnumerable<string>>? ProcessingErrors { get; set; }
        
        [JsonPropertyName("batch_mode")]
        public bool? BatchMode { get; set; }
        
        [JsonPropertyName("batch_mode_term_id")]
        public long? BatchModeTermId { get; set; }
        
        [JsonPropertyName("multi_term_batch_mode")]
        public bool? MultiTermBatchMode { get; set; }

        [JsonPropertyName("skip_deletes")]
        public bool? SkipDeletes { get; set; }
        
        [JsonPropertyName("override_sis_stickiness")]
        public bool? OverrideSisStickiness { get; set; }
        
        [JsonPropertyName("add_sis_stickiness")]
        public bool? AddSisStickiness { get; set; }
        
        [JsonPropertyName("clear_sis_stickiness")]
        public bool? ClearSisStickiness { get; set; }
        
        [JsonPropertyName("diffing_data_set_identifier")]
        public string DiffingDataSetIdentifier { get; set; }
        
        [JsonPropertyName("diffed_against_import_id")]
        public ulong? DiffedAgainstImportId { get; set; }

        [JsonPropertyName("csv_attachments")]
        public IEnumerable<object> CsvAttachments { get; set; }
    }
}
