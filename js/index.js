/// <reference types="../@types/jquery" />

// --------------------------side bar-------------------------------
// side-bar

$(function () {
  $(".loading-screen").fadeOut(500, function () {
    $("body").css("overflow", "auto");
  });
});

function closeSideBar() {
  const leftNavWidth = $(".left-nav").outerWidth();
  $(".side-bar").animate({ left: -leftNavWidth }, 500);
  $(".right-nav .right-icons .open-close-icon")
    .removeClass("fa-x")
    .addClass("fa-align-justify");
  $(".left-nav li").animate({ top: 200 }, 500);
}

closeSideBar();

function openSideBar() {
  $(".side-bar").animate({ left: 0 }, 500);

  $(".open-close-icon").addClass("fa-x");
  $(".open-close-icon").removeClass("fa-align-justify");
  let i = 1;
  for (const value of $(".left-nav li")) {
    i++;
    $(value).animate({ top: 0 }, (i + 5) * 100);
  }
}

$(".right-nav .right-icons .open-close-icon").on("click", function () {
  $(".open-close-icon").hasClass("fa-x") ? closeSideBar() : openSideBar();
});
// ------------------------------------------------------------------------

$(document).on("click", ".item", function () {
  let searchvalue = $(this).find("h3").text();

  search(searchvalue).then((meals) => {
    console.log(meals);
    displayDetails(meals[0], "home");
  });
});

function closeHomeDetails() {
  $(".home .first").removeClass("d-none");
  $(".home .first").siblings().addClass("d-none");
  search().then((meals) => {
    displaySearch(meals);
  });
}

function closeDetails(closedInput) {
  $(".loading-screen").fadeIn(350);
  switch (closedInput) {
    case "home":
      closeHomeDetails();
      break;
    case "search":
      closeSearchDetails();
      break;
    case "cat":
      closeCatDetails();
      break;
    case "area":
      closeAreaDetails();
      break;
    case 'ingrad':
      closeIngradDetails()
      break;
  }

  $(".loading-screen").fadeOut(350);
}

// ----------------- search meal----------------------------

