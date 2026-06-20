import Shipping from "../models/Shipping.model.js";

export const createShippingConfig = async (
  data
) => {
  const existing =
    await Shipping.findOne();

  if (existing) {
    throw new Error(
      "Shipping config already exists"
    );
  }

  return await Shipping.create(data);
};

export const getShippingConfig =
  async () => {
    return await Shipping.findOne();
  };

export const updateShippingConfig =
  async (id, data) => {
    const shipping =
      await Shipping.findByIdAndUpdate(
        id,
        data,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!shipping) {
      throw new Error(
        "Shipping config not found"
      );
    }

    return shipping;
  };