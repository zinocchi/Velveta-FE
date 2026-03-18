import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCheckout } from '../../hooks/useCheckout';
import { useAddress } from '../../hooks/useAddress';

// Components
import CheckoutSteps from './components/CheckoutSteps';
import DeliveryTypeSelector from './components/DeliveryTypeSelector';
import AddressSection from './components/adressSection/AddressSection';
import DeliveryOptions from './components/DeliveryOption';
import PickupInfo from './components/PickupInfo';
import OrderItemsList from './components/OrderItemList';
import OrderSummary from './components/OrderSummary';
import PaymentSection from './components/paymentSection/PaymentSection';
import ProcessingState from './components/ProcessingState';
import SuccessState from './components/SuccesState';
import OrderDetailModal from '../../components/modal/OrderDetailModal';

// UI Components
import Notification from '../../components/ui/Alert/Alert';
import ConfirmModal from '../../components/ui/Modal/ConfirmModal';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  
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
    
    // Notifications
    notification,
    showNotification,
    
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
  } = useAddress();

  const handleProcessPaymentWithAddress = () => {
    handleProcessPayment(addresses, selectedAddressId);
  };

  const handleDeleteConfirm = () => {
    handleDeleteAddress();
    setShowDeleteConfirm({ show: false, addressId: '', addressLabel: '' });
  };

  const formatEstimate = (min: number, max: number) => {
    if (max < 60) {
      return `${min}-${max} minutes`;
    } else if (min >= 60) {
      return `${Math.floor(min / 60)}-${Math.floor(max / 60)} hour${
        Math.floor(max / 60) > 1 ? 's' : ''
      }`;
    } else {
      return `${min} minutes - ${Math.floor(max / 60)} hour${
        Math.floor(max / 60) > 1 ? 's' : ''
      }`;
    }
  };

  if (loadingPaymentMethods) {
    return (
      <main className="pt-28 pb-16 max-w-7xl mx-auto px-4">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-700"></div>
          <p className="mt-4 text-gray-600">Loading checkout...</p>
        </div>
      </main>
    );
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
        onCancel={() => setShowDeleteConfirm({ show: false, addressId: '', addressLabel: '' })}
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
        {paymentStep === 'confirmation' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <DeliveryTypeSelector
                deliveryType={deliveryType}
                onChange={setDeliveryType}
              />

              {deliveryType === 'delivery' && (
                <>
                  <AddressSection
                    addresses={addresses}
                    selectedAddressId={selectedAddressId}
                    onSelectAddress={setSelectedAddressId}
                    onEditAddress={handleEditAddress}
                    onDeleteAddress={(id, label) =>
                      setShowDeleteConfirm({ show: true, addressId: id, addressLabel: label })
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

              {deliveryType === 'pickup' && <PickupInfo />}

              <OrderItemsList
                items={state.items}
                onIncrease={handleIncreaseQty}
                onDecrease={handleDecreaseQty}
                onAddMore={() => navigate('/menu')}
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
              isCartEmpty={state.items.length === 0}
              paymentMethods={paymentMethods}
            />
          </div>
        )}

        {paymentStep === 'payment' && (
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

        {paymentStep === 'processing' && <ProcessingState />}

        {paymentStep === 'success' && <SuccessState />}
      </div>
    </div>
  );
};

export default CheckoutPage;