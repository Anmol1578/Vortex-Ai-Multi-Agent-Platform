let razorpayLoadPromise = null;

export const loadRazorpay = () => {
  if (window.Razorpay) return Promise.resolve(true);

  if (!razorpayLoadPromise) {
    razorpayLoadPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => {
        razorpayLoadPromise = null; // allow retrying on a later click
        reject(new Error("Failed to load Razorpay checkout script"));
      };
      document.body.appendChild(script);
    });
  }

  return razorpayLoadPromise;
};

export default loadRazorpay;