async function search(searchInput = "") {
  try {
    $(".loading-screen").fadeIn(250);

    let request = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchInput}`
    );
    let response = await request.json();

    $(".loading-screen").fadeOut(250);
    return response.meals;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

search().then((meals) => {
  displaySearch(meals);
});

function displaySearch(input) {
  let cartoona = ``;
  for (const meal of input) {
    cartoona += `
                <div class="col-md-3">
            <div class="item rounded-2 position-relative">
              <img src="${meal.strMealThumb}" alt="meal-img" class="w-100" />
              <div class="info text-black p-2 d-flex align-items-center">
                <h3>${meal.strMeal}</h3>
              </div>
            </div>
          </div>
    
    `;
  }
  $(".home .first").siblings().addClass("d-none");
  $(".home .first").removeClass("d-none");

  document.querySelector(".home .first").innerHTML = cartoona;
}

function displayDetails(meal, pageBefore) {
  $(".home .second").siblings().addClass("d-none");
  $(".home .second").removeClass("d-none");
  const imgSrc = meal.strMealThumb;
  const mealName = meal.strMeal;
  const inst = meal.strInstructions;
  const area = meal.strArea;
  const category = meal.strCategory;
  let tags = meal.strTags;
  const source = meal.strSource;
  const youtube = meal.strYoutube;
  let ingredients = ``;
  for (let i = 1; i <= 20; i++) {
    const key1 = `strIngredient${i}`;
    const key2 = `strMeasure${i}`;
    if (meal[key1] && meal[key2]) {
      ingredients += `
      
        <span class="alert alert-info m-2 p-1">${meal[key2] + meal[key1]}</span>
      
      `;
    }
  }

  document.querySelector(".details-img").innerHTML = `
                <img
                  src="${imgSrc}"
                  alt=""
                  class="w-100 rounded-2"
                />
                <h2 class="pt-1">${mealName}</h2>
`;
  document.querySelector(".inst").innerHTML = `
     <div class="top d-flex justify-content-between ">
                  <h2>Instructions</h2>

     <button class="btn-close btn-close-white" id="${pageBefore}" onclick="closeDetails('${pageBefore}')"></button>
                </div>

                <p>
                 ${inst}
                </p>
                <h3 >Area : <span class="fw-bolder">${area} </span></h3>
                <h3>Category : <span class="fw-bolder">${category}</span></h3>
                <h3>Reciepes :</h3>
                <div class="ingrad d-flex g-3 flex-wrap">

                ${ingredients}
                </div>
                <h3 class="pb-2 ">Tags :</h3>
                <div class="tagss d-flex g-3 flex-wrap">

                </div>

                <a target="blank" href="${source}" class="btn btn-success mt-2">Source</a>
                <a target="_blank" href="${youtube}" class="btn btn-danger mt-2">Youtube</a>
`;
  if (tags != null) {
    tags = tags.split(",");
    console.log(tags);
    let cartoona = `
  `;
    for (const tag of tags) {
      cartoona += `<span class="alert alert-danger m-2 p-1">${tag}</span><br><br>`;
    }

    document.querySelector(".tagss").innerHTML = cartoona;
  }
}

// ----------------- search navbar----------------------------

$(".search").on("click", function () {
  $(".home .search-area").removeClass("d-none");
  $(".home .search-area").siblings().addClass("d-none");

  document.querySelector(".search-area .search-inputs").innerHTML = `
<div class="nav-search third px-md-5 mx-md-5 pb-5 mb-5 ">
    <div class=" position-relative ">
       <button class="btn-close btn-close-white position-absolute end-0" id="btnClose" onclick="closeSearch()"></button>
       </div>
  <div class="row  pt-5">

    <div class="col-md-6">
      <div class='py-4 py-md-0'>
        <input type="text" class="form form-control searchName w-100" placeholder="Search By Name" oninput="searchByName(this.value)">
      </div>
    </div>
    
   <div class="col-md-6">
    <div>
      <input type="text" class="form form-control searchLetter w-100" placeholder="Search By First Letter" maxlength="1" oninput="searchByLetter(this.value)">
    </div>
   </div>

  </div>
</div>

  `;

  $(".first").html("");

  closeSideBar();
});

function closeSearch() {
  $(".home .first").siblings().addClass("d-none");
  $(".home .first").removeClass("d-none");
  search().then((meals) => {
    displaySearch(meals);
  });
}

function searchByName(searchInput) {
  search(searchInput).then((meals) => {
    displaySearchedMeals(meals);
  });
}

function displaySearchedMeals(input) {
  let cartoona = "";
  for (const meal of input) {
    cartoona += `
      <div class="col-md-3">
        <div class="item-s rounded-2 position-relative">
          <img src="${meal.strMealThumb}" alt="meal-img" class="w-100" />
          <div class="info text-black p-2 d-flex align-items-center">
            <h3>${meal.strMeal}</h3>
          </div>
        </div>
      </div>`;
  }
  document.querySelector(".search-area .mealsSearched").innerHTML = cartoona;
}

$(document).on("click", ".item-s", function () {
  let searchvalue = $(this).find("h3").text();
  search(searchvalue).then((meals) => {
    displayDetails(meals[0], "search");
  });
});

function closeSearchDetails() {
  $(".home .search-area").removeClass("d-none");
  $(".home .search-area").siblings().addClass("d-none");
}

async function searchByLetter(searchInput = "a") {
  try {
    $(".loading-screen").fadeIn(250);

    let request = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?f=${searchInput}`
    );
    let response = await request.json();
    displaySearchedMeals(response.meals);
    $(".loading-screen").fadeOut(250);
    return response.meals;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

////////////////////////////////////tamam///////////////////////////////////////////////////////
// ----------------- categories navbar----------------------------

