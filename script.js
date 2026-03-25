// ---------- STORAGE ----------
let users = JSON.parse(localStorage.getItem("users")) || [];
let results = JSON.parse(localStorage.getItem("results")) || {};
let adminQ = JSON.parse(localStorage.getItem("adminQ")) || [];
let adminData = JSON.parse(localStorage.getItem("adminData")) || null;
let currentUser = "";

// ---------- BASE QUESTIONS ----------
let base = [
    {q:"CPU full form?",c:"Central Processing Unit",o:["Control","Central Processing Unit","Unit","Core"]},
    {q:"FIFO?",c:"Queue",o:["Stack","Queue","Tree","Graph"]},
    {q:"RAM?",c:"Volatile",o:["Permanent","Volatile","External","Cache"]},
    {q:"HTML used for?",c:"Structure",o:["Style","Logic","Structure","DB"]},
    {q:"JS is?",c:"Programming",o:["Markup","Programming","Style","DB"]}
];

// ---------- STUDENT REGISTER ----------
function register(){
    let u = ruser.value.trim();
    let p = rpass.value.trim();
    if(!u||!p) return alert("Fill fields");
    if(users.find(x=>x.u===u)) return alert("User exists");
    users.push({u,p:btoa(p)});
    localStorage.setItem("users",JSON.stringify(users));
    alert("Account created");
    show("studentLogin");
}

// ---------- STUDENT LOGIN ----------
function login(){
    let u = luser.value.trim();
    let p = lpass.value.trim();
    let user = users.find(x=>x.u===u && atob(x.p)===p);
    if(user){ currentUser = u; userDisplay.innerText = u; show("student"); }
    else alert("Invalid login");
}

// ---------- ADMIN CREATE ----------
function createAdmin(){
    let u = newAdminUser.value.trim();
    let p = newAdminPass.value.trim();
    if(!u||!p) return alert("Fill fields");
    adminData = {u, p:btoa(p)};
    localStorage.setItem("adminData", JSON.stringify(adminData));
    alert("Admin created");
    show("adminLogin");
}

// ---------- ADMIN LOGIN ----------
function adminLogin(){
    let u = auser.value.trim();
    let p = apass.value.trim();
    if(!adminData) return alert("Create admin first");
    if(u===adminData.u && atob(adminData.p)===p){ show("admin"); }
    else alert("Invalid admin login");
}

// ---------- QUIZ ----------
let questions=[],i=0,score=0,sel=null;

function startQuiz(){
    let all = base.concat(adminQ);
    all.sort(()=>Math.random()-0.5);
    questions = all.slice(0,5);
    i=0; score=0; show("quiz"); load();
}

function load(){
    if(i>=questions.length) return end();
    sel = null;
    question.innerText = questions[i].q;
    options.innerHTML = "";
    questions[i].o.sort(()=>Math.random()-0.5).forEach(op=>{
        let li = document.createElement("li");
        li.innerText = op;
        li.onclick = ()=>{
            sel = op;
            document.querySelectorAll("#options li").forEach(x=>x.style.background="#334155");
            li.style.background="#22c55e";
        };
        options.appendChild(li);
    });
}

function next(){
    if(!sel) return alert("Select answer");
    if(sel===questions[i].c) score+=10;
    i++; load();
}

function end(){
    show("result");
    scoreSpan = document.getElementById("score");
    scoreSpan.innerText = score;
    if(!results[currentUser]) results[currentUser] = [];
    results[currentUser].push(score);
    localStorage.setItem("results", JSON.stringify(results));
}

// ---------- ADMIN ADD QUESTION ----------
function addQ(){
    let questionText = q.value.trim();
    let correct = c.value.trim();
    let wrongA = w1.value.trim();
    let wrongB = w2.value.trim();
    let wrongC = w3.value.trim();
    if(!questionText || !correct || !wrongA || !wrongB || !wrongC) return alert("Fill all fields");
    let optionsArr = [correct, wrongA, wrongB, wrongC];
    if(new Set(optionsArr).size < 4) return alert("All options must be different");
    adminQ.push({q:questionText, c:correct, o:optionsArr});
    localStorage.setItem("adminQ", JSON.stringify(adminQ));
    alert("Question Added");
    q.value=""; c.value=""; w1.value=""; w2.value=""; w3.value="";
}

// ---------- USER RESULTS ----------
function showResults(){
    show("userResults");
    let r = results[currentUser] || [];
    myRes.innerHTML = r.length ? r.map((x,i)=>`<li>Attempt ${i+1}: ${x}</li>`).join("") : "<li>No attempts</li>";
}

// ---------- ADMIN RESULTS ----------
function viewAll(){
    show("allResults");
    let html = "";
    for(let u in results){ html+=`<li>${u}: ${results[u].join(", ")}</li>`; }
    allRes.innerHTML = html || "<li>No data</li>";
}

// ---------- NAVIGATION ----------
function show(id){
    ["main","studentLogin","register","adminLogin","adminRegister","student","admin","quiz","result","userResults","allResults"]
    .forEach(x=>document.getElementById(x).classList.add("hidden"));
    document.getElementById(id).classList.remove("hidden");
}

function back(){ show("student"); }
function backAdmin(){ show("admin"); }
function logout(){ currentUser=""; show("main"); }
function backMain(){ show("main"); }