// function isHomePage() {
//     return window.location.pathname === "/";
// }

var firstLoad = true;
var lastPath = "/";

document.addEventListener("click", e => {
    if (e.target.tagName === "A") {
        route(e);
    }
    e.preventDefault();
})

const route = (e) => {
    window.history.pushState({}, '', e.target.href);
    handleLocatioin(e.target.parentNode.parentNode.id);
}

const routers = {
    '/': "index.html",
    "/style": "./pages/eraDetailIndex.html",
}

async function getStyleData(styleSlug) {
    var stylePath = `http://127.0.0.1:8000/styles/${styleSlug}`;
    return await fetch(stylePath)
        .then((data) => data.json())
}

async function getStylePhotos(styleId) {
    var stylePhotoPath = `http://127.0.0.1:8000/styles/${styleId}/photos`;
    return await fetch(stylePhotoPath)
        .then((data) => data.json())
}

const handleLocatioin = async (parentNodeId) => {

    const path = window.location.pathname;

    if ((typeof parentNodeId) === "string") {
        console.log(parentNodeId);
        var styleData = await getStyleData(parentNodeId);
        var stylePhotos = await getStylePhotos(styleData["id"]);
    }

    var html = await fetch(routers[path])
        .then((data) => data.text())
        .then(templateHtml => {
            if ((typeof parentNodeId) === "string") {
                var html = templateHtml
                    .replace("#{title}", styleData["name"])
                    .replace("#{period}", styleData["time"])
                    .replace("#{d_f}", styleData["distinctive_features"])
                    .replace("#{Main_decorative_elements}", styleData["basic_decorative_elements"])
                    .replace("#{was_built}", styleData["was_built"])
                    .replace("#{name_of_example}", styleData["example_name"])
                    .replace("#{stylePhoto}", stylePhotos["links"][0]);
                return html;
            }
            return templateHtml;
        });
    const baseContent = document.getElementById("baseContent");
    
    if (baseContent) {
        if (path !== "/") {
            console.log("here 1");
            baseContent.classList.remove('animate-slide-down');
            void baseContent.offsetWidth;
            baseContent.classList.add('animate-slide-up');
            setTimeout(() => {
                baseContent.innerHTML = html;
                baseContent.classList.remove('animate-slide-up');
            }, 1000);
            window.scrollTo(0, 0);
        } else {
            console.log("here 2");
            if (lastPath !== '/') {
                console.log("here 3");
                baseContent.classList.remove('animate-slide-up');
                void baseContent.offsetWidth;
                baseContent.classList.add('animate-slide-down');
                setTimeout(() => {
                    baseContent.innerHTML = html;
                    baseContent.classList.remove('animate-slide-down');
                }, 1000);
                window.scrollTo(0, 0);
            }
            console.log("here 4");
            baseContent.innerHTML = html;
        }
    } else {
        console.error('Element #baseContent not found!');
    }

    firstLoad = false;
    lastPath = path;
}

window.onpopstate = handleLocatioin;
window.route = route;

window.onload = handleLocatioin;
handleLocatioin();

