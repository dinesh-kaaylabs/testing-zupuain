import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useOrderDetails } from '../hooks/order/useOrderDetails';
import { useOrderCancel } from '../hooks/order/useOrderCancel';
import { useOrderHeader } from '../hooks/order/useOrderHeader';
import { useDeliveryDetails } from '../hooks/order/useDeliveryDetails';
import { useOrderItems } from '../hooks/order/useOrderItems';
import { useOrderSummary } from '../hooks/order/useOrderSummary';
import SEOHead from '../components/common/SEOHead';
import {
  OrderHeader,
  OrderStatusCard,
  OrderTimelineCard,
  OrderItemsList,
  OrderSummaryCard,
  DeliveryDetailsCard,
  HelpSupportCard,
  CancelOrderModal,
  OrderErrorState,
  OrderNotFound,
  OrderTrackingSkeleton,
} from '../components/order-tracking';

const CANCELLABLE_STATUSES = ['pending', 'confirmed'];

const OrderTrackingPage = () => {
  const { orderId: orderUid } = useParams<{ orderId: string }>();
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  // Fetch order data
  const {
    orderDetails,
    timeline,
    userDetails,
    orderSummary,
    loading,
    error,
    isRefreshing,
    refreshOrderData,
  } = useOrderDetails(orderUid);

  const { cancelOrder, loading: cancelLoading } = useOrderCancel();

  // Get current milestone status
  const currentMilestone = timeline?.[timeline.length - 1];
  const currentStatus = currentMilestone?.zm_milestone?.milestone_code?.toLowerCase() || '';
  const canCancel = CANCELLABLE_STATUSES.includes(currentStatus);

  // Process data with utility hooks
  const headerData = useOrderHeader(
    orderUid || '',
    orderSummary?.order_serial_number,
    orderSummary?.creation_date
  );

  const deliveryDetails = useDeliveryDetails(userDetails);
  const orderItems = useOrderItems(orderDetails);
  const summaryData = useOrderSummary(orderSummary);

  // Handle cancel order
  const handleCancelOrder = async (reason?: string) => {
    if (!orderUid) return;
    const success = await cancelOrder(orderUid, reason);
    if (success) {
      setIsCancelModalOpen(false);
      await refreshOrderData();
    }
  };

  // Loading state
  if (loading && !orderDetails) {
    return <OrderTrackingSkeleton />;
  }

  // Error state
  if (error) {
    return (
      <OrderErrorState
        error={error}
        onRetry={refreshOrderData}
        isRetrying={isRefreshing}
      />
    );
  }

  // Not found state
  if (!orderUid || (!loading && !orderSummary)) {
    return <OrderNotFound />;
  }

  // Check if all required data is available
  if (!headerData || !orderItems || !summaryData) {
    return <OrderTrackingSkeleton />;
  }

  return (
    <>
      <SEOHead
        title={`Order #${orderSummary?.order_serial_number || orderUid} - Track Your Order`}
        description="Track your order status and delivery details in real-time"
      />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <OrderHeader
            displayOrderNumber={headerData.displayOrderNumber}
            formattedDate={headerData.formattedDate}
            isNew={headerData.isNew}
            onRefresh={refreshOrderData}
            isRefreshing={isRefreshing}
            onCancel={() => setIsCancelModalOpen(true)}
            canCancel={canCancel}
          />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Status Card */}
              <OrderStatusCard
                status={currentStatus || 'pending'}
                statusMessage={currentMilestone?.zm_milestone?.milestone_description}
                timestamp={currentMilestone?.creation_date}
              />

              {/* Timeline Card */}
              {timeline && timeline.length > 0 && (
                <OrderTimelineCard timeline={timeline} />
              )}

              {/* Items List */}
              <OrderItemsList
                items={orderItems.items}
                totalItems={orderItems.totalItems}
              />
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Order Summary */}
              <OrderSummaryCard
                lineItems={summaryData.lineItems}
                totalFormatted={summaryData.totalFormatted}
                hasDiscount={summaryData.hasDiscount}
                savingsFormatted={summaryData.savingsFormatted}
              />

              {/* Delivery Details */}
              {deliveryDetails && (
                <DeliveryDetailsCard sections={deliveryDetails.sections} />
              )}

              {/* Help & Support */}
              <HelpSupportCard />
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Order Modal */}
      <CancelOrderModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleCancelOrder}
        orderNumber={headerData.displayOrderNumber}
        loading={cancelLoading}
      />
    </>
  );
};

export default OrderTrackingPage;
