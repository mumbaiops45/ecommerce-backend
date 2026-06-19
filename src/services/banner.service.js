import Banners from "../models/Banners.model.js";

export const getAllHeroBanner = async () => {
  return await Banners.find({
    isActive: true,
  }).sort({ serialNo: 1 });
};

export const CreateHeroBanner = async (data) => {
  const banner = await Banners.create(data);
  return banner;
};

export const UpdateHeroBannerById = async (id, data) => {
  const banner = await Banners.findByIdAndUpdate(
    id,
    data,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!banner) {
    throw new Error("Banner not found");
  }

  return banner;
};

export const DeleteHeroBannerById = async (id) => {
  const banner = await Banners.findByIdAndDelete(id);

  if (!banner) {
    throw new Error("Banner not found");
  }

  return banner;
};