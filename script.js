//fetch all categories
const fetchCategories = async () => {
    try {
        const res = await fetch('https://openapi.programming-hero.com/api/news/categories');
        const data = await res.json();
        return data.data.news_category;
    }
    catch (error) {
        document.getElementById('message').innerHTML = `<h5 class="text-red-700 text-center text-2xl font-semibold mb-4 bg-indigo-50">No news found</h5>`;
    }
}

//show all categories
const showCategories = async () => {
    const categories = document.getElementById('categories');
    const data = await fetchCategories();

    data.forEach(category => {
        const { category_id, category_name } = category;
        const categoryBtn = document.createElement('li');
        categoryBtn.classList.add("nav-item", "flex", "flex-col", "p-2");
        categoryBtn.innerHTML = `<a class="nav-link text-gray-700 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg p-2" href="#">${category_name}</a> `;

        categoryBtn.addEventListener('click', function () {
            const load = document.getElementById('loader');
            load.classList.remove('hidden');
            const fetchedDetails = fetchDetails(category_id);
            showNews(fetchedDetails);
        });
        categories.appendChild(categoryBtn);
    })
}

//fetch all news of one category
const fetchDetails = async (id) => {
    try {
        const res = await fetch(`https://openapi.programming-hero.com/api/news/category/${id}`);
        const data = await res.json();
        return data.data;
    }
    catch (error) {
        document.getElementById('message').innerHTML = `<h5 class="text-red-700 text-center text-2xl font-semibold mb-4 bg-indigo-50">No news found</h5>`;
    }
}

//show all news of one category
const showNews = async (details) => {
    const newsList = await details;
    newsList.sort(function (a, b) { return (b.total_view) - (a.total_view) });
    const newsSec = document.getElementById('news-section');
    document.getElementById('message').innerHTML = `<h5 class="text-indigo-900 text-center text-2xl font-semibold mb-4 bg-indigo-50">${newsList.length ? newsList.length : 'No'} news found</h5>`;

    newsSec.innerHTML = '';
    newsList.forEach(news => {
        const { _id, title, details, total_view, thumbnail_url, author } = news;
        const newsCard = document.createElement('div');
        newsCard.innerHTML =
            `<div class="flex justify-center">
        <div class="flex flex-col xl:flex-row  rounded-lg bg-indigo-50 shadow-lg">
          <img class=" w-full h-96 md:h-auto object-cover rounded-t-md" src="${thumbnail_url}" alt="" />
          <div class="p-6 flex flex-col justify-start">
            <h5 class="text-indigo-900 text-xl font-semibold mb-2">${title}</h5>
            <p class="text-gray-700 text-base mb-4">
              ${details.slice(0, 150)}...
            </p>
            <div class="flex items-center"> 
                <div class="mr-4">
                    <img src="${author.img}" class="w-10 h-auto rounded-full" alt="">
                </div> 
                <div>
                    <p class="text-indigo-900 text-base font-medium">${author.name ? author.name : "No Data Found"}</p>
                    <p>${author.published_date ? author.published_date : "No data found"}</p>
                </div>
            </div>
            <div class = "flex items-center justify-between mt-3">
                <div class="flex items-center"> <i class="fa-solid fa-eye"></i><p class="text-gray-600 text-base">${total_view ? total_view : "No Data Found"}</p>  </div>
                <div>
                    <button data-bs-toggle="modal" data-bs-target="#exampleModalScrollable" onclick="newsModal('${_id}')" class="text-indigo-900">View more <i class="fa-solid fa-arrow-right"></i></button>
                </div>
            </div
          </div>
        </div>
      </div>`;
        newsSec.appendChild(newsCard);
    })
    //spinner
    const load = document.getElementById('loader');
    load.classList.add('hidden');
}

//fetch and modal display
const newsModal = async (id) => {
    const url = `https://openapi.programming-hero.com/api/news/${id}`;
    const resp = await fetch(url);
    const data = await resp.json();
    const newsdetail = data.data[0];

    const { _id, title, author, details, others_info, rating, image_url, total_view, thumbnail_url } = newsdetail;
    document.getElementById('exampleModalScrollableLabel').innerText = `${title}`;
    document.getElementById('news-detail').innerHTML = `
  
   <img class="w-full h-96 md:h-auto object-cover" src="${image_url}" alt="" />
   <div class="p-5">
        <div class="flex items-center justify-between my-3">
            <div class="flex items-center"> 
                <div class="mr-4">
                    <img src="${author.img}" class="w-10 h-auto rounded-full" alt="">
                </div> 
                <div>
                    <p class="text-indigo-900 text-base font-medium"></p>
                    <p>${author.published_date ? author.published_date : "No Data Found"} </p>
                </div>
            </div>
            <div class="flex items-center mt-3"> 
                <i class="fa-solid fa-star mx-2 text-red-500"></i><p class="text-gray-600 text-base">${rating.number ? rating.number : "No Data Found"}</p>  
                <i class="fa-solid fa-eye mx-2 text-indigo-800"></i><p class="text-gray-600 text-base">${total_view ? total_view : "No Data Found"}</p>  
            </div>
        </div> 
        <img src="${thumbnail_url}" class="w-full h-auto " alt="">  
        <p class="text-gray-700 text-base mb-4">
        ${details}
        </p>
        <p class="text-indigo-800 text-base mb-4">
        Tags: ${others_info.is_todays_pick ? 'Today\'s pick' : ''} ${others_info.is_trending ? 'Trending' : ''}
        </p>

   </div> `;

}

showCategories();

