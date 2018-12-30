function get(url) {
    // Return a new promise.
    return new Promise(function(resolve, reject) {
        // Do the usual XHR stuff
        let req = new XMLHttpRequest();
        req.open('GET', url);

        req.onload = function() {
            // This is called even on 404 etc
            // so check the status
            if (req.status === 200) {
                // Resolve the promise with the response text
                resolve(req.response);
            }
            else {
                // Otherwise reject with the status text
                // which will hopefully be a meaningful error
                reject(Error(req.statusText));
            }
        };

        // Handle network errors
        req.onerror = function() {
            reject(Error("Network Error"));
        };

        // Make the request
        req.send();
    });
}

function getJSON(url) {
    return get(url).then(JSON.parse);
}

let main = document.getElementsByTagName("main")[0];

getJSON('news/news.json').then(function(news) {

    //return getJSON('news/' + filename);
    let newsResult = [];
    for(let i = 0; i < news.length; i++) {
        let filename = Object.values(news[i])[0];
        console.log(filename);
        newsResult.push(getJSON('news/' + filename))
    }


    return newsResult;

}).then(function(news) {
    //console.log("Got news 1!", news);
    for(let i = 0; i < news.length; i++) {
        news[i].then(function (neww) {
            console.log("Got neww!", neww);

            let art = document.createElement("article");
            let h1 = document.createElement("h2");
            let para = document.createElement("p");
            let nodePara = document.createTextNode(neww.text);
            let nodeH1 = document.createTextNode(neww.title);
            para.appendChild(nodePara);
            para.classList.add("content");
            h1.appendChild(nodeH1);
            h1.classList.add("text-center");
            art.appendChild(h1);
            art.appendChild(para);
            art.id = neww.id;
            art.style['margin-bottom'] = "0.5em";
            main.appendChild(art);

            let deleteButt = document.createElement("button");
            let deleteText = document.createTextNode("Delete");
            deleteButt.appendChild(deleteText);
            let expiredButt = document.createElement("button");
            let expiredText = document.createTextNode("Expire");
            expiredButt.appendChild(expiredText);
            expiredButt.onclick = function expireArticle() {

                document.getElementById(neww.id).style["background-color"]="#F00";
                expiredButt.remove();
            };
            deleteButt.onclick = function deleteArticle() {
                document.getElementById(neww.id).remove();
                deleteButt.remove();
                expiredButt.remove();
                alert("deleted " + neww.id);
            };
            deleteButt.style["margin-right"] = "1em";
            deleteButt.style['margin-bottom'] = "1em";

            main.appendChild(deleteButt);
            main.appendChild(expiredButt);

        });
    }
});

