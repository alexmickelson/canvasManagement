using System.Collections.Generic;


namespace Model.ProficiencyRatings {
    
    public struct ProficiencyModel {
        [JsonPropertyName("ratings")]
        public IEnumerable<ProficiencyRatingModel> Ratings { get; set; }
    }
}
