// State management
let products = [];
let colors = [];
let selections = [];

// Load data on page load
document.addEventListener("DOMContentLoaded", async () => {
  await loadData();
  renderColorHeaders();
  renderProducts();
  updateOrderSummary();
});

// Load products and colors from JSON files
async function loadData() {
  try {
    const [productsResponse, colorsResponse] = await Promise.all([
      fetch("products.json"),
      fetch("colors.json"),
    ]);

    products = await productsResponse.json();
    colors = await colorsResponse.json();
  } catch (error) {
    console.error("Eroare la încărcarea datelor:", error);
    alert(
      "Ne pare rău, nu am putut încărca produsele. Te rugăm să reîncarci pagina."
    );
  }
}

// Render color headers in table
function renderColorHeaders() {
  // No longer rendering color boxes in header - just the text "Culoare"
}

// Render products table
function renderProducts() {
  const tbody = document.getElementById("productsBody");
  tbody.innerHTML = "";

  products
    .filter((product) => product.activ !== false)
    .sort((a, b) => a.id - b.id)
    .forEach((product) => {
      const row = document.createElement("tr");
      row.dataset.productId = product.id;

      // Checkbox cell
      const checkboxCell = document.createElement("td");
      checkboxCell.className = "checkbox-cell";
      checkboxCell.innerHTML = `
            <input type="checkbox" 
                   class="product-checkbox" 
                   id="product-${product.id}" 
                   onchange="handleProductSelect(${product.id})">
        `;

      // Image cell with gallery support
      const imageCell = document.createElement("td");
      imageCell.className = "image-cell-container";

      if (product.poze.length > 1) {
        // Multiple images - create gallery
        let galleryHTML = `
        <div class="image-gallery">
          <img src="${product.poze[0]}" 
               alt="${product.descriere}" 
               class="product-image main-image"
               onclick="openImageGallery(${product.id}, 0)"
               onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect fill=%22%23e5e7eb%22 width=%22100%22 height=%22100%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2214%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%236b7280%22%3E${product.descriere}%3C/text%3E%3C/svg%3E'"
               style="touch-action: manipulation;">
          <div class="gallery-indicators">`;

        product.poze.forEach((_, index) => {
          galleryHTML += `<span class="gallery-dot ${
            index === 0 ? "active" : ""
          }" onclick="changeMainImage(${product.id}, ${index})"></span>`;
        });

        galleryHTML += `
          </div>
        </div>`;

        imageCell.innerHTML = galleryHTML;
      } else {
        // Single image
        imageCell.innerHTML = `
        <img src="${product.poze[0]}" 
             alt="${product.descriere}" 
             class="product-image"
             onclick="openImageGallery(${product.id}, 0)"
             onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect fill=%22%23e5e7eb%22 width=%22100%22 height=%22100%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2214%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%236b7280%22%3E${product.descriere}%3C/text%3E%3C/svg%3E'"
             style="touch-action: manipulation;">`;
      }

      // Name + description cell
      const nameCell = document.createElement("td");
      nameCell.innerHTML = `
      <span class="product-name">${product.descriere}</span>
      <div class="product-desc">${product.descriereText || ""}</div>
    `;

      // Price cell
      const priceCell = document.createElement("td");
      priceCell.innerHTML = `<span class="product-price">${product.pret} RON</span>`;

      // Colors cell
      const colorsCell = document.createElement("td");
      colorsCell.className = "colors-cell";

      // Create mobile custom dropdown
      const mobileDropdown = document.createElement("div");
      mobileDropdown.className = "color-select-mobile custom-dropdown";
      mobileDropdown.id = `color-select-${product.id}`;
      mobileDropdown.setAttribute("data-disabled", "true");
      mobileDropdown.setAttribute("data-product-id", product.id);

      // Selected display
      const selectedDisplay = document.createElement("div");
      selectedDisplay.className = "dropdown-selected";
      selectedDisplay.innerHTML = `
      <span class="selected-text">Alege culoarea...</span>
      <span class="dropdown-arrow">▼</span>
    `;
      selectedDisplay.onclick = () => toggleCustomDropdown(product.id);

      // Options list
      const optionsList = document.createElement("div");
      optionsList.className = "dropdown-options";

      colors
        .filter((color) => color.activ !== false)
        .forEach((color) => {
          const optionItem = document.createElement("div");
          optionItem.className = "dropdown-option";
          optionItem.setAttribute("data-value", color.id);
          optionItem.innerHTML = `
        <span class="color-circle" style="background-color: ${color.hex}; ${
            color.id === "white" ? "border: 2px solid #d1d5db;" : ""
          }"></span>
        <span class="color-name">${color.nume}</span>
      `;
          optionItem.onclick = () =>
            selectCustomDropdownOption(
              product.id,
              color.id,
              color.nume,
              color.hex
            );
          optionsList.appendChild(optionItem);
        });

      mobileDropdown.appendChild(selectedDisplay);
      mobileDropdown.appendChild(optionsList);
      colorsCell.appendChild(mobileDropdown);

      // Create desktop color boxes (radio buttons)
      const desktopColors = document.createElement("div");
      desktopColors.className = "color-options-desktop";

      colors
        .filter((color) => color.activ !== false)
        .forEach((color) => {
          const colorOption = document.createElement("div");
          colorOption.className = "color-option";
          colorOption.setAttribute("data-color-name", color.nume);

          colorOption.innerHTML = `
                <input type="radio" 
                       class="color-radio" 
                       name="color-${product.id}" 
                       value="${color.id}" 
                       id="color-${product.id}-${color.id}"
                       onchange="handleColorSelect(${product.id}, '${
            color.id
          }')"
                       disabled>
                <label for="color-${product.id}-${color.id}">
                    <div class="color-box" style="background-color: ${
                      color.hex
                    }; ${
            color.id === "white" ? "border-color: #d1d5db;" : ""
          }"></div>
                </label>
            `;

          desktopColors.appendChild(colorOption);
        });

      colorsCell.appendChild(desktopColors);

      row.appendChild(checkboxCell);
      row.appendChild(imageCell);
      row.appendChild(nameCell);
      row.appendChild(priceCell);
      row.appendChild(colorsCell);

      tbody.appendChild(row);
    });
}