async function categories() {
  try {
    $(".loading-screen").fadeIn(250);

    let request = await fetch(
      `https://www.themealdb.com/api/json/v1/1/categories.php`
    );
    let response = await request.json();

    displayCategories(response.categories);
    $(".loading-screen").fadeOut(250);
    return response.categories;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

function displayCategories(input) {
  $(".ctegory-area").siblings().addClass("d-none");
  $(".ctegory-area").removeClass("d-none");
  $(".ctegory-area .main-cat").siblings().addClass("d-none");
  $(".ctegory-area .main-cat").removeClass("d-none");

  let cartoona = ``;
  for (const meal of input) {
    cartoona += `
                  <div class="col-md-3">
              <div class="item-category rounded-2 position-relative" >
                <img src="${
                  meal.strCategoryThumb
                }" alt="meal-img" class="w-100" />
                <div class="info text-black p-2  text-center">
                  <h3>${meal.strCategory}</h3>
                  <p>${meal.strCategoryDescription
                    .split(" ")
                    .slice(0, 20)
                    .join(" ")}</p>
                </div>
              </div>
            </div>
      
      `;
  }

  document.querySelector(".ctegory-area .main-cat").innerHTML =
    ` 
    <div class="row gy-4  ">
    <button class="btn-close btn-close-white ms-auto " id="btnClose" onclick="closeCat1()"></button>
        </div>

     ` + cartoona;
}

$(".categories").on("click", function () {
  closeSideBar();

  categories();
});

function closeCat1() {
  search().then((meals) => {
    displaySearch(meals);
  });
}

async function searchCategories(ctegoryInput) {
  try {
    $(".loading-screen").fadeIn(250);

    let request =
      await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${ctegoryInput}

`);
    let response = await request.json();

    $(".loading-screen").fadeOut(250);
    return response.meals;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

function displayCategories2(input) {
  $(".ctegory-area").removeClass("d-none");
  $(".ctegory-area").siblings().addClass("d-none");
  $(".ctegory-area .sec-cat").siblings().addClass("d-none");
  $(".ctegory-area .sec-cat").removeClass("d-none");

  let cartoona = "";
  for (const meal of input) {
    cartoona += `
        <div class="col-md-3">
          <div class="item-cat rounded-2 position-relative">
            <img src="${meal.strMealThumb}" alt="meal-img" class="w-100" />
            <div class="info text-black p-2 d-flex align-items-center justify-content-center">
              <h3>${meal.strMeal}</h3>
            </div>
          </div>
        </div>`;
  }

  document.querySelector(".ctegory-area .sec-cat").innerHTML =
    `
      <div class="row gy-4">
        <button class="btn-close btn-close-white ms-auto" id="btnClose" onclick="closeCat2()"></button>
      </div>` + cartoona;

}

$(document).on("click", ".item-category", function () {
  let searchvalue = $(this).find("h3").text();

  searchCategories(searchvalue).then((meals) => {
    displayCategories2(meals);
  });
});

function closeCat2() {
  $(".ctegory-area").siblings().addClass("d-none");
  $(".ctegory-area").removeClass("d-none");

  $(".ctegory-area .main-cat").siblings().addClass("d-none");
  $(".ctegory-area .main-cat").removeClass("d-none");
  categories();
}

$(document).on("click", ".item-cat", function () {
  let searchvalue = $(this).find("h3").text();

  search(searchvalue).then((meals) => {
    console.log(meals);
    displayDetails(meals[0], "cat");
  });
});

function closeCatDetails() {
  $(".ctegory-area").siblings().addClass("d-none");
  $(".ctegory-area").removeClass("d-none");

  $(".ctegory-area .sec-cat").siblings().addClass("d-none");
}

// ----------------- area navbar----------------------------

async function area() {
  try {
    $(".loading-screen").fadeIn(250);

    let request =
      await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list
`);
    let response = await request.json();

    displayAreas(response.meals);
    $(".loading-screen").fadeOut(250);
    return response.meals;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

function displayAreas(input) {
  $(".area-area").siblings().addClass("d-none");
  $(".area-area").removeClass("d-none");
  $(".area-area .main-area").siblings().addClass("d-none");
  $(".area-area .main-area").removeClass("d-none");
  let cartoona = ``;
  for (const meal of input) {
    cartoona += `
                  <div class="col-md-3">
              <div class="item-area rounded-2 position-relative text-center" >
              <i class="fa-solid fa-house-laptop fa-4x"></i>
                  <h3>${meal.strArea}</h3>

              </div>
            </div>
      
      `;
  }

  document.querySelector(".area-area .main-area").innerHTML =
    ` 
    <div class="row gy-4  ">
    <button class="btn-close btn-close-white ms-auto " id="btnClose" onclick="closeArea1()"></button>
        </div>

     ` + cartoona;
}

$(".area").on("click", function () {
  closeSideBar();

  area();
});

function closeArea1() {
  search().then((meals) => {
    displaySearch(meals);
  });
}

async function searchAreas(areaInput) {
  try {
    $(".loading-screen").fadeIn(250);

    let request =
      await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=
${areaInput}
  
  `);
    let response = await request.json();

    $(".loading-screen").fadeOut(250);
    return response.meals;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

function displayAreas2(input) {
  $(".area-area").siblings().addClass("d-none");
  $(".area-area").removeClass("d-none");
  $(".area-area .sec-area").siblings().addClass("d-none");
  $(".area-area .sec-area").removeClass("d-none");
  let cartoona = ``;
  for (const meal of input) {
    cartoona += `
                    <div class="col-md-3">
                <div class="item-ar rounded-2 position-relative">
                  <img src="${meal.strMealThumb}" alt="meal-img" class="w-100" />
                  <div class="info text-black p-2  d-flex align-items-center justify-content-center">
                    <h3>${meal.strMeal}</h3>
  
                  </div>
                </div>
              </div>
        
        `;
  }

  document.querySelector(".area-area .sec-area").innerHTML =
    `
          <div class="row gy-4  ">
      <button class="btn-close btn-close-white ms-auto " id="btnClose" onclick="closeArea2()"></button>
          </div>
  
       ` + cartoona;
}

$(document).on("click", ".item-area", function () {
  let searchvalue = $(this).find("h3").text();

  searchAreas(searchvalue).then((meals) => {
    displayAreas2(meals);
  });
});

function closeArea2() {
  $(".area-area").siblings().addClass("d-none");
  $(".area-area").removeClass("d-none");

  $(".area-area .main-area").siblings().addClass("d-none");
  $(".area-area .main-area").removeClass("d-none");
  area();
}

$(document).on("click", ".item-ar", function () {
  let searchvalue = $(this).find("h3").text();

  search(searchvalue).then((meals) => {
    displayDetails(meals[0], "area");
  });
});

function closeAreaDetails() {
  $(".area-area").siblings().addClass("d-none");
  $(".area-area").removeClass("d-none");

  $(".area-area .sec-area").siblings().addClass("d-none");
}

// ----------------- ingradients navbar----------------------------

async function ingrad() {
  try {
    $(".loading-screen").fadeIn(250);

    let request = await fetch(
      "https://www.themealdb.com/api/json/v1/1/list.php?i=list"
    );
    let response = await request.json();

    displayIngrads(response.meals.slice(0, 20));
    $(".loading-screen").fadeOut(250);
    return response.meals;
  } catch (error) {
    console.error("Error fetching data:", error);
    $(".loading-screen").fadeOut(250); // Ensure loading screen hides on error
    return null;
  }
}

function displayIngrads(input) {
  $(".ingrad-area").siblings().addClass("d-none");
  $(".ingrad-area").removeClass("d-none");
  $(".ingrad-area .main-ingrad").siblings().addClass("d-none");
  $(".ingrad-area .main-ingrad").removeClass("d-none");
  let cartoona = ``;
  for (const meal of input) {
    // Check if strDescription is valid
    let description = meal.strDescription
      ? meal.strDescription.split(" ").slice(0, 20).join(" ")
      : "";

    cartoona += `
      <div class="col-md-3">
        <div class="item-ingrad rounded-2 position-relative text-center">
          <i class="fa-solid fa-drumstick-bite fa-4x"></i>
          <h3>${meal.strIngredient}</h3>
          <p>${description}</p>
        </div>
      </div>
    `;
  }

  document.querySelector(".ingrad-area .main-ingrad").innerHTML =
    `
    <div class="row gy-4">
      <button class="btn-close btn-close-white ms-auto" id="btnClose" onclick="closeCat1()"></button>
    </div>
  ` + cartoona;
}

$(".ingradients").on("click", function () {


  closeSideBar();
  ingrad();
});


async function searchIngrads(ingradInput) {
  try {
    $(".loading-screen").fadeIn(250);

    let request =
      await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=
${ingradInput}

`);
    let response = await request.json();

    $(".loading-screen").fadeOut(250);
    return response.meals;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

function displayIngrad2(input) {
  $(".ingrad-area").removeClass("d-none");
  $(".ingrad-area").siblings().addClass("d-none");
  $(".ingrad-area .sec-ingrad").siblings().addClass("d-none");
  $(".ingrad-area .sec-ingrad").removeClass("d-none");
  let cartoona = ``;
  for (const meal of input) {
    cartoona += `
                  <div class="col-md-3">
              <div class="item-in rounded-2 position-relative">
                <img src="${meal.strMealThumb}" alt="meal-img" class="w-100" />
                <div class="info text-black p-2  d-flex align-items-center justify-content-center">
                  <h3>${meal.strMeal}</h3>

                </div>
              </div>
            </div>
      
      `;
  }

  document.querySelector(".ingrad-area .sec-ingrad").innerHTML =
    `
        <div class="row gy-4  ">
    <button class="btn-close btn-close-white ms-auto " id="btnClose" onclick="closeIngrd2()"></button>
        </div>

     ` + cartoona;
}

$(document).on("click", ".item-ingrad", function () {
  let searchvalue = $(this).find("h3").text();

  searchIngrads(searchvalue).then((meals) => {
    displayIngrad2(meals);
  });
});


function closeIngrd2() {
  ingrad();
}

$(document).on("click", ".item-in", function () {
  let searchvalue = $(this).find("h3").text();

  search(searchvalue).then((meals) => {
    console.log(meals);
    displayDetails(meals[0], "ingrad");
  });
});

function closeIngradDetails() {
  $(".ingrad-area").siblings().addClass("d-none");
  $(".ingrad-area").removeClass("d-none");

  $(".ingrad-area .sec-ingrad").siblings().addClass("d-none");
}



// ----------------- contact-us navbar----------------------------

$(".contact").on("click", function () {
  $(".home .contact-us").siblings().addClass("d-none");
  $(".home .contact-us").removeClass("d-none");

  closeSideBar();
  clearForm()
  
});
let isInName =false
let isInEmail =false
let isInPhone=false
let isInAge =false
let isInPassword =false
let isInRepass =false


document.querySelector('#name').addEventListener('focus',function(){
  isInName = true
})

document.querySelector('#email').addEventListener('focus',function(){
  isInEmail = true
})

document.querySelector('#phone').addEventListener('focus',function(){
  isInPhone = true
})

document.querySelector('#age').addEventListener('focus',function(){
  isInAge = true
})

document.querySelector('#pass').addEventListener('focus',function(){
  isInPassword = true
})

document.querySelector('#repass').addEventListener('focus',function(){
  isInRepass = true
})





function nameValidate() {
  let regex = /[a-zA-z]{4,}/;
  let test = regex.test($("#name").val());

  return test;
}

function emilValidate() {
  let regex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  let test = regex.test($("#email").val());

  return test;
}

function phoneValidate() {
  let regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  let test = regex.test($("#phone").val());
  
    
  return test;
}

function ageValidate() {
  let regex = /^(1[0-9]|[2-9][0-9]|100)$/;
  let test = regex.test($("#age").val());
   
  return test;
}

function passwordValidate() {
  let regex = /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/;
  let test = regex.test($("#pass").val());

  return test;
}

function repassValidate() {
  let test = $("#pass").val() == $("#repass").val();


  return test;
}

function isAllValid() {
  
  if(isInName) { 
    
    nameValidate()? $("#nameAlert").addClass("d-none")
: $("#nameAlert").removeClass("d-none");

  };


  if(isInEmail)  
     { 
      emilValidate()
      ? $("#emailAlert").addClass("d-none")
      : $("#emailAlert").removeClass("d-none");
      
     };

  if(isInPhone) {
    phoneValidate()? $("#phoneAlert").addClass("d-none")
    : $("#phoneAlert").removeClass("d-none");
  
  };

  if(isInAge){ 
     ageValidate() ? $("#ageAlert").addClass("d-none")
     : $("#ageAlert").removeClass("d-none");
    };


  if(isInPassword) {
    passwordValidate() ? $("#passwordAlert").addClass("d-none")
    : $("#passwordAlert").removeClass("d-none");
  };
  if(isInRepass) {
    repassValidate()? $("#repasswordAlert").addClass("d-none")
    : $("#repasswordAlert").removeClass("d-none");
  };
 

  if (
    nameValidate() &&
    emilValidate() &&
    phoneValidate() &&
    ageValidate() &&
    passwordValidate() &&
    repassValidate()
  ) {
    console.log("success");
    $("#submitBtn").attr("disabled", false);
  } else {
    console.log("failed");
    $("#submitBtn").attr("disabled", true);
  }
}

function clearForm() {
  $("#name").val("");
  $("#email").val("");
  $("#phone").val("");
  $("#age").val("");
  $("#pass").val("");
  $("#repass").val("");
}
$("#submitBtn").on("click", () => {
  clearForm();
});

function closeContact(){
  $(".home .contact-us").addClass("d-none");
  search().then((meals) => {
    displaySearch(meals);
  });
}