const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();

app.use(express.static(__dirname + "/public"));
const urlEncodedParser = bodyParser.urlencoded({ extended: false });
// ================= Styles =================
const containerClass = 'display: flex; flex-direction: column; align-items: center; height: 100vh; padding: 20px; font-family: Arial, sans-serif; font-size: 20px; text-align: center; ';
const box_2Class = 'margin: 10px; width: 60%; border: 1px solid black; justify-content: center; color: #333; align-items: center; background-color: #f8f8f8; border-radius: 5px; box-shadow: 0 0 5px #333; ';
const titleClass = 'font-weight: bold; font-size: 25px; margin: 10px; letter-spacing: 1px; word-spacing: 1px; color: #333; ';
const nameClass = titleClass;
const textClass = 'font-size: 16px; margin: 15px; color: #333; ';
// ================= OOP =================
class Project {
    constructor(title, description, author) {
        this.title = title;
        this.description = description;
        this.author = author;
    }
}
class Author {
    constructor(name, age, description) {
        this.name = name;
        this.age = age;
        this.description = description;
    }
}
// ================= Main page =================
app.get("/", function (request, response) {
    response.sendFile(__dirname + "/public/index.html");
});
// ================= Projects page =================
app.get("/projects", function (request, response) {
    fs.readFile("data.json", "utf-8", function (exception, data) {
        if (exception)
            throw exception;

        const jsonData = JSON.parse(data);

        let elements;
        elements += '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8" /><metaname="viewport" ' +
            'content="width=device-width, initial-scale=1.0" /><title>Authors</title></head><body>' +
            '<h2 style="margin-left: 7.5%; position: fixed"><a href="/">Back</a></h2>' +
            `<div style='${containerClass}'>`;
        for (let i = 0; i < jsonData.length; i++) {
            elements += `<div style='${box_2Class}'>`;
            elements += `<p style='${titleClass}'>${jsonData[i].title}</p>`;
            elements += `<p style='${textClass}'>${jsonData[i].description}</p>`;
            elements += `<p style='${textClass}'>${jsonData[i].author.name}</p>`;
            elements += `<p style='${textClass}'>${jsonData[i].author.age}</p>`;
            elements += `<p style='${textClass}'>${jsonData[i].author.description}</p>`;
            elements += `</div>`;
        }
        elements += '</div></body></html>';
        response.send(elements);
    });
});
// ================= Authors page =================
app.get("/authors", function (request, response) {
    fs.readFile("data.json", "utf-8", function (exception, data) {
        if (exception)
            throw exception;

        const jsonData = JSON.parse(data);

        let elements;
        elements += '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8" /><metaname="viewport" ' +
            'content="width=device-width, initial-scale=1.0" /><title>Authors</title></head><body>' +
            '<h2 style="margin-left: 7.5%; position: fixed"><a href="/">Back</a></h2>' +
            `<div style='${containerClass}'>`;
        for (let i = 0; i < jsonData.length; i++) {
            elements += `<div style='${box_2Class}'>`;
            elements += `<p style='${nameClass}'>${jsonData[i].author.name}</p>`;
            elements += `<p style='${textClass}'>${jsonData[i].author.age}</p>`;
            elements += `<p style='${textClass}'>${jsonData[i].author.description}</p>`;
            elements += `</div>`;
        }
        elements += '</div></body></html>';

        response.send(elements);
    });
});
// ================== Panel page =================
app.get("/panel", function (request, response) {
    response.sendFile(__dirname + "/public/panel.html");
});
app.post('/panel/add', urlEncodedParser, function (request, response) {
    if (!request.body)
        return response.sendStatus(400);

    fs.readFile("data.json", "utf-8", function (exception, data) {
        if (exception)
            throw exception;

        let oldData = JSON.parse(data);

        for (let i = 0; i < oldData.length; i++)
            if (oldData[i].title == request.body.title)
                return response.sendFile(__dirname + "/public/panel.html");

        const author = new Author(request.body.name, request.body.age, request.body.author_description);
        const project = new Project(request.body.title, request.body.project_description, author);

        oldData.push(project);

        const updatedData = JSON.stringify(oldData);

        fs.writeFile("data.json", updatedData, "utf-8", function () { });
    });

    response.sendFile(__dirname + "/public/panel.html");
});
app.post('/panel/update', urlEncodedParser, function (request, response) {
    if (!request.body)
        return response.sendStatus(400);

    fs.readFile("data.json", "utf-8", function (exception, data) {
        if (exception)
            throw exception;

        let oldData = JSON.parse(data);
        for (let i = 0; i < oldData.length; i++) {
            if (oldData[i].title == request.body.searchedTitle && oldData[i].author.name == request.body.searchedName) {
                oldData[i].title = request.body.title;
                oldData[i].description = request.body.project_description;
                oldData[i].author.name = request.body.name;
                oldData[i].author.age = request.body.age;
                oldData[i].author.description = request.body.author_description;
                break;
            }
        }
        const updatedData = JSON.stringify(oldData);

        fs.writeFile("data.json", updatedData, "utf-8", function () { });
    });

    response.sendFile(__dirname + "/public/panel.html");
});
app.post('/panel/delete', urlEncodedParser, function (request, response) {
    if (!request.body)
        return response.sendStatus(400);

    fs.readFile("data.json", "utf-8", function (exception, data) {
        if (exception)
            throw exception;

        let oldData = JSON.parse(data);
        for (let i = 0; i < oldData.length; i++) {
            if (oldData[i].title == request.body.title && oldData[i].author.name == request.body.name) {
                oldData.splice(i, 1);
                break;
            }
        }
        const updatedData = JSON.stringify(oldData);

        fs.writeFile("data.json", updatedData, "utf-8", function () { });
    });

    response.sendFile(__dirname + "/public/panel.html");
});

app.listen(3000);