// Handle product selection
function handleProductSelect(productId) {
  const checkbox = document.getElementById(`product-${productId}`);
  const row = document.querySelector(`tr[data-product-id="${productId}"]`);
  const colorRadios = row.querySelectorAll(".color-radio");
  const customDropdown = row.querySelector(
    ".color-select-mobile.custom-dropdown"
  );

  if (checkbox.checked) {
    // Enable color selection
    colorRadios.forEach((radio) => (radio.disabled = false));
    if (customDropdown) {
      customDropdown.setAttribute("data-disabled", "false");
      customDropdown.classList.remove("disabled");
    }
    row.classList.add("selected");

    // Add to selections if not already there
    if (!selections.find((s) => s.productId === productId)) {
      selections.push({
        productId: productId,
        colorId: null,
      });
    }
  } else {
    // Disable color selection and clear selection
    colorRadios.forEach((radio) => {
      radio.disabled = true;
      radio.checked = false;
    });
    if (customDropdown) {
      customDropdown.setAttribute("data-disabled", "true");
      customDropdown.classList.add("disabled");
      const selectedText = customDropdown.querySelector(".selected-text");
      if (selectedText) selectedText.textContent = "Alege culoarea...";
      const selectedCircle = customDropdown.querySelector(
        ".selected-color-circle"
      );
      if (selectedCircle) selectedCircle.remove();
    }
    row.classList.remove("selected");

    // Remove from selections
    selections = selections.filter((s) => s.productId !== productId);
  }

  updateOrderSummary();
}

// Handle color selection
function handleColorSelect(productId, colorId) {
  const selection = selections.find((s) => s.productId === productId);
  if (selection) {
    selection.colorId = colorId;
  }

  // Sync between radio and select
  const row = document.querySelector(`tr[data-product-id="${productId}"]`);
  const colorSelect = row.querySelector(".color-select-mobile");
  const colorRadio = row.querySelector(`input[value="${colorId}"]`);

  if (colorSelect && colorSelect.value !== colorId) {
    colorSelect.value = colorId;
  }
  if (colorRadio && !colorRadio.checked) {
    colorRadio.checked = true;
  }

  updateOrderSummary();
}

// Update order summary
function updateOrderSummary() {
  const totalAmountEl = document.getElementById("totalAmount");
  const selectedCountEl = document.getElementById("selectedCount");
  const whatsappBtn = document.getElementById("whatsappBtn");
  const nameInput = document.getElementById("customerName");

  // Calculate total
  let total = 0;
  selections.forEach((selection) => {
    const product = products.find((p) => p.id === selection.productId);
    if (product) {
      total += product.pret;
    }
  });

  totalAmountEl.textContent = `${total} RON`;
  selectedCountEl.textContent = `${selections.length} ${
    selections.length === 1 ? "produs selectat" : "produse selectate"
  }`;

  // Enable/disable name input
  if (selections.length > 0) {
    nameInput.disabled = false;
  } else {
    nameInput.disabled = true;
    nameInput.value = "";
  }

  // Enable/disable WhatsApp button
  const allHaveColors =
    selections.length > 0 && selections.every((s) => s.colorId !== null);
  const hasName = nameInput.value.trim() !== "";
  whatsappBtn.disabled = !(allHaveColors && hasName);
}

