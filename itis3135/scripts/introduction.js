const DEFAULT_IMAGE = "images/me-in-brazil.jpg";

const DEFAULT_COURSES = [
    {
        department: "ITIS",
        courseNumber: "3200",
        courseTitle: "Intro to info security & Priv",
        reasonForTaking: "This is a class requirement but i always had a big interest in how security in computers works."
    },
    {
        department: "ITIS",
        courseNumber: "3130",
        courseTitle: "Human-Centered Computing",
        reasonForTaking: "Course requirement"
    },
    {
        department: "ITSC",
        courseNumber: "2600",
        courseTitle: "CS Program, Identity, Career",
        reasonForTaking: "Course requirement"
    },
    {
        department: "STAT",
        courseNumber: "1220",
        courseTitle: "Elements of stat",
        reasonForTaking: "Course requirement"
    },
    {
        department: "ITIS",
        courseNumber: "3135",
        courseTitle: "Front-End Web App Development",
        reasonForTaking: "This is a very interesting class for me. I am excited to understand a bit more how websites work because we interact with them everyday."
    }
];

const formElement = document.getElementById("form");
const courseList = document.getElementById("course-list");
const preview = document.getElementById("picture-preview");
const uploadInput = document.getElementById("picture-upload");

// Holds an uploaded picture; null means "use the default image".
let uploadedImage = null;

/* ---------- Helpers ---------- */

