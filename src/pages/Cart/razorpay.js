export const loadRazorpay = (amount) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      const options = {
        key: "YOUR_RAZORPAY_KEY_ID",
        amount: amount * 100,
        currency: "INR",
        name: "Your Company Name",
        description: "Test Transaction",
        handler: function (response) {
          console.log(response);
          resolve(response);
        },
        prefill: {
          name: "John Doe",
          email: "john@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#F37254",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    };
    script.onerror = () => {
      reject(new Error("Razorpay SDK failed to load"));
    };
    document.body.appendChild(script);
  });
};
