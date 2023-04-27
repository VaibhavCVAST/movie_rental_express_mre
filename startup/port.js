function startServer(app) {
  if (process.env.NODE_ENV !== "test") {
    const PORT = process.env.PORT || 3000;//This line checks if the NODE_ENV environment variable is not set to "test". This is a common practice to prevent the server from starting during unit tests or when running in a testing environment.
    app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
  }
}

module.exports = startServer ;