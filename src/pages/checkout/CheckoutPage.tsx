import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCheckout } from "../../hooks/useCheckout";
import { useAddress } from "../../hooks/useAddress";
import { useCart } from "../../context/CartContext";

// Components
import CheckoutSteps from "./components/CheckoutSteps";
import DeliveryTypeSelector from "./components/DeliveryTypeSelector";
import AddressSection from "./components/adressSection/AddressSection";
import DeliveryOptions from "./components/DeliveryOption";
import PickupInfo from "./components/PickupInfo";
import OrderItemsList from "./components/OrderItemList";
import OrderSummary from "./components/OrderSummary";
import PaymentSection from "./components/paymentSection/PaymentSection";
import ProcessingState from "./components/ProcessingState";
import SuccessState from "./components/SuccesState";
import OrderDetailModal from "../../components/modal/OrderDetailModal";
import { Notification, ConfirmModal } from "../../components/ui/Alert";
import { Skeleton } from "../../components/ui/loading/Skeleton";

// Notification type
interface NotificationState {
  show: boolean;
  message: string;
  type: "success" | "error" | "warning" | "info";
}

// Checkout Skeleton Component
const CheckoutSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Steps Skeleton */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-center gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton variant="circular" width="32px" height="32px" />
                <Skeleton variant="text" width="80px" height="20px" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Type Selector Skeleton */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex gap-4">
                <Skeleton variant="rectangular" width="120px" height="48px" />
                <Skeleton variant="rectangular" width="120px" height="48px" />
              </div>
            </div>

            {/* Address Section Skeleton */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <Skeleton variant="text" width="150px" height="24px" />
                <Skeleton variant="text" width="100px" height="32px" />
              </div>
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2 flex-1">
                        <Skeleton variant="text" width="200px" height="20px" />
                        <Skeleton variant="text" width="250px" height="16px" />
                        <Skeleton variant="text" width="180px" height="16px" />
                      </div>
                      <div className="flex gap-2">
                        <Skeleton
                          variant="rectangular"
                          width="60px"
                          height="32px"
                        />
                        <Skeleton
                          variant="rectangular"
                          width="60px"
                          height="32px"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Options Skeleton */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <Skeleton
                variant="text"
                width="180px"
                height="24px"
                className="mb-4"
              />
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <Skeleton variant="text" width="150px" height="18px" />
                        <Skeleton variant="text" width="100px" height="14px" />
                      </div>
                      <Skeleton variant="circular" width="20px" height="20px" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Items List Skeleton */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <Skeleton
                variant="text"
                width="120px"
                height="24px"
                className="mb-4"
              />
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="flex gap-4">
                    <Skeleton
                      variant="rectangular"
                      width="80px"
                      height="80px"
                    />
                    <div className="flex-1">
                      <Skeleton
                        variant="text"
                        width="150px"
                        height="18px"
                        className="mb-2"
                      />
                      <Skeleton variant="text" width="80px" height="16px" />
                    </div>
                    <div className="text-right">
                      <Skeleton
                        variant="text"
                        width="60px"
                        height="18px"
                        className="mb-2"
                      />
                      <div className="flex gap-2">
                        <Skeleton
                          variant="circular"
                          width="28px"
                          height="28px"
                        />
                        <Skeleton variant="text" width="24px" height="20px" />
                        <Skeleton
                          variant="circular"
                          width="28px"
                          height="28px"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary Skeleton */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <Skeleton
                variant="text"
                width="150px"
                height="24px"
                className="mb-4"
              />
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Skeleton variant="text" width="80px" height="18px" />
                  <Skeleton variant="text" width="60px" height="18px" />
                </div>
                <div className="flex justify-between">
                  <Skeleton variant="text" width="100px" height="18px" />
                  <Skeleton variant="text" width="60px" height="18px" />
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <Skeleton variant="text" width="60px" height="20px" />
                    <Skeleton variant="text" width="80px" height="24px" />
                  </div>
                </div>
              </div>
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-2">
                  <Skeleton variant="rectangular" width="20px" height="20px" />
                  <Skeleton variant="text" width="200px" height="14px" />
                </div>
                <Skeleton variant="rectangular" width="100%" height="48px" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { state: cartState } = useCart();

  // Local notification state
  const [notification, setNotification] = useState<NotificationState>({
    show: false,
    message: "",
    type: "info",
  });

  const {
    // Core states
    paymentStep,
    deliveryType,
    setDeliveryType,
    paymentMethod,
    setPaymentMethod,
    paymentMethods,
    loadingPaymentMethods,

    // Payment details
    cardDetails,
    setCardDetails,
    cardErrors,
    selectedEWallet,
    setSelectedEWallet,
    phoneNumber,
    setPhoneNumber,
    selectedBank,
    setSelectedBank,

    // Delivery
    selectedDeliveryOption,
    setSelectedDeliveryOption,
    deliveryEstimate,
    deliveryOptions,

    // Terms
    termsAccepted,
    setTermsAccepted,

    // Processing
    processing,

    // Order detail
    showOrderDetail,
    lastOrderId,
    handleCloseOrderDetail,

    // Calculations
    subtotal,
    shippingCost,
    total,

    // Cart actions
    handleIncreaseQty,
    handleDecreaseQty,

    // Checkout actions
    handleConfirmOrder,
    handleProcessPayment,
    handleBackToConfirmation,
  } = useCheckout();

  const {
    addresses,
    selectedAddressId,
    setSelectedAddressId,
    showAddressForm,
    setShowAddressForm,
    editingAddress,
    addressForm,
    setAddressForm,
    showDeleteConfirm,
    setShowDeleteConfirm,
    handleEditAddress,
    handleAddressSubmit,
    handleDeleteAddress,
    handleSetDefault,
    resetAddressForm,
    loading: addressLoading,
  } = useAddress();

  const handleProcessPaymentWithAddress = async () => {
    if (deliveryType === "delivery" && !selectedAddressId) {
      setNotification({
        show: true,
        message: "Please select a delivery address",
        type: "error",
      });
      return;
    }

    await handleProcessPayment(addresses, selectedAddressId);
  };

  const handleDeleteConfirm = async () => {
    await handleDeleteAddress();
    setShowDeleteConfirm({ show: false, addressId: "", addressLabel: "" });
  };

  const formatEstimate = (min: number, max: number) => {
    if (max < 60) {
      return `${min}-${max} minutes`;
    } else if (min >= 60) {
      const minHours = Math.floor(min / 60);
      const maxHours = Math.floor(max / 60);
      return `${minHours}-${maxHours} hour${maxHours > 1 ? "s" : ""}`;
    } else {
      const maxHours = Math.floor(max / 60);
      return `${min} minutes - ${maxHours} hour${maxHours > 1 ? "s" : ""}`;
    }
  };

  // Check if cart is empty
  const isCartEmpty = cartState.items.length === 0;

  // Redirect if cart is empty
  React.useEffect(() => {
    if (isCartEmpty && paymentStep !== "success") {
      navigate("/menu");
      setNotification({
        show: true,
        message: "Your cart is empty. Please add items to checkout.",
        type: "warning",
      });
    }
  }, [isCartEmpty, navigate, paymentStep]);

  // Show skeleton while loading
  if (loadingPaymentMethods || addressLoading) {
    return <CheckoutSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification */}
      <Notification
        show={notification.show}
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification((prev) => ({ ...prev, show: false }))}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteConfirm.show}
        title="Delete Address"
        message={`Are you sure you want to delete "${showDeleteConfirm.addressLabel}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={() =>
          setShowDeleteConfirm({ show: false, addressId: "", addressLabel: "" })
        }
        type="danger"
      />

      {/* Order Detail Modal */}
      <OrderDetailModal
        isOpen={showOrderDetail}
        orderId={lastOrderId}
        onClose={handleCloseOrderDetail}
      />

      {/* Payment Steps Progress */}
      <CheckoutSteps currentStep={paymentStep} />

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {paymentStep === "confirmation" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <DeliveryTypeSelector
                deliveryType={deliveryType}
                onChange={setDeliveryType}
              />

              {deliveryType === "delivery" && (
                <>
                  <AddressSection
                    addresses={addresses}
                    selectedAddressId={selectedAddressId}
                    onSelectAddress={setSelectedAddressId}
                    onEditAddress={handleEditAddress}
                    onDeleteAddress={(id, label) =>
                      setShowDeleteConfirm({
                        show: true,
                        addressId: id,
                        addressLabel: label,
                      })
                    }
                    onSetDefault={handleSetDefault}
                    showAddressForm={showAddressForm}
                    addressForm={addressForm}
                    onAddressFormChange={setAddressForm}
                    onAddressFormSubmit={handleAddressSubmit}
                    onAddressFormCancel={() => {
                      setShowAddressForm(false);
                      resetAddressForm();
                    }}
                    onAddNewClick={() => setShowAddressForm(true)}
                    isEditing={!!editingAddress}
                  />

                  <DeliveryOptions
                    options={deliveryOptions}
                    selectedOption={selectedDeliveryOption}
                    onSelect={setSelectedDeliveryOption}
                    estimate={deliveryEstimate}
                    formatEstimate={formatEstimate}
                  />
                </>
              )}

              {deliveryType === "pickup" && <PickupInfo />}

              <OrderItemsList
                items={cartState.items}
                onIncrease={handleIncreaseQty}
                onDecrease={handleDecreaseQty}
                onAddMore={() => navigate("/menu")}
              />
            </div>

            {/* Right Column - Order Summary */}
            <OrderSummary
              subtotal={subtotal}
              shippingCost={shippingCost}
              total={total}
              deliveryType={deliveryType}
              deliveryEstimate={deliveryEstimate}
              termsAccepted={termsAccepted}
              onTermsChange={setTermsAccepted}
              onConfirm={handleConfirmOrder}
              isCartEmpty={isCartEmpty}
              paymentMethods={paymentMethods}
            />
          </div>
        )}

        {paymentStep === "payment" && (
          <PaymentSection
            paymentMethod={paymentMethod}
            paymentMethods={paymentMethods}
            onPaymentMethodChange={setPaymentMethod}
            cardDetails={cardDetails}
            cardErrors={cardErrors}
            onCardDetailsChange={setCardDetails}
            selectedEWallet={selectedEWallet}
            phoneNumber={phoneNumber}
            onEWalletChange={setSelectedEWallet}
            onPhoneChange={setPhoneNumber}
            selectedBank={selectedBank}
            onBankChange={setSelectedBank}
            subtotal={subtotal}
            shippingCost={shippingCost}
            total={total}
            onBack={handleBackToConfirmation}
            onProcess={handleProcessPaymentWithAddress}
            processing={processing}
          />
        )}

        {paymentStep === "processing" && <ProcessingState />}

        {paymentStep === "success" && <SuccessState />}
      </div>
    </div>
  );
};

export default CheckoutPage;
