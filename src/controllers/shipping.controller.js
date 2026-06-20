import { createShippingConfig, getShippingConfig, updateShippingConfig } from "../services/shipment.service.js";
export const createShipping =
    async (req, res) => {
        try {
            const shipping =
                await createShippingConfig(
                    req.body
                );

            return res.status(201).json({
                success: true,
                shipping,
            });
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: err.message,
            });
        }
    };

export const getShipping =
    async (req, res) => {
        try {
            const shipping =
                await getShippingConfig();

            return res.status(201).json({
                success: true,
                shipping,
            });
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: err.message,
            });
        }
    };

export const updateShipping =
    async (req, res) => {
        
        try {
            const shipping =
                await updateShippingConfig(req.params.id, req.body);

            return res.status(201).json({
                success: true,
                shipping,
            });
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: err.message,
            });
        }
    };