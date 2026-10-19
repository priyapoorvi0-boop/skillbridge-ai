
const skillForm = document.getElementById("skill-form");
const formMessage = document.getElementById("form-message");

const PROFILE_STORAGE_KEY = "skillbridge-profile-v1";

function saveProfile(profile) {
  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    return true;
  } catch (error) {
    console.error("Could not save profile:", error);
    return false;
  }
}

function loadProfile() {
  try {
    const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error("Could not load profile:", error);
    return null;
  }
}

function restoreProfileFields() {
  const profile = loadProfile();

  if (!profile) {
    return;
  }

  document.getElementById("candidate-name").value =
    profile.name || "";

  document.getElementById("education").value =
    profile.education || "";

  document.getElementById("skills-input").value =
    profile.skills || "";

  document.getElementById("projects").value =
    profile.projects || "";
}


const jobResults = document.getElementById("job-results");

const jobSearchInput = document.getElementById("job-search-input");
const jobSearchMessage = document.getElementById("job-search-message");

const learningResults = document.getElementById("learning-results");
const passport = document.getElementById("passport-content");

const roles = [
  {
    title: "Frontend Developer Intern",
    skills: ["html", "css", "javascript", "git", "responsive design"],
    description: "Build and improve websites and user interfaces."
  },
  {
    title: "Software Testing Intern",
    skills: ["javascript", "git", "testing", "test cases", "bug reporting"],
    description: "Test software and improve quality."
  },
  {
    title: "Junior Data Analyst Intern",
    skills: [
      "excel",
      "sql",
      "statistics",
      "data visualization",
      "communication"
    ],
    description: "Analyze data and communicate useful findings."
  },
    {
    title: "Embedded Systems Intern",
    description:
      "Work with electronics, microcontrollers, sensors, and embedded C programming.",
    skills: [
      "c",
      "c++",
      "microcontrollers",
      "sensors",
      "embedded systems"
    ]
  },
];

const learningPlans = {
  "responsive design":
    "Practice CSS media queries and build a mobile-friendly webpage.",
  testing:
    "Learn software testing basics and test a simple web form.",
  "test cases":
    "Write test cases for valid, invalid, and empty form inputs.",
  "bug reporting":
    "Document bugs with steps, expected results, and actual results.",
  excel:
    "Practice spreadsheet formulas, sorting, filtering, and charts.",
  sql:
    "Learn SELECT, WHERE, ORDER BY, and GROUP BY queries.",
  statistics:
    "Practice mean, median, percentages, and basic data interpretation.",
  "data visualization":
    "Create charts that explain a small dataset.",
  communication:
    "Practice presenting project results clearly."
};

// Analyze the candidate's profile
skillForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = document
    .getElementById("candidate-name")
    .value.trim();

  const education = document
    .getElementById("education")
    .value.trim();

  const skills = document
    .getElementById("skills-input")
    .value.toLowerCase()
    .split(",")
    .map(skill => skill.trim())
    .filter(Boolean);

  const projects = document
    .getElementById("projects")
    .value.trim();


  if (skills.length === 0) {
    formMessage.textContent = "Please enter at least one skill.";
    return;
  }
  
  // Get career recommendations from the backend
  const backendResults = document.getElementById("backend-results");

  fetch("https://skillbridge-ai-backend-ytfw.onrender.com/api/career-match", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ skills: skills })
  })
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Backend request failed");
      }

      return response.json();
    })
    .then(function (data) {
      backendResults.replaceChildren();

      if (!data.careers || data.careers.length === 0) {
        backendResults.textContent =
          "No backend career recommendations found for these skills.";
        return;
      }

      const list = document.createElement("ul");

      data.careers.forEach(function (career) {
        const item = document.createElement("li");
        item.textContent = career;
        list.appendChild(item);
      });

      backendResults.appendChild(list);
    })
    .catch(function (error) {
      console.error("Backend connection error:", error);
      backendResults.textContent =
        "Backend unavailable. Please check that the server is running.";
    });

  
  const profileSaved = saveProfile({
  name: name,
  education: education,
  skills: document.getElementById("skills-input").value.trim(),
  projects: projects
});
  
