import { mockingProducts } from "../services/mocking.services.js";

export const mocking100products = async (req, res) => {
  try {
    const number = parseInt(req.params.number) || 100;
    const result = await mockingProducts(number);
    return res.status(201).json({ status: "OK", payload: result });
  } catch (error) {
    req.logger.error(error);
    return res.status(500).json({ status: "error" });
  }
};
