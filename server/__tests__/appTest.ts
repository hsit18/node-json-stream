import request from "supertest";

describe("GET /top - get all top posts", () => {
  it("Top posts API Request", async () => {
    const result = await request("http://localhost:3001")
      .get("/top")
      .set("Accept", "application/json");
    expect(result.statusCode).toEqual(200);
    expect(result.body.length).toEqual(10);
    expect(result.body[0].uuid).toEqual("e94078e9-4e58-496f-90b1-ffd7099518dd");
    expect(result.body[0].author).toEqual("Deb Bierce");
    expect(result.body[0].content).toEqual(
      "The teaching transcribes the stormy news."
    );
    expect(result.body[0].comments.length).toEqual(1);

    expect(result.body[0].votes).toEqual(166);
  });
});

describe("GET /upVote - increment votes to post", () => {
  it("upvote API Request", async () => {
    const response = await request("http://localhost:3001")
      .post("/upvote/e94078e9-4e58-496f-90b1-ffd7099518dd")
      .set("Accept", "application/json");

    expect(response.body).toEqual("votes incremented successfully.");

    const result = await request("http://localhost:3001")
      .get("/top")
      .set("Accept", "application/json");
    expect(result.statusCode).toEqual(200);
    expect(result.body.length).toEqual(10);
    expect(result.body[0].uuid).toEqual("e94078e9-4e58-496f-90b1-ffd7099518dd");
    expect(result.body[0].author).toEqual("Deb Bierce");

    expect(result.body[0].votes).toBeGreaterThan(166);
  });
});

describe("GET /downVote - decrement votes to post", () => {
  it("downvote API Request", async () => {
    const response = await request("http://localhost:3001")
      .post("/downvote/e94078e9-4e58-496f-90b1-ffd7099518dd")
      .set("Accept", "application/json");

    expect(response.body).toEqual("votes decremented successfully.");

    const result = await request("http://localhost:3001")
      .get("/top")
      .set("Accept", "application/json");
    expect(result.statusCode).toEqual(200);
    expect(result.body.length).toEqual(10);
    expect(result.body[0].uuid).toEqual("e94078e9-4e58-496f-90b1-ffd7099518dd");
    expect(result.body[0].author).toEqual("Deb Bierce");

    expect(result.body[0].votes).toBeLessThanOrEqual(166);
  });
});
