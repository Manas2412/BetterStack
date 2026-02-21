import { describe, it, expect } from "bun:test";
import axios from "axios";
let BASE_URL = "http://localhost:3002"

describe("Website get created", () => {
    it("Website not created if url is not present", async () => {
        try {
            await axios.post(`${BASE_URL}/website`, {

            });
            expect(false, "Website created when it shouldn't");
        } catch (err) {

        }
    })
})