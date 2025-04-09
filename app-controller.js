console.log('We are inside client.js');

/* On page load */
window.onload = function () {
    const planet_id = document.getElementById("planetID").value;
    console.log("onLoad - Request Planet ID - " + planet_id);

    fetch("/os", { method: "GET" })
        .then(function (res) {
            if (res.ok) {
                return res.json();
            }
            throw new Error('Request failed');
        }).catch(function (error) {
            console.log(error);
        })
        .then(function (data) {
            if (data) {
                document.getElementById('hostname').innerHTML = `Pod - ${data.os}`;
            }
        });
};

const btn = document.getElementById('submit');
if (btn) {
    btn.addEventListener('click', func);
}

function func() {
    const planet_id = document.getElementById("planetID").value;
    console.log("onClick Submit - Request Planet ID - " + planet_id);

    fetch("/planet", {
        method: "POST",
        body: JSON.stringify({ id: planet_id }),
        headers: { "Content-type": "application/json; charset=UTF-8" }
    })
        .then(function (res2) {
            if (!res2.ok) {
                return res2.text().then(msg => { throw new Error(msg); });
            }
            return res2.json();
        })
        .then(function (data) {
            if (data) {
                document.getElementById('planetName').innerHTML = ` ${data.name} `;

                const element = document.getElementById("planetImage");
                const image = ` ${data.image} `;
                element.style.backgroundImage = "url(" + image + ")";

                const planet_description = ` ${data.description} `;
                document.getElementById('planetDescription').innerHTML = planet_description.replace(/(.{80})/g, "$1<br>");
            }
        })
        .catch(function (error) {
            alert("Oops! " + error.message);
            console.log("Detailed error:", error);
        });
}