if (!profileSaved) {
  formMessage.textContent =
    "Profile analyzed, but it could not be saved to browser storage.";
} else {
  formMessage.textContent =
    "Skill profile created and saved for " +
    (name || "candidate") + ".";
}

  // Create career match cards
  jobResults.replaceChildren();

  roles.forEach(function (role) {
    const matched = role.skills.filter(skill =>
      skills.includes(skill)
    );

    const missing = role.skills.filter(skill =>
      !skills.includes(skill)
    );

    const score = Math.round(
      (matched.length / role.skills.length) * 100
    );

    const card = document.createElement("article");
    card.className = "job-card";

    const title = document.createElement("h3");
    title.textContent = role.title;

    const description = document.createElement("p");
    description.textContent = role.description;

    const match = document.createElement("p");
    match.className = "match-label";
    match.textContent = score + "% sample skill overlap";

    // Progress bar container
    const progress = document.createElement("div");
    progress.className = "skill-progress";
    progress.setAttribute("role", "progressbar");
    progress.setAttribute(
      "aria-label",
      role.title + " skill match"
    );
    progress.setAttribute("aria-valuemin", "0");
    progress.setAttribute("aria-valuemax", "100");
    progress.setAttribute("aria-valuenow", String(score));

    // Colored progress bar
    const progressFill = document.createElement("div");
    progressFill.className = "skill-progress-fill";
    progressFill.style.width = score + "%";

    progress.appendChild(progressFill);

    const matchedText = document.createElement("p");
    matchedText.textContent =
      "Matching skills: " + (matched.join(", ") || "None yet");

    const missingText = document.createElement("p");
    missingText.textContent =
      "Skills to develop: " +
      (missing.join(", ") || "None in this sample");
      
const nextSkillText = document.createElement("p");

nextSkillText.textContent = missing.length
  ? "Recommended next skill: " + missing[0]
  : "Recommended next step: Build an advanced project";


    
card.append(
  title,
  description,
  match,
  progress,
  matchedText,
  missingText,
  nextSkillText
);


    jobResults.appendChild(card);
  });

  // Create personalized learning roadmap
  learningResults.replaceChildren();

  const heading = document.createElement("h3");
  heading.textContent = "Personalized Learning Roadmap";

  const intro = document.createElement("p");
  intro.textContent =
    "Recommended next steps for " + (name || "your profile") + ":";

  const roleSelect = document.createElement("select");
  roleSelect.id = "roadmap-role";

  roles.forEach(function (role) {
    const option = document.createElement("option");
    option.value = role.title;
    option.textContent = role.title;
    roleSelect.appendChild(option);
  });

  const roadmap = document.createElement("div");

  function renderRoadmap() {
    roadmap.replaceChildren();

    const selectedRole = roles.find(
      role => role.title === roleSelect.value
    );

    const missing = selectedRole.skills.filter(
      skill => !skills.includes(skill)
    );

    const nextSkills = missing.length
      ? missing
      : ["Build a more advanced project"];

    const list = document.createElement("ol");

    nextSkills.forEach(function (skill) {
      const item = document.createElement("li");

      item.textContent =
        skill +
        ": " +
        (learningPlans[skill] ||
          "Build a project demonstrating this skill.");

      list.appendChild(item);
    });

    roadmap.appendChild(list);
  }

  roleSelect.addEventListener("change", renderRoadmap);

  const evidence = document.createElement("p");
  evidence.textContent = projects
    ? "Project evidence: " + projects
    : "Add projects to demonstrate your practical experience.";

  learningResults.append(
    heading,
    intro,
    roleSelect,
    roadmap,
    evidence
  );

  // Create Skill Passport
  passport.replaceChildren();

  const passportTitle = document.createElement("h3");
  passportTitle.textContent = name || "Candidate";

  const educationText = document.createElement("p");
  educationText.textContent =
    "Education: " + (education || "Not provided");

  const skillsText = document.createElement("p");
  skillsText.textContent = "Skills: " + skills.join(", ");

  const projectsText = document.createElement("p");
  projectsText.textContent =
    "Projects: " + (projects || "Not provided");

  const bestRole = [...roles].sort(function (a, b) {
    const scoreA =
      a.skills.filter(skill => skills.includes(skill)).length /
      a.skills.length;

    const scoreB =
      b.skills.filter(skill => skills.includes(skill)).length /
      b.skills.length;

    return scoreB - scoreA;
  })[0];

  const bestScore = Math.round(
    (bestRole.skills.filter(skill => skills.includes(skill)).length /
      bestRole.skills.length) *
      100
  );

  const bestMatchText = document.createElement("p");
  bestMatchText.textContent =
    "Best sample role: " +
    bestRole.title +
    " (" +
    bestScore +
    "% sample skill overlap)";

  passport.append(
    passportTitle,
    educationText,
    skillsText,
    projectsText,
    bestMatchText
  );

  renderRoadmap();
});

