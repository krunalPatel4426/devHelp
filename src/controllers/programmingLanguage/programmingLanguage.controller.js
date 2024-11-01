import { Course } from "../../models/course.model.js";
import { ProgrammingLanguage } from "../../models/programmingLanguage.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";


const addData = asyncHandler(async (req, res) => {
  const data = req.body;
  try{
    if(!data) return res.status(404).json({success: false, error: "data not found."})
    const {name, description, img} = data;
    const pData = await ProgrammingLanguage.create({
      name,
      description,
      img
    });
    if(!pData) return res.status(401).json({success:false, error:"somthing went wrong"})
    return res.status(200).json({success:true, message:"data added succesfully"});
  }catch(error){
    res.status(500).json({ message: error.message });
  }
});

const getDataOfLang = asyncHandler(async (req, res) => {
  try {
    const programmingLanguageData = await ProgrammingLanguage.find({});
    let data = [];
    programmingLanguageData.forEach((each) => {
      data.push({
        id: each._id,
        title: each.name,
        description: each.description,
        img: each.img,
        courses: each.courses,
      });
    });
    res.status(200).json({
      message: "data fetched successfully",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const getDataById = asyncHandler(async (req, res) => {
  const {id} = req.params;
  try {
    const lang = await ProgrammingLanguage.findById(id).select("-__v");
    if (!lang) return res.status(400).json({ message: "data not found" });
    const courses = await Course.find(
      { _id: { $in: lang.courses } },
      "-averageRating -videoLink -__v -reviews"
    );
    res.status(200).json({ message: "data fetch successfully", langauage: lang, courses: courses });
  } catch (error) {
    return res.status(500).json({
      message: "error while retriving data",
    });
  }
});

export { getDataById, getDataOfLang, addData };

