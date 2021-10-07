const productThresholdMG= {
  "protein": 2000,
  "fiber": 3000,
  "carbohydrate": 2000,
  "added_sugar": 1000,
  "sugar": 200,
  "total_sugar": 1200,
  "total_fat": 1000,
  "saturated_fat": 2100,
  "trans_fat": 1500,
  "sodium": 1800
}

const nutrients = Object.keys(productThresholdsMG);
const classifyProductHelper = (extractedInfo) => {
  try {
    const nurientMaps = {};
    if (extractedRows.length > 0) {
      const requiredTable = extractedInfo[0];
      Object.keys(requiredTable).forEach((rowNo) => {
        let nutrient = "";
        const regexToIdentifyUnit = /\b([mk]?[g]{1})\b/g
        const rowValues = Object.values(requiredTable[rowNo]);
        let recommendationStatus= true;
        const key = rowValues[0];
        const val = rowValues[1];
        if (nutrients.includes(key.toLowerCase().replace(' ', '_'))) {
          nutrient = key.toLowerCase();
          const unit = rowValues.length === 2 ? (key.match(regexToIdentifyUnit) || val.match(regexToIdentifyUnit)) : key.match(regexToIdentifyUnit);
          const value = unit ? (val + " " + unit) : (val + "  g");
          nurientMaps[nutrient] = value;
        }
      });
         
      return {
        error: false,
        payload: {
          nutrientMaps,
          recommendationStatus
        }
      }
    } else {
      return {
        error: true,
        msg: "no info received",
      };
    }
  } catch (err) {
    return {
      error: true,
      msg: "error retrieving info",
    };
  }
};

module.exports = classifyProductHelper;