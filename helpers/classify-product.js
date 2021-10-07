const nutrients = [
  "protein",
  "fiber",
  "carbohydrate",
  "added_sugar",
  "sugar",
  "total_sugar",
  "total_fat",
  "saturated_fat",
  "trans_fat",
  "sodium",
];

const classifyProducts = (extractedInfo) => {
  try {
      const nurientMaps={};
    if (extractedRows.length > 0) {
      const requiredTable = extractedInfo[0];
      Object.keys(requiredTable).forEach((rowNo) => {
        let identifiedNutrient = "";
        const regexToIdentifyUnit = /\b([mk]?[g]{1})\b/g
        const rowValues = Object.values(requiredTable[rowNo]);
        if(rowValues.length==2){
            const key = rowValues[0];
            const val = rowValues[1];
            if(nutrients.includes(key.toLowerCase().replace(' ','_'))){
                identifiedNutrient= key.toLowerCase();
                const identifiedUnit = key.match(regexToIdentifyUnit);
                let nutrientVal=0;
               
            }

        }
      });
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
