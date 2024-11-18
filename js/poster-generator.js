jQuery(document).ready(function ($) {
  // Append the overlay and close button to the body
  $("body").append(`
        <div id="poster-overlay">
            <img id="poster-preview" src="" alt="Poster Preview">
            <span id="close-overlay">&times;</span> <!-- Close button -->
        </div>
    `);

  // Set the click event for the close button to remove the overlay and preview image
  $("#nv-poster-generate-button").on("click", function () {
    nv_generatePosterAndPopup(); // Call your function when the button is clicked
  });

  // Function to generate the poster and display it in the overlay
  function nv_generatePosterAndPopup() {
    // Set the width of the poster to 375px and reserve space for the QR code
    var posterContent = `
      <div id="poster" style="width: 375px; background-color: black; display: flex; flex-direction: column; align-items: flex-start; justify-content: space-between; padding: 20px 37.5px; margin: 0; color: white; font-family: 'Roboto', '微软雅黑', sans-serif; position: relative; box-sizing: border-box;">
        <!-- poster-content with dynamic height based on its internal image -->
        <div id="poster-content" style="width: 300px; position: relative;">
          <!-- Adding the glow effect behind the product image, centered and with a fixed width of 300px -->
          <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 300px; height: 300px; background: radial-gradient(circle, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.1) 60%, rgba(0,0,0,0) 100%); border-radius: 50%; z-index: 0;"></div>
          <!-- Product image with a fixed width of 300px -->
          <img id="product-image" src="${
            productData.image
          }" style="width: 300px; height: auto; min-width: 300px; min-height: 300px; z-index: 1; position: relative;">
        </div>
        <!-- product-name with fixed height and width, centered and aligned at the bottom -->
        <div id="product-name" style="height: 100px; font-size: 16px; margin-top: 0px; width: calc(375px - 145px); display: flex; align-items: center; justify-content: flex-start; text-align: left; line-height: 1.5em; overflow: hidden; text-overflow: ellipsis;">
          ${productData.name}
        </div>
        <!-- QR code and member ID container -->
        <div style="position: absolute; bottom: 10px; right: 10px; display: flex; align-items: center;">
          <!-- Member ID, displayed vertically to the left of the QR code -->
          <div id="member-id" style="color: white; font-size: 10px; display: flex; flex-direction: column; align-items: center; justify-content: center; margin-right: 5px; line-height: 0.9; letter-spacing: -1px;">
            ${productData.member_id.split("").join("<br>")}
          </div>
          <!-- QR code with padding and 70x70 size, aligned at the bottom-right -->
          <div id="qrcode" style="border: 2px solid white; width: 104px; height: 104px; box-sizing: border-box;"></div>
        </div>
      </div>
        `;

    // Append the poster content to body and generate the QR code with adjusted size (50x50)
    $("body").append(posterContent);
    $("#qrcode").qrcode({
      width: 100,
      height: 100,
      text: productData.referral_url,
    });

    // Use html2canvas to capture the poster with scale=3 and a fixed width of 375px
    html2canvas(document.querySelector("#poster"), {
      backgroundColor: "#000000", // Set background color to black to avoid transparency
      useCORS: true, // Use CORS to load images from external sources
    })
      .then((canvas) => {
        var imgData = canvas.toDataURL("image/png");
        $("#poster-preview").attr("src", imgData); // Set the generated image in the overlay
        $("#poster-overlay").css("display", "flex"); // Show the overlay
        $("body").css("overflow", "hidden"); // Disable scrolling on the body

        // Remove the poster content after generating the image
        $("#poster").remove();
      })
      .catch((err) => {
        // Remove the poster content after generating the image
        $("#poster").remove();
      });
  }

  // Close the overlay when the close button is clicked
  $("#close-overlay").on("click", function () {
    $("#poster-overlay").css("display", "none"); // Hide the overlay
    $("body").css("overflow", "auto"); // Enable scrolling again
  });
});
