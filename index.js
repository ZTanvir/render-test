const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());

const requestData = (request, response, next) => {
  next();
};
const noRouteMsg = (request, response, next) => {
  response.status(404).json({ error: "No route found" });
};
app.use(requestData);
let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true,
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
];

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

app.get("/api/notes", (req, res) => {
  res.json(notes);
});

const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
  return maxId + 1;
};

app.post("/api/notes", (request, response) => {
  const body = request.body;

  if (!body.content) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const note = {
    content: body.content,
    important: body.important || false,
    date: request.requestTime,
    id: generateId(),
  };

  notes = notes.concat(note);

  response.json(note);
});

app.get("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  const note = notes.find((note) => note.id === id);

  if (note) {
    response.json(note);
  } else {
    response.status(404).end();
  }

  response.json(note);
});

app.delete("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter((note) => note.id !== id);

  response.status(204).end();
});
app.put("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  const body = request.body;
  if (!body.content) {
    return response.status(404).json({
      error: "content missing",
    });
  }
  const note = notes.find((note) => note.id === id);
  const updateNoteImportant = { ...note, important: body.important };
  notes = notes.map((note) =>
    note.id === updateNoteImportant.id ? updateNoteImportant : note
  );
  response.json(updateNoteImportant);
});
app.patch("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  const body = request.body;
  if (!body.content) {
    return response.status(404).json({
      error: "content missing",
    });
  }
  const note = notes.find((note) => note.id === id);
  const updateNoteImportant = { ...note, content: body.content };
  notes = notes.map((note) =>
    note.id === updateNoteImportant.id ? updateNoteImportant : note
  );
  response.json(updateNoteImportant);
});

app.use(noRouteMsg);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
