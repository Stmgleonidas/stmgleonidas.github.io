//carousel
document.querySelectorAll('.tech-carousel').forEach(track => {
  track.innerHTML += track.innerHTML;
});


//dark mode
const toggleBtn = document.getElementById("darkModeToggle");
toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");
    toggleBtn.textContent = isDark ? "🌜" : "🌞";
});

//get year
const y= new Date();
let year= y.getFullYear();

document.getElementById("getyear").innerHTML = "© "+ year + " Stamatogiannis Leonidas. All rights reserved.";