  function showLoading() {
      document.getElementById("loadingPopup").classList.remove("hidden");
    }

    function hideLoading() {
      document.getElementById("loadingPopup").classList.add("hidden");
    }

   async function showToast(type, message) {
      const toast = document.getElementById("toast");
      const icon = document.getElementById("toastIcon");
      const text = document.getElementById("toastText");

      // Set message
      text.textContent = message;

      // Set styling based on type
      if (type === "success") {
        toast.className = baseToastClass + " bg-green-500 text-white";
        icon.innerHTML = `<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>`;
      } else if (type === "error") {
        toast.className = baseToastClass + " bg-red-500 text-white";
        icon.innerHTML = `<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>`;
      }

      // Show and auto-hide
      toast.classList.remove("hidden");
      setTimeout(() => toast.classList.add("hidden"), 3000);
    }

    const baseToastClass = "fixed top-5 right-5 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-fade-in";

    async function sendFakeRequest(success = true) {
      showLoading();

      try {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 2000));

        if (!success) throw new Error("Simulated API failure");

        showToast("success", "Request successful!");
      } catch (err) {
        showToast("error", "Request failed: " + err.message);
      } finally {
        hideLoading();
      }
    }