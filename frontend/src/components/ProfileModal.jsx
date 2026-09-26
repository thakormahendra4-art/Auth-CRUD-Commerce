const ProfileModal = ({ isOpen, onClose, user, isSeller, onLogout }) => {
  if (!isOpen || !user) return null;

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-hidden">
      <div className="modal-box relative w-full max-w-md max-h-[90vh] rounded-3xl bg-white shadow-2xl flex flex-col overflow-hidden animate-fade-in">
        {/* Profile Card Header Banner */}
        <div className="relative h-28 w-full bg-gradient-to-r from-lime-500 via-emerald-600 to-teal-600 flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 rounded-full bg-black/20 p-1.5 text-white hover:bg-black/40 transition"
          >
            ✕
          </button>
        </div>

        {/* Avatar & Basic Info */}
        <div className="relative px-6 pb-2 -mt-14 flex flex-col items-center flex-shrink-0">
          <div className="relative">
            <div
              className={`flex h-24 w-24 items-center justify-center rounded-full border-4 border-white text-2xl font-extrabold shadow-md ${
                isSeller
                  ? "bg-gradient-to-tr from-lime-600 to-emerald-500 text-white"
                  : "bg-gradient-to-tr from-blue-600 to-indigo-500 text-white"
              }`}
            >
              {getInitials(user.name)}
            </div>
            <span
              className="absolute bottom-1 right-1 h-5 w-5 rounded-full border-2 border-white bg-emerald-500"
              title="Online"
            />
          </div>

          <h2 className="mt-3 text-xl font-extrabold text-gray-900 tracking-tight text-center">
            {user.name}
          </h2>

          <div className="mt-1 flex items-center gap-2">
            <span
              className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
                isSeller
                  ? "bg-lime-100 text-lime-800 border border-lime-300"
                  : "bg-blue-100 text-blue-800 border border-blue-300"
              }`}
            >
              {isSeller ? "Verified Seller" : "Customer / Buyer"}
            </span>
          </div>
        </div>

        {/* Scrollable Details Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {/* Account Details Box */}
          <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-4 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500 font-medium">Email Address</span>
              <span className="text-gray-900 font-semibold truncate max-w-[200px]">
                {user.email}
              </span>
            </div>

            <div className="border-t border-gray-200/60 pt-2 flex items-center justify-between text-xs">
              <span className="text-gray-500 font-medium">Mobile Number</span>
              <span className="text-gray-900 font-semibold">
                {user.mobile || "Not specified"}
              </span>
            </div>

            <div className="border-t border-gray-200/60 pt-2 flex items-center justify-between text-xs">
              <span className="text-gray-500 font-medium">Account ID</span>
              <span className="text-gray-500 font-mono text-2xs truncate max-w-[180px]">
                {user.id || user._id || "Active User"}
              </span>
            </div>
          </div>

          {/* Role Permissions */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              Role Permissions & Privileges
            </h4>
            <div className="rounded-2xl border border-gray-100 bg-white p-3 space-y-2 text-xs text-gray-700">
              {isSeller ? (
                <>
                  <div className="flex items-center gap-2">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-lime-100 text-lime-700 text-[10px] font-bold">
                      ✓
                    </span>
                    <span>Create & publish new products to the catalog</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-lime-100 text-lime-700 text-[10px] font-bold">
                      ✓
                    </span>
                    <span>Cloud image uploads via Multer & ImageKit CDN</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-lime-100 text-lime-700 text-[10px] font-bold">
                      ✓
                    </span>
                    <span>Edit pricing, inventory stock, and descriptions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-lime-100 text-lime-700 text-[10px] font-bold">
                      ✓
                    </span>
                    <span>Delete owned products and associated cloud media</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold">
                      ✓
                    </span>
                    <span>Browse all marketplace items and categories</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold">
                      ✓
                    </span>
                    <span>Search products by title with live keyword filters</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold">
                      ✓
                    </span>
                    <span>Add in-stock products to shopping cart</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold">
                      ✓
                    </span>
                    <span>Safe encrypted session persistence</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="flex-shrink-0 flex items-center justify-between border-t border-gray-100 bg-gray-50/80 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onLogout();
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-red-700 transition active:scale-95"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
