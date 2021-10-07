//thresholds metioned in mg
const productsThresholdMG = {
    protein: 2000,
    fibre: 3000,
    carbohydrate: 2000,
    total_sugar: 1200,
    added_sugar: 1000,
    sugar: 200,
    total_fat: 1000,
    saturated_fat: 2100,
    trans_fat: 1500,
    fat:1000,
    sodium: 1800,
    cholesterol: 1000
};

const nutrients = Object.keys(productsThresholdMG);
const classifyProductHelper = (extractedInfo) => {
    try {
        const nutrientMaps = {};
        if (extractedInfo) {
            const requiredTable = extractedInfo[0];
            let recommendationStatus = true;
            Object.keys(requiredTable).forEach((rowNo) => {
                const regexToIdentifyUnit = /([mk]?[g]{1})\b/g;
                const rowValues = Object.values(requiredTable[rowNo]);
                const key = rowValues[0];
                let val = rowValues[1];
                for (let i = 0; i < nutrients.length; i++) {
                    if (
                        key
                            .toLowerCase()
                            .replace(" ", "_")
                            .indexOf(nutrients[i])!== -1
                    ) {
                        let nutrient = nutrients[i];
                        const unit = key.match(regexToIdentifyUnit) || val.match(regexToIdentifyUnit);       
                        const nutrientUnit = unit!==null ? unit[0] : "g";
                        val = parseFloat(val.split(/([mk]?[g]{1})\b/g)[0].trim());
                        const nutrientValue = val + " " + nutrientUnit;
                        nutrientMaps[nutrient] = nutrientValue;
                        //convert to mg
                        if (nutrientUnit === "g") {
                            val *= 1000;
                        }
                        if(val > productsThresholdMG[nutrient]){
                          recommendationStatus = false;
                        }
                        break;
                    }
                }
            });

            return {
                error: false,
                payload: {
                    nutrientMaps,
                    recommendationStatus,
                },
            };
        } else {
            return {
                error: true,
                msg: "no info received",
            };
        }
    } catch (error) {
        console.log("TEXT_CLASSIFICATION_ERROR",error);
        return {
            error: true,
            msg: "error retrieving info",
        };
    }
};

module.exports= classifyProductHelper;
