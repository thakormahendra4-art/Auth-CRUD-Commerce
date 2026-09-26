const AboutPage = () => {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xs">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          About Shery<span className="text-lime-600">Cart</span>
        </h1>
        <p className="mt-3 text-base text-gray-600 leading-relaxed">
          SheryCart is a modern e-commerce platform built to seamlessly connect
          verified merchants and buyers. With role-based account control,
          sellers can easily publish and manage their catalog with real-time cloud
          image uploads powered by ImageKit.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="rounded-xl bg-gray-50 p-5 border border-gray-100">
            <h3 className="font-bold text-gray-900 text-sm">For Customers</h3>
            <p className="mt-1 text-xs text-gray-500 leading-relaxed">
              Browse products freely across various categories, search by keywords,
              and check live stock availability before adding items to your cart.
            </p>
          </div>

          <div className="rounded-xl bg-gray-50 p-5 border border-gray-100">
            <h3 className="font-bold text-gray-900 text-sm">For Sellers</h3>
            <p className="mt-1 text-xs text-gray-500 leading-relaxed">
              Create and manage product listings with high-resolution image uploads.
              Update inventory, pricing, and descriptions at any time.
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-100 pt-6 flex items-center justify-between text-xs text-gray-400">
          <span>SheryCart Marketplace v1.0</span>
          <span>Powered by React, Express, MongoDB & ImageKit</span>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
