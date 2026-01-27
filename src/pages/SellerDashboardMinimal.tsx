import DashboardLayout from '../components/dashboard/DashboardLayout';

export default function SellerDashboard() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Seller Dashboard</h1>
            <p className="text-gray-600">Use the navigation menu to manage your store</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