// Send order via WhatsApp
document.getElementById("whatsappBtn").addEventListener("click", () => {
  const nameInput = document.getElementById("customerName");
  const customerName = nameInput.value.trim();

  if (selections.length === 0) return;

  // Check if all selections have colors
  const allHaveColors = selections.every((s) => s.colorId !== null);
  if (!allHaveColors) {
    alert("Te rugăm să selectezi o culoare pentru fiecare produs!");
    return;
  }

  // Check if name is provided
  if (customerName === "") {
    alert("Te rugăm să introduci numele tău!");
    nameInput.focus();
    return;
  }

  // Build message
  let message = "🎨 *Comandă Levi 3D Lab*\n\n";
  message += `👤 *Pentru:* ${customerName}\n\n`;
  message += "📦 *Produse comandate:*\n\n";

  let total = 0;
  selections.forEach((selection, index) => {
    const product = products.find((p) => p.id === selection.productId);
    const color = colors.find((c) => c.id === selection.colorId);

    if (product && color) {
      message += `${index + 1}. ${product.descriere}\n`;
      message += `   Culoare: ${color.nume}\n`;
      message += `   Preț: ${product.pret} RON\n\n`;
      total += product.pret;
    }
  });

  message += `💰 *TOTAL: ${total} RON*`;

  // Encode message for URL
  const encodedMessage = encodeURIComponent(message);
  const phoneNumber = "40730020215";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  // Open WhatsApp
  window.open(whatsappUrl, "_blank");
});

// Image gallery state
let currentGalleryProduct = null;
let currentGalleryIndex = 0;

// Change main image in table
function changeMainImage(productId, imageIndex) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  const row = document.querySelector(`tr[data-product-id="${productId}"]`);
  const mainImage = row.querySelector(".main-image");
  const dots = row.querySelectorAll(".gallery-dot");

  mainImage.src = product.poze[imageIndex];

  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === imageIndex);
  });
}

// Open image gallery in modal
function openImageGallery(productId, startIndex = 0) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  currentGalleryProduct = product;
  currentGalleryIndex = startIndex;

  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImage");
  const caption = document.getElementById("modalCaption");

  modal.style.display = "flex";
  modalImg.src = product.poze[startIndex];
  caption.textContent = `${product.descriere} (${startIndex + 1}/${
    product.poze.length
  })`;
  document.body.style.overflow = "hidden";

  // Update navigation visibility
  updateModalNavigation();
}

// Navigate gallery in modal
function navigateGallery(direction) {
  if (!currentGalleryProduct) return;

  currentGalleryIndex += direction;

  // Loop around
  if (currentGalleryIndex < 0) {
    currentGalleryIndex = currentGalleryProduct.poze.length - 1;
  } else if (currentGalleryIndex >= currentGalleryProduct.poze.length) {
    currentGalleryIndex = 0;
  }

  const modalImg = document.getElementById("modalImage");
  const caption = document.getElementById("modalCaption");

  modalImg.src = currentGalleryProduct.poze[currentGalleryIndex];
  caption.textContent = `${currentGalleryProduct.descriere} (${
    currentGalleryIndex + 1
  }/${currentGalleryProduct.poze.length})`;
}

// Update modal navigation button visibility
function updateModalNavigation() {
  const prevBtn = document.querySelector(".modal-prev");
  const nextBtn = document.querySelector(".modal-next");

  if (currentGalleryProduct && currentGalleryProduct.poze.length > 1) {
    if (prevBtn) prevBtn.style.display = "flex";
    if (nextBtn) nextBtn.style.display = "flex";
  } else {
    if (prevBtn) prevBtn.style.display = "none";
    if (nextBtn) nextBtn.style.display = "none";
  }
}

// Image modal functions
function openImageModal(imageSrc, imageAlt) {
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImage");
  const caption = document.getElementById("modalCaption");

  modal.style.display = "flex";
  modalImg.src = imageSrc;
  caption.textContent = imageAlt;
  document.body.style.overflow = "hidden";
}

function closeImageModal() {
  const modal = document.getElementById("imageModal");
  modal.style.display = "none";
  document.body.style.overflow = "auto";
  currentGalleryProduct = null;
  currentGalleryIndex = 0;
}

