const url = "https://api.quran.com/api/v4/chapters?language=en";
function page() {
  fetch(url).then((res) => res.json())
  .then(data=>console.log(data))
  .catch(err=>console.warn(err.message));
}
window.addEventListener('load',page)