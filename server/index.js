const spacesRouter = require("./routes/spaces");
const testimonialsRouter = require("./routes/testimonials");
const embedRouter = require("./routes/embed");

app.use("/api/spaces", spacesRouter);
app.use("/api/testimonials", testimonialsRouter);
app.use("/api/embed", embedRouter);
