export const purchaseCartByIdStripe = async (req, res) => {
  try {
    const cid = req.params.cid;
    if (!isValidMongoId(cid)) {
      return res
        .status(400)
        .json({ status: "error", error: "Invalid Cart ID" });
    }
    const ticket = await CartService.createTicket(cid);

    switch (ticket.code) {
      case 1:
        return res.status(404).json({
          status: "error",
          error: "Cart Not Found or does not have a user",
        });
      case 2:
        return res.status(404).json({ status: "error", error: "Cart Empty" });
      case 3:
        return res
          .status(404)
          .json({ status: "error", error: "products out of stock" });
      default:
        break;
    }
    console.log(ticket.amount);
    const data = {
      amount: ticket.amount,
      currency: "USD",
      payment_method_types: ["card"],
    };
    const result = await Stripe.createPaymentIntent(data);
    console.log(result);

    return res.status(201).json({ status: "Success", payload: result });
  } catch (error) {
    req.logger.error(`Error en purchaseCartById: ${error}`);
    return res.status(500).json({ status: "error" });
  }
};

function isValidMongoId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}
