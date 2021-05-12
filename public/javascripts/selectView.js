function viewCampgrounds() {
  let campDiv = document.getElementById("campgrounds-view");
  let revDiv = document.getElementById("reviews-view");
  if (campDiv.style.display == "none") {
    campDiv.style.display = "block";
    revDiv.style.display = "none";
  }
}

function viewReviews() {
  let revDiv = document.getElementById("reviews-view");
  let campDiv = document.getElementById("campgrounds-view");
  if (revDiv.style.display == "none") {
    revDiv.style.display = "block";
    campDiv.style.display = "none";
  }
}