// Prevent image modal from opening when selecting checkbox on mobile
function handleImageClick(event, imageSrc, imageAlt) {
  // Don't open modal if clicking near checkbox
  const checkbox = event.target
    .closest("tr")
    .querySelector(".product-checkbox");
  const checkboxRect = checkbox.getBoundingClientRect();
  const clickX = event.clientX || (event.touches && event.touches[0].clientX);
  const clickY = event.clientY || (event.touches && event.touches[0].clientY);

  // Check if click is near checkbox area
  if (
    clickX >= checkboxRect.left - 20 &&
    clickX <= checkboxRect.right + 20 &&
    clickY >= checkboxRect.top - 20 &&
    clickY <= checkboxRect.bottom + 20
  ) {
    return;
  }

  openImageModal(imageSrc, imageAlt);
}

// Add visual feedback for interactions
document.addEventListener("DOMContentLoaded", () => {
  // Modal close handlers
  const modal = document.getElementById("imageModal");
  const closeBtn = document.querySelector(".modal-close");

  closeBtn.onclick = closeImageModal;
  modal.onclick = function (event) {
    if (event.target === modal) {
      closeImageModal();
    }
  };

  // Close modal on Escape key, navigate with arrow keys
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeImageModal();
    } else if (event.key === "ArrowLeft" && currentGalleryProduct) {
      navigateGallery(-1);
    } else if (event.key === "ArrowRight" && currentGalleryProduct) {
      navigateGallery(1);
    }
  });

  // Add smooth scroll behavior
  document.documentElement.style.scrollBehavior = "smooth";

  // Add name input listener
  const nameInput = document.getElementById("customerName");
  if (nameInput) {
    nameInput.addEventListener("input", updateOrderSummary);
  }

  // Add loading animation
  const style = document.createElement("style");
  style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .products-table tbody tr {
            animation: fadeIn 0.5s ease-out forwards;
        }
        
        .products-table tbody tr:nth-child(1) { animation-delay: 0.1s; }
        .products-table tbody tr:nth-child(2) { animation-delay: 0.2s; }
        .products-table tbody tr:nth-child(3) { animation-delay: 0.3s; }
        .products-table tbody tr:nth-child(4) { animation-delay: 0.4s; }
        .products-table tbody tr:nth-child(5) { animation-delay: 0.5s; }
        .products-table tbody tr:nth-child(6) { animation-delay: 0.6s; }
        .products-table tbody tr:nth-child(7) { animation-delay: 0.7s; }
        .products-table tbody tr:nth-child(8) { animation-delay: 0.8s; }
    `;
  document.head.appendChild(style);

  // Close custom dropdowns when clicking outside
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".custom-dropdown")) {
      document.querySelectorAll(".custom-dropdown").forEach((dropdown) => {
        dropdown.classList.remove("open");
      });
    }
  });
});

// Custom dropdown functions
function toggleCustomDropdown(productId) {
  const dropdown = document.getElementById(`color-select-${productId}`);
  if (!dropdown || dropdown.getAttribute("data-disabled") === "true") return;

  const isOpen = dropdown.classList.contains("open");

  // Close all other dropdowns
  document.querySelectorAll(".custom-dropdown").forEach((dd) => {
    dd.classList.remove("open");
  });

  // Toggle this dropdown
  if (!isOpen) {
    dropdown.classList.add("open");
  }
}

function selectCustomDropdownOption(productId, colorId, colorName, colorHex) {
  const dropdown = document.getElementById(`color-select-${productId}`);
  if (!dropdown || dropdown.getAttribute("data-disabled") === "true") return;

  // Update the selected display
  const selectedDisplay = dropdown.querySelector(".dropdown-selected");
  const selectedText = selectedDisplay.querySelector(".selected-text");

  // Remove existing color circle if any
  const existingCircle = selectedDisplay.querySelector(
    ".selected-color-circle"
  );
  if (existingCircle) existingCircle.remove();

  // Add new color circle
  const colorCircle = document.createElement("span");
  colorCircle.className = "selected-color-circle color-circle";
  colorCircle.style.backgroundColor = colorHex;
  if (colorId === "white") {
    colorCircle.style.border = "2px solid #d1d5db";
  }

  selectedDisplay.insertBefore(colorCircle, selectedText);
  selectedText.textContent = colorName;

  // Close dropdown
  dropdown.classList.remove("open");

  // Update selection and sync with radio buttons
  handleColorSelect(productId, colorId);
}
