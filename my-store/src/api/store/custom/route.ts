import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  res.sendStatus(200);
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const { cart_id } = req.body as { cart_id: string };
    if (!cart_id) {
      return res.status(400).json({ message: "cart_id is required" });
    }

    // MedusaのcartServiceをDIコンテナから取得
    const cartService = req.scope.resolve("cartService") as any;
    const cart = await cartService.retrieve(cart_id);

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    if (!cart.email) {
      return res.status(400).json({ message: "Email is required for Stripe receipt" });
    }

    // Stripeのline_items用に変換
    const line_items = cart.items.map((item) => ({
      price_data: {
        currency: cart.region.currency_code,
        product_data: {
          name: item.title,
        },
        unit_amount: Math.round(item.unit_price),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      customer_email: cart.email,
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      metadata: {
        cart_id,
      },
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message || "Internal server error" });
  }
}

