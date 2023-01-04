using System.Collections.Generic;


namespace Model.GradingPeriods {
    public class RedundantGradingPeriodResponse {
        [JsonPropertyName("grading_periods")]
        public IEnumerable<GradingPeriodModel> GradingPeriods { get; set; }
    }
}
