import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
// Stripe imports removed - payment system to be implemented later
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Building, ArrowLeft, Check } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { stripePromise } from "@/lib/stripe";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/use-cart";
import { useLanguage } from "@/hooks/use-language";
import { shippingFormSchema, type ShippingForm } from "@shared/schema";

// CheckoutForm component removed - payment integration to be implemented later

export default function Checkout() {
  const { cart, clearCart, getTotalPrice } = useCart();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank'>('card');
  const [clientSecret, setClientSecret] = useState<string>('');
  const [shippingData, setShippingData] = useState<ShippingForm | null>(null);

  const form = useForm<ShippingForm>({
    resolver: zodResolver(shippingFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      postcode: ''
    }
  });

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.length === 0) {
      setLocation('/');
    }
  }, [cart.length, setLocation]);

  const subtotal = getTotalPrice();
  const tax = subtotal * 0.1; // 10% GST
  const total = subtotal + tax;

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const response = await apiRequest("POST", "/api/orders", orderData);
      return response.json();
    },
    onSuccess: () => {
      clearCart();
      toast({
        title: t("Order placed successfully!"),
        description: t("You will receive a confirmation via Telegram."),
      });
      setLocation('/');
    },
    onError: (error: any) => {
      toast({
        title: "Order Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Payment intent creation removed - payment integration to be implemented later

  const onShippingSubmit = (data: ShippingForm) => {
    setShippingData(data);
    setCurrentStep(2);
  };

  const handlePaymentMethodChange = (method: 'card' | 'bank') => {
    setPaymentMethod(method);
    // Payment intent creation removed - payment integration to be implemented later
  };

  const goToReview = () => {
    if (!paymentMethod) {
      toast({
        title: "Payment Method Required",
        description: t("Please select a payment method"),
        variant: "destructive",
      });
      return;
    }
    setCurrentStep(3);
  };

  const placeOrder = () => {
    if (!shippingData) return;

    const orderData = {
      shipping: shippingData,
      items: cart.map(item => ({
        productId: item.productId,
        productName: item.name,
        quantity: item.quantity
      })),
      paymentMethod,
      total: total.toFixed(2)
    };

    createOrderMutation.mutate(orderData);
  };

  if (cart.length === 0) {
    return null;
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle data-testid="text-shipping-title">{t("Shipping Information")}</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onShippingSubmit)} className="space-y-4" data-testid="form-shipping">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("First Name")}</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-first-name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("Last Name")}</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-last-name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("Email Address")}</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} data-testid="input-email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("Phone Number")}</FormLabel>
                        <FormControl>
                          <Input type="tel" {...field} data-testid="input-phone" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("Address")}</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="input-address" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("City")}</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-city" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("State")}</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-state">
                                <SelectValue placeholder="Select State" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="NSW">NSW</SelectItem>
                              <SelectItem value="VIC">VIC</SelectItem>
                              <SelectItem value="QLD">QLD</SelectItem>
                              <SelectItem value="WA">WA</SelectItem>
                              <SelectItem value="SA">SA</SelectItem>
                              <SelectItem value="TAS">TAS</SelectItem>
                              <SelectItem value="ACT">ACT</SelectItem>
                              <SelectItem value="NT">NT</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="postcode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("Post Code")}</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-postcode" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" data-testid="button-continue-payment">
                    {t("Continue to Payment")}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle data-testid="text-payment-title">{t("Payment Method")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <RadioGroup
                value={paymentMethod}
                onValueChange={(value) => handlePaymentMethodChange(value as 'card' | 'bank')}
                data-testid="radio-group-payment"
              >
                <div className="border rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="card" id="card" data-testid="radio-card" />
                    <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
                      <CreditCard className="h-4 w-4" />
                      {t("Credit/Debit Card")}
                    </Label>
                  </div>
                  {paymentMethod === 'card' && (
                    <div className="mt-4 bg-muted p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        Credit card payment integration will be available soon. Please use bank transfer for now.
                      </p>
                    </div>
                  )}
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bank" id="bank" data-testid="radio-bank" />
                    <Label htmlFor="bank" className="flex items-center gap-2 cursor-pointer">
                      <Building className="h-4 w-4" />
                      {t("Bank Transfer")}
                    </Label>
                  </div>
                  {paymentMethod === 'bank' && (
                    <div className="mt-4 bg-muted p-4 rounded-lg">
                      <h4 className="font-semibold mb-2" data-testid="text-bank-details-title">
                        {t("Bank Transfer Details")}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {t("Please transfer the total amount to:")}
                      </p>
                      <div className="text-sm space-y-1">
                        <p><strong>Bank:</strong> ElectroStore Bank</p>
                        <p><strong>Account Name:</strong> ElectroStore Pty Ltd</p>
                        <p><strong>BSB:</strong> 123-456</p>
                        <p><strong>Account Number:</strong> 987654321</p>
                        <p><strong>Reference:</strong> ES-{Date.now()}</p>
                      </div>
                    </div>
                  )}
                </div>
              </RadioGroup>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(1)}
                  className="flex-1"
                  data-testid="button-back-shipping"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {t("Back")}
                </Button>
                {paymentMethod && (
                  <Button
                    onClick={goToReview}
                    className="flex-1"
                    data-testid="button-review-order"
                  >
                    {t("Review Order")}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle data-testid="text-review-title">{t("Order Review")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-3" data-testid="text-order-summary-title">
                  {t("Order Summary")}
                </h4>
                <div className="space-y-2">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center py-2"
                      data-testid={`order-item-${item.id}`}
                    >
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {item.quantity} × ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                <Separator className="my-3" />
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>{t("Total:")}</span>
                  <span className="text-primary" data-testid="text-final-total">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-blue-800 mb-2">
                  <i className="fab fa-telegram text-xl"></i>
                  <span className="font-semibold">{t("Order Notification")}</span>
                </div>
                <p className="text-sm text-blue-700">
                  {t("Your order details will be automatically sent to our Telegram bot for processing. You'll receive a confirmation message shortly.")}
                </p>
              </div>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(2)}
                  className="flex-1"
                  data-testid="button-back-payment"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {t("Back")}
                </Button>
                <Button
                  onClick={placeOrder}
                  disabled={createOrderMutation.isPending}
                  className="flex-1 bg-destructive hover:bg-red-600"
                  data-testid="button-place-order"
                >
                  {createOrderMutation.isPending ? "Processing..." : t("Place Order")}
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4" data-testid="text-checkout-title">
            {t("Checkout")}
          </h1>
          
          {/* Progress Steps */}
          <div className="flex justify-center mb-8">
            <ol className="flex items-center w-full max-w-2xl">
              {[1, 2, 3].map((step) => (
                <li key={step} className="flex w-full items-center">
                  <span
                    className={`flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 shrink-0 ${
                      step <= currentStep
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                    data-testid={`step-indicator-${step}`}
                  >
                    {step < currentStep ? <Check className="h-4 w-4" /> : step}
                  </span>
                  {step < 3 && (
                    <div
                      className={`w-full h-1 mx-4 ${
                        step < currentStep ? 'bg-primary' : 'bg-border'
                      }`}
                    />
                  )}
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {renderStepContent()}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle data-testid="text-sidebar-title">{t("Order Summary")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3"
                      data-testid={`sidebar-item-${item.id}`}
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium line-clamp-2">{item.name}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{t("Subtotal:")}</span>
                    <span data-testid="text-subtotal">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{t("Shipping:")}</span>
                    <span data-testid="text-shipping">{t("Free")}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{t("Tax:")}</span>
                    <span data-testid="text-tax">${tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>{t("Total:")}</span>
                    <span data-testid="text-sidebar-total">${total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
