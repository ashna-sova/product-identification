const  AWS  = require("@aws-sdk/client-textract");
const textractHelper = require("aws-textract-helper");
const fs = require("fs");
const path = require("path");
const config = {
    // apiVersion: "2016-06-27",  ----> REKOGNITION
    apiVersion: "2018-06-27",
    region: "ap-south-1",
};
const client = new AWS.Textract(config);
 const textExtractionController = async (fileContent) => {
    console.log("request for text extraction received");
    const data = await convertImageToBinary(fileContent);
    if (data.error) {
        return {
            error: true,
            message: "IMAGE CONVERSION FAILED",
        };
    }
    try {
        const extractedText = await detectTextFromBytes(data.payload);
        if (extractedText.error) {
            console.log("AWS_TEXTRACT_ERROR", error);
            return {
                error: true,
                payload: {},
            };
        }
        console.log("image extracted successfully");
        // const extractedData = extractedText.payload.TextDetections.filter(
        //     (textData) => textData.Type === "LINE" && textData.Confidence > 70
        // );
        const extractedData = extractedText.payload;
        const formData = await textractHelper.createTables(extractedData);
        return {
            error: false,
            payload: formData,
        };
    } catch (error) {
        console.log("AWS_TEXTRACT_ERROR", error);
        return {
            error: true,
            payload: {},
        };
    }
};

const convertImageToBinary = async (file) => {
        try {
            return{
                error: false,
                payload: Buffer.from(file, "base64"),
            };
        } catch (error) {
            console.log("IMAGE_TO_BINARY_CONVERSION_ERROR", error);
            return{
                error: true,
                payload: {},
            };
        }
};

const detectTextFromBytes = async (imgData) => {
    const extractTextFromBytesPromise = new Promise((resolve) => {
        const params = {
            Document: {
                Bytes: imgData,
            },
            FeatureTypes: ["FORMS","TABLES"]
        };
        client
            .analyzeDocument(params)
            .then((data) => {
                resolve({
                    error: false,
                    payload: data,
                });
            })
            .catch((error) => {
                console.log("AWS_TEXTRACT_ERROR", error);
                resolve({
                    error: true,
                    payload: {},
                });
            });
    });

    return await extractTextFromBytesPromise;
};
module.exports = textExtractionController;
