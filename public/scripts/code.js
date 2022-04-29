var app = new Vue({
    el: '#app',
    data: {
        venues: [],
        bills: [],
        bill: {},
        venue: {},
        gigbutton: "",
        loginstatus: false,

    },

    created: function () {
        this.calljson();
    },

    methods: {

        calljson: function () {
            fetch("https://tibbz.github.io/Data/churchofcat.geojson", {
                method: "GET",

            }).then(function (response) {
                if (response.ok) {
                    return response.json();
                }

            }).then(function (json) {

                app.venues = json.venues;
                app.bills = json.bills;

                //                console.log(app.venues);
                //                console.log(app.bills);

            }).catch(function (error) {
                console.log("Request failed: + error.message");
            })
        },

        showcalendar: function () {
            var index = document.getElementById("indexid");
            var general1 = document.getElementById("generalid");
            index.style.display = "none";
            general1.style.display = "block";
            var bills = document.getElementById("notvariable2");
            var venue = document.getElementById("notvariable1");
            bills.style.display = "none";
            venue.style.display = "none";
            var chat = document.getElementById("chatroom");
            chat.style.display = "none";
        },

        showvenues: function () {
            var index = document.getElementById("indexid");
            var general = document.getElementById("generalid2");
            var general1 = document.getElementById("generalid");
            index.style.display = "none";
            general.style.display = "block";
            general1.style.display = "none";
            var bills = document.getElementById("notvariable2");
            var venue = document.getElementById("notvariable1");
            bills.style.display = "none";
            venue.style.display = "none";
            var chat = document.getElementById("chatroom");
            chat.style.display = "none";

        },

        showindex: function () {
            var index = document.getElementById("indexid");
            var general = document.getElementById("generalid2");
            var general1 = document.getElementById("generalid");
            var bills = document.getElementById("notvariable2");
            var venue = document.getElementById("notvariable1");
            var chat = document.getElementById("chatroom");
            bills.style.display = "none";
            venue.style.display = "none";
            index.style.display = "flex";
            general.style.display = "none";
            general1.style.display = "none";
            chat.style.display = "none";
        },

        showbill: function () {
            var general1 = document.getElementById("generalid");
            var bills = document.getElementById("notvariable2");
            general1.style.display = "none";
            bills.style.display = "block";
            this.bill = this.bills[event.target.getAttribute("data-id")];
            var chat = document.getElementById("chatroom");
            chat.style.display = "none";
        },

        showvenue: function () {
            var general = document.getElementById("generalid2");
            var venues = document.getElementById("notvariable1");
            general.style.display = "none";
            venues.style.display = "block";
            this.venue = this.venues[event.target.getAttribute("data-id")];
            var chat = document.getElementById("chatroom");
            chat.style.display = "none";
        },

        callinput: function () {
            var flag = false;
            this.gigbutton = document.getElementById("gigsearch").value;
            this.gigfilter = Array.from(document.getElementsByClassName("gigs"));
            var contador = 0;

            for (var b = 0; b < this.gigfilter.length; b++) {

                if (this.gigfilter[b].innerHTML.toUpperCase().includes(this.gigbutton.toUpperCase()) || this.gigfilter[b].getAttribute("data-venue").toUpperCase().includes(this.gigbutton.toUpperCase()) || this.gigfilter[b].getAttribute("data-price").toUpperCase().includes(this.gigbutton.toUpperCase())) {
                    this.gigfilter[b].style.display = "flex";
                    flag = true;

                } else {
                    this.gigfilter[b].style.display = "none";
                    contador = contador + 1;
                }
                if (contador === this.gigfilter.length) {
                    alert("no gigs found by search criteria");
                }
            }
        },

        login: function () {

            var provider = new firebase.auth.GoogleAuthProvider();

            firebase.auth().signInWithPopup(provider)
                .then(function () {
                    app.loginstatus = true;
                    app.getPosts();

                })
                .catch(function () {
                    alert("Something went wrong");
                });
        },

        logout: function () {

            firebase.auth().signOut().then(function () {
                app.loginstatus = false;

            }).catch(function (error) {

            });
        },

        showchat: function () {
            var index = document.getElementById("indexid");
            var general = document.getElementById("generalid2");
            var general1 = document.getElementById("generalid");
            var bills = document.getElementById("notvariable2");
            var venue = document.getElementById("notvariable1");
            var chat = document.getElementById("chatroom");
            bills.style.display = "none";
            venue.style.display = "none";
            index.style.display = "none";
            general.style.display = "none";
            general1.style.display = "none";
            chat.style.display = "flex";
        },

        chattext: function () {
            var input = document.getElementById("chat");
            var message = input.value;
            var username = firebase.auth().currentUser.displayName;

            var date = new Date;
            var year = date.getFullYear();
            var month = date.getMonth();
            var months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'Jully', 'August', 'September', 'October', 'November', 'December');
            var d = date.getDate();
            var day = date.getDay();
            var days = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
            var h = date.getHours();
            if (h < 10) {
                h = "0" + h;
            }
            m = date.getMinutes();
            if (m < 10) {
                m = "0" + m;
            }
            s = date.getSeconds();
            if (s < 10) {
                s = "0" + s;
            }
            var result = '' + days[day] + ' ' + d + ' ' + months[month] + ' ' + year + ' ' + h + ':' + m;

            var post = {
                date: result,
                name: username,
                body: message
            };
            
            var newPostKey = firebase.database().ref().child("chatz").push().key;
            var updates = {};
            updates[newPostKey] = post;
            document.getElementById("chat").value = " ";

            return firebase.database().ref("chatz").update(updates);

        },

        textandscroll: function () {
            this.chattext();
            this.scrollbot();

        },

        scrollbot: function () {

            setTimeout(function () {
                var container = document.getElementById("chatbody");

                container.scrollTop = container.scrollHeight;
            }, 1000);
        },

        getPosts: function () {

            firebase.database().ref("chatz").on("value", function (data) {
                var div = document.getElementById("chatmessages");
                div.scrollTop = div.scrollHeight;
                div.innerHTML = "";
                var messages = data.val();

                for (var key in messages) {
                    var text = document.createElement("p");
                    var usernow = firebase.auth().currentUser.displayName;
                    var element = messages[key];
                    var logospace = document.getElementById("personalim");
                    logospace.src = firebase.auth().currentUser.photoURL;

                    if (element.name == usernow) {
                        text.classList.add("me")
                    } else {
                        text.classList.add("guest")
                    }

                    var allmessage = element.date + "<br>" + element.name + ":" + "<br>" + element.body;
                    
                    text.innerHTML = allmessage;
                    div.append(text);
                }

                app.scrollbot();
            })

        }

    }
})
