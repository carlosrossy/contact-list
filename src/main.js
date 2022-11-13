import userdb, {
    bulkcreate,
    createEle,
    getData
} from "./module.js";

let db = userdb("Userdb", {
    users: `++id, name, phone`
});

const userid = document.getElementById("userId");
const nome = document.getElementById("Name");
const phone = document.getElementById("Phone");

const btncreate = document.getElementById("btnCreate");
const btndeleteAll = document.getElementById("btn-delete-all");

btncreate.onclick = event => {
    let flag = bulkcreate(db.users, {
        nome: nome.value,
        phone: phone.value
    });

    nome.value = phone.value = "";

    getData(db.users, data => {
        userid.value = data.id + 1 || 1;
    });
    table();

    let insertmsg = document.querySelector(".insertmsg");

}

btndeleteAll.onclick = () => {
    db.delete();
    db = userdb("Userdb", {
        users: `++id, nome, phone`
    });
    db.open();
    table();
    textID(userid);
}

window.onload = event => {
    textID(userid);
};

function table() {
    const tbody = document.getElementById("tbody");
    const notfound = document.getElementById("notfound");
    notfound.textContent = "";

    while (tbody.hasChildNodes()) {
        tbody.removeChild(tbody.firstChild);
    }

    getData(db.users, (data, index) => {
        if (data) {
            createEle("tr", tbody, tr => {
                for (const value in data) {
                    createEle("td", tr, td => {
                        td.textContent = data[value] ? `${data[value]}` : data[value];
                    });
                }
                createEle("td", tr, td => {
                    createEle("i", td, i => {
                        i.className += "fas fa-trash-alt btndelete";
                        i.setAttribute(`data-id`, data.id);
                        // store number of edit buttons
                        i.onclick = deletebtn;
                    });
                })
            });
        } else {
            notfound.textContent = "Nenhum registro encontrado no banco de dados...!";
        }

    })
}

const deletebtn = event => {
    let id = parseInt(event.target.dataset.id);
    db.users.delete(id);
    table();
}

function textID(textboxid) {
    getData(db.users, data => {
        textboxid.value = data.id + 1 || 1;
    });
}