tailwind.config = {
    theme: {
      extend: {
        colors: {
          primary:"#0346f2"
        },
        transitionProperty: {
      'left': 'left'
    },
      }
    }
  }
  
const mobiletoggle = document.getElementById("mobile-toggle");
const drawer = document.getElementById("drawer");
const drop = document.querySelector(".drop-down");
const user = document.querySelector(".user");
mobiletoggle.onclick = ()=>{
drawer.classList.toggle("left-0")
}


user.onclick = ()=>{
drop.classList.toggle("show")
}