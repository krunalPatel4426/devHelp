import { ProgrammingLanguage } from "../../models/programmingLanguage.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const getDataOfLang = asyncHandler(async (req, res) => {
    try{
        const programmingLanguageData = await ProgrammingLanguage.find({});
        res.status(200).json(programmingLanguageData);
    }catch(error){
        res.status(500).json({message: error.message});
    }
})

export { getDataOfLang };
