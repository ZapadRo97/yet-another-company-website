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

            if(neww.expired){
                art.style["background-color"]="#F00";
            } else {
                art.style["background-color"]=null;
            }

            main.appendChild(art);

            let deleteButt = document.createElement("button");
            let deleteText = document.createTextNode("Delete");
            deleteButt.appendChild(deleteText);
            let expiredButt = document.createElement("button");
            let expiredText = document.createTextNode("Expire");
            expiredButt.appendChild(expiredText);
            expiredButt.onclick = function expireArticle() {
                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function() {
                    if (this.readyState === 4 && this.status === 200) {
                        if(this.responseText === "EXPIRED") {
                            document.getElementById(neww.id).style["background-color"]="#F00";
                        }

                        if(this.responseText === "NOT_EXPIRED") {
                            document.getElementById(neww.id).style["background-color"]=null;
                        }

                    }
                };
                xhttp.open("PUT", "requests.php", true);
                xhttp.setRequestHeader("Content-type", "text/plain");
                xhttp.send(neww.id);
                //document.getElementById(neww.id).style["background-color"]="#F00";
                //expiredButt.remove();
            };
            deleteButt.onclick = function deleteArticle() {

                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function() {
                    if (this.readyState === 4 && this.status === 200) {
                        if(this.responseText === "DELETED") {
                            document.getElementById(neww.id).remove();
                            deleteButt.remove();
                            expiredButt.remove();
                            alert("deleted " + neww.id);
                        }
                    }
                };
                xhttp.open("DELETE", "requests.php", true);
                xhttp.setRequestHeader("Content-type", "text/plain");
                xhttp.send(neww.id);

            };
            deleteButt.style["margin-right"] = "1em";
            deleteButt.style['margin-bottom'] = "1em";

            main.appendChild(deleteButt);
            main.appendChild(expiredButt);

        });
    }
});

function showForm() {

    let elementStyle = document.getElementById("new_form").style["display"];
    if(elementStyle === "block" )
        document.getElementById("new_form").style["display"] = "none";
    else
        document.getElementById("new_form").style["display"] = "block";
}


function onFormSubmit() {

    let id = document.querySelector("input[name='id']").value;
    let file = document.querySelector("input[name='file']").value;
    let title = document.querySelector("input[name='title']").value;
    //let text = document.querySelector("input[name='text']").value;
    let text = document.getElementById("text_area").value;

    let data = {"file": file + ".json",
    "data":{"id": id, "title":title, "text": text, "expired":false}};


    let req = new XMLHttpRequest();
    req.open("POST", "add_news.php", true);
    req.setRequestHeader("Content-type", "application/json");
    req.send(JSON.stringify(data));

    alert("News added");

    return true;
}