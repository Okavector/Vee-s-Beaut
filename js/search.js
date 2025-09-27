// search.js

async function performSearch(query) {
  if (!query) return;

  const { createClient } = await import("https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm");
  const supabaseUrl = "https://mysclprkzyjujzmuqywa.supabase.co";
  const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15c2NscHJrenlqdWp6bXVxeXdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2MTU1MTYsImV4cCI6MjA3NDE5MTUxNn0.792rk9eC_4JQ2L7hyNApoFDJ3N6v6Oxzf6Cn22PM-Jc"; // replace with your real key
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .or(`name.ilike.%${query}%,category.ilike.%${query}%`);

  if (error) {
    console.error("Search error:", error);
    return;
  }

  displayResults(products, query);
}

function displayResults(products, query) {
  const resultsContainer = document.getElementById("search-results");
  if (!resultsContainer) return; // If not on search.html, skip

  resultsContainer.innerHTML = "";

  if (!products || products.length === 0) {
    resultsContainer.innerHTML = `<p>No products found for "${query}"</p>`;
    return;
  }

  products.forEach((product) => {
    resultsContainer.innerHTML += `
      <div class="col-lg-3 col-md-6 col-sm-12 pb-1">
        <div class="card product-item">
          <div class="card-header product-img">
            <img class="img-fluid w-100" src="${product.image_url}" alt="${product.name}">
          </div>
          <div class="card-body text-center">
            <h6 class="text-truncate mb-3">${product.name}</h6>
            <h6>₦${Number(product.price).toLocaleString()}</h6>
          </div>
        </div>
      </div>`;
  });
}

// Run only on search.html
document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get("q");
  if (query) {
    performSearch(query);
  }
});
