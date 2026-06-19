import {
  getAllHeroBanner,
  CreateHeroBanner,
  UpdateHeroBannerById,
  DeleteHeroBannerById,
} from "../services/banner.service.js";

export const getAllBanner = async (req, res) => {
  try {
    const banners = await getAllHeroBanner();

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
  try {
    const banner = await CreateHeroBanner(req.body);

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
  try {
    const banner = await UpdateHeroBannerById(
      req.params.id,
      req.body
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