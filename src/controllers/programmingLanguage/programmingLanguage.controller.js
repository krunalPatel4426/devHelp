import { ProgrammingLanguage } from "../../models/programmingLanguage.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const getDataOfLang = asyncHandler(async (req, res) => {
    try{
        const programmingLanguageData = await ProgrammingLanguage.find({});
        let data = []
        programmingLanguageData.forEach((each) => {
            data.push({
                id: each._id,
                title: each.name,
                description: each.description,
                img: each.img,
                courses: each.courses
            });
        });
        res.status(200).json({
            "message" : "data fetched successfully",
            data: data
        });
    }catch(error){
        res.status(500).json({message: error.message});
    }
})

export { getDataOfLang };