function esc(text) {
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function clean(text) {
    return String(text).replace(/\s+/g, " ").trim();
}

/* ---------- Course rows ---------- */

function addCourse(course) {
    const c = course || { department: "", courseNumber: "", courseTitle: "", reasonForTaking: "" };
    const row = document.createElement("div");
    row.className = "course-row form-group";
    row.innerHTML =
        '<input type="text" class="course-department" placeholder="Department (e.g. ITIS)" aria-label="Department" value="' + esc(c.department) + '" required>' +
        '<input type="text" class="course-number" placeholder="Number (e.g. 3135)" aria-label="Course number" value="' + esc(c.courseNumber) + '" required>' +
        '<input type="text" class="course-title" placeholder="Course name" aria-label="Course name" value="' + esc(c.courseTitle) + '" required>' +
        '<input type="text" class="course-reason" placeholder="Reason for taking" aria-label="Reason for taking" value="' + esc(c.reasonForTaking) + '" required>' +
        '<button type="button" class="delete-course">Delete</button>';
    courseList.appendChild(row);
}

function loadDefaultCourses() {
    courseList.innerHTML = "";
    DEFAULT_COURSES.forEach(addCourse);
}

courseList.addEventListener("click", function (event) {
    if (event.target.classList.contains("delete-course")) {
        event.target.closest(".course-row").remove();
    }
});

document.getElementById("add-course").addEventListener("click", function () {
    addCourse();
    courseList.lastElementChild.querySelector("input").focus();
});

/* ---------- Picture upload ---------- */

uploadInput.addEventListener("change", function () {
    const file = uploadInput.files[0];
    if (!file) {
        uploadedImage = null;
        preview.src = DEFAULT_IMAGE;
        return;
    }
    const reader = new FileReader();
    reader.addEventListener("load", function () {
        uploadedImage = { dataUrl: reader.result, name: file.name };
        preview.src = reader.result;
    });
    reader.readAsDataURL(file);
});

/* ---------- Reset and Clear ---------- */

formElement.addEventListener("reset", function () {
    uploadedImage = null;
    preview.src = DEFAULT_IMAGE;
    loadDefaultCourses();
});

document.getElementById("clear-button").addEventListener("click", function () {
    formElement.querySelectorAll("input, textarea").forEach(function (field) {
        if (field.type === "file") {
            field.value = "";
        } else {
            field.value = "";
            field.setCustomValidity("");
        }
    });
    uploadedImage = null;
    preview.src = DEFAULT_IMAGE;
});

/* ---------- Gather data ---------- */

function gather(forOutput) {
    const f = formElement.elements;
    const get = function (name) { return clean(f[name].value); };

    let img = DEFAULT_IMAGE;
    if (uploadedImage) {
        img = forOutput ? "images/" + uploadedImage.name : uploadedImage.dataUrl;
    }

    const courses = Array.from(courseList.querySelectorAll(".course-row")).map(function (row) {
        return {
            department: clean(row.querySelector(".course-department").value),
            courseNumber: clean(row.querySelector(".course-number").value),
            courseTitle: clean(row.querySelector(".course-title").value),
            reasonForTaking: clean(row.querySelector(".course-reason").value)
        };
    });

    const footerLinks = [];
    for (let i = 1; i <= 6; i++) {
        footerLinks.push({ label: get("linkLabel" + i), url: get("linkUrl" + i) });
    }

    return {
        firstName: get("firstName"),
        middleName: get("middleName"),
        nickname: get("nickname"),
        lastName: get("lastName"),
        acknowledgment: get("acknowledgment"),
        acknowledgmentDate: get("acknowledgmentDate"),
        prettyNameDivider: get("prettyNameDivider"),
        adjectives: get("adjectives"),
        animal: get("animal"),
        img: img,
        pictureAlt: get("pictureAlt"),
        caption: get("caption"),
        personalInfo: {
            statement: get("statement"),
            personalBackground: get("personalBackground"),
            professionalBackground: get("professionalBackground"),
            academicBackground: get("academicBackground"),
            primaryWorkComputer: get("primaryWorkComputer"),
            primaryWorkLocation: get("primaryWorkLocation"),
            alternateComputerLocation: get("alternateComputerLocation")
        },
        courses: courses,
        quote: get("quote"),
        quoteAuthor: get("quoteAuthor"),
        funnyItem: get("funnyItem"),
        somethingToShare: get("somethingToShare"),
        footerLinks: footerLinks
    };
}

/* ---------- Build the introduction markup (matches introduction.html) ---------- */

function buildMainHtml(d, h2Text) {
    const middle = d.middleName ? " " + d.middleName : "";
    const nick = d.nickname ? " '" + d.nickname + "'" : "";
    const heading = d.firstName + middle + nick + " " + d.lastName + " " +
        d.prettyNameDivider + " " + d.adjectives + " " + d.animal;
    const p = d.personalInfo;

    const courseItems = d.courses.map(function (c) {
        return "                <li>" + esc(c.department + c.courseNumber + " - " + c.courseTitle + ": " + c.reasonForTaking) + "</li>";
    }).join("\n");

    let extras = "";
    if (d.funnyItem) {
        extras += "\n        <p>Funny thing: " + esc(d.funnyItem) + "</p>\n";
    }
    if (d.somethingToShare) {
        extras += "\n        <p>Something I would like to share: " + esc(d.somethingToShare) + "</p>\n";
    }

    return [
        "<main>",
        "",
        "    <h2>" + esc(h2Text) + "</h2>",
        "",
        "    <h6>" + esc(heading) + "</h6>",
        "",
        "    <figure>",
        '            <img src="' + esc(d.img) + '" alt="' + esc(d.pictureAlt) + '">',
        "            <figcaption>" + esc(d.caption) + "</figcaption>",
        "    </figure>",
        "",
        "    <p>" + esc(p.statement) + "</p>",
        "",
        "    <ul>",
        "        <li>Personal Background: " + esc(p.personalBackground) + "</li>",
        "        <li>Professional Background: " + esc(p.professionalBackground) + "</li>",
        "        <li>Academic Background: " + esc(p.academicBackground) + "</li>",
        "        <li>Primary Work Computer (type, OS, and version):" + esc(p.primaryWorkComputer) + "</li>",
        "        <li>Primary Work Location: " + esc(p.primaryWorkLocation) + "</li>",
        "        <li>Alternate Computer &amp; Location: " + esc(p.alternateComputerLocation) + "</li>",
        "        <li>Courses I'm Taking, &amp; Why:",
        "            <ol>",
        courseItems,
        "            </ol>",
        "        </li>",
        "    </ul>",
        "",
        "        <blockquote>",
        "            " + esc(d.quote),
        "        </blockquote>",
        "",
        "        <p>",
        "            - " + esc(d.quoteAuthor),
        "        </p>" + extras,
        "</main>"
    ].join("\n");
}

function buildFooterHtml(d) {
    const links = d.footerLinks.map(function (l) {
        return '        <a href="' + esc(l.url) + '">' + esc(l.label) + "</a>";
    }).join(" |\n");

    return [
        "<footer>",
        "    <nav>",
        links,
        "    </nav>",
        "",
        "    <p>Certified in HTML and CSS by freeCodeCamp</p>",
        "",
        "    <p>",
        '        <a href="michaelmerinodesigns.com/index.html">',
        "            Designed by Michael Merino 2026 </a> | Certified in ",
        '            <a href="https://www.freecodecamp.org/certification/mmerino4/responsive-web-design-v9">Responsive Web Design</a>',
        "    </p>",
        "</footer>"
    ].join("\n");
}

function h2For(d) {
    return d.firstName + " " + d.lastName + ": Introduction Form";
}

/* ---------- Validation and Submit ---------- */

function validateForm() {
    // Required fields must hold more than whitespace.
    formElement.querySelectorAll("[required]").forEach(function (field) {
        field.setCustomValidity(field.value.trim() === "" ? "Please fill out this field." : "");
    });

    if (courseList.children.length === 0) {
        alert("Please add at least one course.");
        return false;
    }

    if (!formElement.checkValidity()) {
        formElement.reportValidity();
        return false;
    }
    return true;
}

// Clears the custom whitespace error as soon as the user edits a field.
formElement.addEventListener("input", function (event) {
    if (event.target.setCustomValidity) {
        event.target.setCustomValidity("");
    }
});

formElement.addEventListener("submit", function (event) {
    event.preventDefault(); // prevents page refresh / default behavior

    if (!validateForm()) {
        return;
    }

    const d = gather(false);

    document.title = d.firstName + " " + d.lastName + "'s " + d.adjectives + " " + d.animal +
        " | ITIS3135 | " + h2For(d);

    document.querySelector("main").outerHTML = buildMainHtml(d, h2For(d));
    document.getElementById("footer-slot").innerHTML = buildFooterHtml(d);

    const startOver = document.getElementById("start-over");
    startOver.hidden = false;
    startOver.style.textAlign = "center";
    startOver.innerHTML = '<p><a href="introduction_form.html">Reset the form and start over</a></p>';

    window.scrollTo(0, 0);
});

/* ---------- Part 2: Generate HTML / JSON / XML ---------- */

function toXml(d) {
    const x = function (text) { return esc(text).replace(/'/g, "&apos;"); };
    const tag = function (name, value, indent) {
        return " ".repeat(indent) + "<" + name + ">" + x(value) + "</" + name + ">";
    };
    const p = d.personalInfo;

    const lines = ['<?xml version="1.0" encoding="UTF-8"?>', "<introduction>"];
    ["firstName", "middleName", "nickname", "lastName", "acknowledgment", "acknowledgmentDate",
        "prettyNameDivider", "adjectives", "animal", "img", "pictureAlt", "caption"].forEach(function (k) {
        lines.push(tag(k, d[k], 2));
    });

    lines.push("  <personalInfo>");
    Object.keys(p).forEach(function (k) { lines.push(tag(k, p[k], 4)); });
    lines.push("  </personalInfo>");

    lines.push("  <courses>");
    d.courses.forEach(function (c) {
        lines.push("    <course>");
        Object.keys(c).forEach(function (k) { lines.push(tag(k, c[k], 6)); });
        lines.push("    </course>");
    });
    lines.push("  </courses>");

    ["quote", "quoteAuthor", "funnyItem", "somethingToShare"].forEach(function (k) {
        lines.push(tag(k, d[k], 2));
    });

    lines.push("  <footerLinks>");
    d.footerLinks.forEach(function (l) {
        lines.push("    <link>");
        lines.push(tag("label", l.label, 6));
        lines.push(tag("url", l.url, 6));
        lines.push("    </link>");
    });
    lines.push("  </footerLinks>");
    lines.push("</introduction>");
    return lines.join("\n");
}

function showOutput(id, title, text) {
    const area = document.getElementById("output-area");
    let box = document.getElementById("output-" + id);
    if (!box) {
        const wrap = document.createElement("div");
        wrap.className = "form-group";
        wrap.innerHTML = '<h3>' + title + '</h3><textarea id="output-' + id + '" rows="20" aria-label="' + title + '"></textarea>';
        area.appendChild(wrap);
        box = wrap.querySelector("textarea");
    }
    box.value = text;
    box.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

document.getElementById("generate-html").addEventListener("click", function () {
    const d = gather(true);
    const html = buildMainHtml(d, h2For(d)) + "\n\n<hr>\n\n" + buildFooterHtml(d);
    showOutput("html", "HTML Output", html);
});

document.getElementById("generate-json").addEventListener("click", function () {
    showOutput("json", "JSON Output", JSON.stringify(gather(true), null, 2));
});

document.getElementById("generate-xml").addEventListener("click", function () {
    showOutput("xml", "XML Output", toXml(gather(true)));
});

/* ---------- Start ---------- */

loadDefaultCourses();