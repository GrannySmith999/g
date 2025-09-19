import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertOrderSchema, insertOrderItemSchema, shippingFormSchema } from "@shared/schema";
import { z } from "zod";

// Telegram Bot configuration
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

async function sendTelegramNotification(message: string) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.log('Telegram not configured, would send:', message);
    return;
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      }),
    });

    if (!response.ok) {
      console.error('Failed to send Telegram notification:', await response.text());
    }
  } catch (error) {
    console.error('Error sending Telegram notification:', error);
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching categories: " + error.message });
    }
  });

  // Products
  app.get("/api/products", async (req, res) => {
    try {
      const { category, featured, sale, limit, exclude } = req.query;
      let products;

      if (category) {
        products = await storage.getProductsByCategory(category as string);
        if (exclude) {
          products = products.filter(p => p.id !== exclude);
        }
      } else if (featured === 'true') {
        products = await storage.getFeaturedProducts();
      } else if (sale === 'true') {
        products = await storage.getProductsOnSale();
      } else {
        products = await storage.getProducts();
        if (exclude) {
          products = products.filter(p => p.id !== exclude);
        }
      }

      if (limit) {
        products = products.slice(0, parseInt(limit as string, 10));
      }

      res.json(products);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching products: " + error.message });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching product: " + error.message });
    }
  });

  // Payment placeholder endpoint - for future integration
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount, currency = "aud" } = req.body;
      
      // Placeholder response for future payment integration
      res.json({ 
        message: "Payment endpoint ready for integration",
        amount,
        currency,
        status: "pending_integration"
      });
    } catch (error: any) {
      res.status(500).json({ message: "Error in payment endpoint: " + error.message });
    }
  });

  // Create order
  app.post("/api/orders", async (req, res) => {
    try {
      const orderData = req.body;
      
      // Validate shipping information
      const shippingInfo = shippingFormSchema.parse(orderData.shipping);
      
      // Validate order items
      if (!orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
        return res.status(400).json({ message: "Order items are required" });
      }

      // Generate order number
      const orderNumber = `ES-${Date.now()}`;

      // Calculate totals
      let subtotal = 0;
      for (const item of orderData.items) {
        const product = await storage.getProduct(item.productId);
        if (!product) {
          return res.status(400).json({ message: `Product ${item.productId} not found` });
        }
        subtotal += parseFloat(product.price) * item.quantity;
      }

      const tax = subtotal * 0.1; // 10% GST
      const total = subtotal + tax;

      // Create order
      const orderInput = {
        orderNumber,
        customerName: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
        customerEmail: shippingInfo.email,
        customerPhone: shippingInfo.phone,
        shippingAddress: shippingInfo.address,
        shippingCity: shippingInfo.city,
        shippingState: shippingInfo.state,
        shippingPostcode: shippingInfo.postcode,
        subtotal: subtotal.toFixed(2),
        tax: tax.toFixed(2),
        total: total.toFixed(2),
        paymentMethod: orderData.paymentMethod || 'card',
        paymentStatus: 'pending',
        status: 'pending'
      };

      const order = await storage.createOrder(orderInput);

      // Create order items
      for (const item of orderData.items) {
        const product = await storage.getProduct(item.productId);
        if (product) {
          const itemTotal = parseFloat(product.price) * item.quantity;
          await storage.createOrderItem({
            orderId: order.id,
            productId: item.productId,
            productName: product.name,
            productPrice: product.price,
            quantity: item.quantity,
            total: itemTotal.toFixed(2)
          });
        }
      }

      // Send Telegram notification
      const telegramMessage = `🛒 <b>New Order: ${orderNumber}</b>

👤 <b>Customer:</b> ${order.customerName}
📧 <b>Email:</b> ${order.customerEmail}
📱 <b>Phone:</b> ${order.customerPhone}
🏠 <b>Address:</b> ${order.shippingAddress}, ${order.shippingCity}, ${order.shippingState} ${order.shippingPostcode}
💰 <b>Total:</b> $${order.total}
💳 <b>Payment:</b> ${order.paymentMethod}

📦 <b>Items:</b>
${orderData.items.map((item: any) => `• ${item.productName} x${item.quantity}`).join('\n')}`;

      await sendTelegramNotification(telegramMessage);

      res.json(order);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating order: " + error.message });
    }
  });

  // Update payment status
  app.patch("/api/orders/:id/payment-status", async (req, res) => {
    try {
      const { status, stripePaymentIntentId } = req.body;
      const order = await storage.updateOrderPaymentStatus(req.params.id, status, stripePaymentIntentId);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      // Send Telegram notification for payment confirmation
      if (status === 'succeeded') {
        const telegramMessage = `✅ <b>Payment Confirmed</b>

📄 <b>Order:</b> ${order.orderNumber}
👤 <b>Customer:</b> ${order.customerName}
💰 <b>Amount:</b> $${order.total}
💳 <b>Payment ID:</b> ${stripePaymentIntentId}`;

        await sendTelegramNotification(telegramMessage);
      }

      res.json(order);
    } catch (error: any) {
      res.status(500).json({ message: "Error updating payment status: " + error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
