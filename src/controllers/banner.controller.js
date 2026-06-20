import {
  getAllHeroBanners,
  getAllMiddleBanners,
  CreateHeroBanner,
  UpdateHeroBannerById,
  DeleteHeroBannerById,
} from "../services/banner.service.js";

export const getAllHeroBanner = async (req, res) => {
  try {
    const banners = await getAllHeroBanners();

    return res.status(200).json({
      success: true,
      banners,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
export const getAllMiddleBanner = async (req, res) => {
  try {
    const banners = await getAllMiddleBanners();

    return res.status(200).json({
      success: true,
      banners,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const CreateBanner = async (req, res) => {
  const data = {...req.body,
    image:req.file?.path
  }
  try {
    const banner = await CreateHeroBanner(data);

    return res.status(201).json({
      success: true,
      banner,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const UpdateBannerById = async (req, res) => {
  const data = {...req.body};
  if (req.file) {
    data.image=req.file.path
  }
  try {
    const banner = await UpdateHeroBannerById(
      req.params.id,
      data
    );

    return res.status(200).json({
      success: true,
      banner,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const DeleteBannerById = async (req, res) => {
  try {
    const banner = await DeleteHeroBannerById(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      banner,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};