import app from "../app";
import request from "supertest";

describe("GET all restaurants", () => {
	// eslint-disable-next-line jest/expect-expect
	test("should return a 200 success", async () => {
		await request(app).get("/v1/restaurants/1").expect(200);
	});
});

describe("GET single restaurant", () => {
	// eslint-disable-next-line jest/expect-expect
	test("should return a 200 success", async () => {
		await request(app).get("/v1/search/restaurant/401ec1d7-e447-436a-b7ce-34e63ed262e5").expect(200);
	});
});