// Download Skill Passport as a text file
const downloadButton = document.getElementById("download-passport");

if (downloadButton) {
  downloadButton.addEventListener("click", function () {
    if (!passport || !passport.querySelector("h3")) {
      alert("Please analyze your profile first.");
      return;
    }

    const content = Array.from(
      passport.querySelectorAll("h3, p")
    )
      .map(element => element.textContent)
      .join("\n");

    const file = new Blob([content], {
      type: "text/plain;charset=utf-8"
    });

    const url = URL.createObjectURL(file);
    const link = document.createElement("a");

    link.href = url;
    link.download = "SkillBridge-Skill-Passport.txt";

    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 1000);
  });
}

const pdfButton = document.getElementById("download-passport-pdf");

if (pdfButton) {
  pdfButton.addEventListener("click", function () {
    if (!passport || !passport.querySelector("h3")) {
      alert("Please analyze your profile first.");
      return;
    }

    window.print();
  });
}

if (jobSearchInput && jobSearchMessage) {
  jobSearchInput.addEventListener("input", function () {
    const query = jobSearchInput.value.trim().toLowerCase();
    const cards = jobResults.querySelectorAll(".job-card");
    let visibleCount = 0;

    cards.forEach(function (card) {
      const cardText = card.textContent.toLowerCase();
      const matches = cardText.includes(query);

      card.hidden = !matches;

      if (matches) {
        visibleCount++;
      }
    });

    if (cards.length === 0) {
      jobSearchMessage.textContent =
        "Analyze your profile first to see career matches.";
    } else if (visibleCount === 0) {
      jobSearchMessage.textContent =
        "No career matches found. Try another job title or skill.";
    } else {
      jobSearchMessage.textContent =
        visibleCount + " career match(es) found.";
    }
  });
}

restoreProfileFields();

const savedProfile = loadProfile();

if (savedProfile && savedProfile.skills) {
  skillForm.requestSubmit();
}


const clearProfileButton =
  document.getElementById("clear-profile");

clearProfileButton.addEventListener("click", function () {
  const confirmed = window.confirm(
    "Are you sure you want to clear your saved profile?"
  );

  if (!confirmed) {
    return;
  }

  localStorage.removeItem("skillbridge-profile-v1");

  document.getElementById("candidate-name").value = "";
  document.getElementById("education").value = "";
  document.getElementById("skills-input").value = "";
  document.getElementById("projects").value = "";
  
jobResults.replaceChildren();
learningResults.replaceChildren();
passport.replaceChildren();

formMessage.textContent = "Saved profile and results cleared.";


  document.getElementById("form-message").textContent =
    "Saved profile cleared.";
});


